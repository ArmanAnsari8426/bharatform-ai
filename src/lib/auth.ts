// Hybrid auth system:
//  - Uses Supabase (real backend) when VITE_SUPABASE_URL + ANON_KEY are configured
//  - Falls back to local (browser) auth otherwise, so dev keeps working
import {
  isSupabaseConfigured,
  sbSignUp,
  sbSignInPassword,
  sbSendEmailOtp,
  sbVerifyEmailOtp,
  sbSendPhoneOtp,
  sbVerifyPhoneOtp,
  sbSignInGoogle,
  sbSignOut,
  sbResetPasswordForEmail,
  sbUpdatePassword,
} from "./supabaseAuth";
import { isEmailJsConfigured, sendEmailOtp, verifyEmailOtp } from "./emailOtp";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: number;
};

export type Session = {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  expiresAt: number;
};

const USERS_KEY = "bf-users";
const SESSION_KEY = "bf-session";
const OTP_KEY = "bf-otp";

// Simple SHA-256 hash (uses Web Crypto API — real, secure)
async function hashPassword(password: string, salt: string = "bharatform-2026"): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getSession(): Session | null {
  try {
    const sess = JSON.parse(localStorage.getItem(SESSION_KEY) || "null") as Session | null;
    if (!sess) return null;
    if (sess.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return sess;
  } catch {
    return null;
  }
}

function setSession(user: StoredUser) {
  const sess: Session = {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
}

export function signOut() {
  if (isSupabaseConfigured) {
    sbSignOut().catch(() => {});
  }
  localStorage.removeItem(SESSION_KEY);
}

/** Whether the app is running against the real Supabase backend. */
export function isBackendLive(): boolean {
  return isSupabaseConfigured;
}

// Validation
function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
}

function validatePhone(phone: string): string | null {
  if (!phone) return "Phone is required";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return "Phone must be at least 10 digits";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

// SIGN UP
export async function signUp({
  name,
  email,
  phone,
  password,
}: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<{ success: boolean; error?: string; session?: Session }> {
  if (!name?.trim()) return { success: false, error: "Name is required" };
  const emailErr = validateEmail(email);
  if (emailErr) return { success: false, error: emailErr };
  if (phone) {
    const phoneErr = validatePhone(phone);
    if (phoneErr) return { success: false, error: phoneErr };
  }
  const pwErr = validatePassword(password);
  if (pwErr) return { success: false, error: pwErr };

  // Real backend (Supabase)
  if (isSupabaseConfigured) {
    const res = await sbSignUp({ name, email, phone, password });
    if (res) {
      if (!res.success) {
        // Specific Supabase error for duplicate email
        const err = res.error?.toLowerCase() || "";
        if (err.includes("already registered") || err.includes("duplicate")) {
          return { success: false, error: "❌ Yeh email pehle se registered hai. Login page par jayein." };
        }
        return { success: false, error: res.error };
      }
      if ((res as any).needsConfirmation) {
        return { success: false, error: "Check your email to confirm your account, then sign in." };
      }
      return { success: true, session: res.session };
    }
  }

  // Local fallback duplicate check
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "❌ Yeh email pehle se use ho chuki hai. Login karein." };
  }
  if (phone && users.find((u) => u.phone === phone)) {
    return { success: false, error: "An account with this phone already exists." };
  }

  const passwordHash = await hashPassword(password);
  const user: StoredUser = {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    passwordHash,
    createdAt: Date.now(),
  };
  users.push(user);
  saveUsers(users);
  setSession(user);

  return {
    success: true,
    session: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}

// SIGN IN with email + password
export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string; session?: Session }> {
  const emailErr = validateEmail(email);
  if (emailErr) return { success: false, error: emailErr };
  if (!password) return { success: false, error: "Password is required" };

  // Real backend
  if (isSupabaseConfigured) {
    const res = await sbSignInPassword(email, password);
    if (res) {
      if (!res.success) return { success: false, error: res.error };
      return { success: true, session: res.session };
    }
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { success: false, error: "No account found with this email. Click 'Sign up' below to create one." };
  }
  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: "Incorrect password. Try again." };
  }
  setSession(user);
  return {
    success: true,
    session: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}

// OTP system (simulated — in production this would be SMS/email gateway)
export function generateOTP(identifier: string): { otp: string; expiresAt: number } {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  const otps = JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
  otps[identifier] = { otp, expiresAt };
  localStorage.setItem(OTP_KEY, JSON.stringify(otps));
  return { otp, expiresAt };
}

export function verifyOTP(identifier: string, otp: string): boolean {
  const otps = JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
  const entry = otps[identifier];
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) return false;
  if (entry.otp !== otp.trim()) return false;
  delete otps[identifier];
  localStorage.setItem(OTP_KEY, JSON.stringify(otps));
  return true;
}

// SIGN IN with phone + OTP
export async function signInWithPhoneOTP(
  phone: string,
  otp: string
): Promise<{ success: boolean; error?: string; session?: Session }> {
  const phoneErr = validatePhone(phone);
  if (phoneErr) return { success: false, error: phoneErr };
  if (!otp) return { success: false, error: "OTP is required" };

  // Real backend
  if (isSupabaseConfigured) {
    const res = await sbVerifyPhoneOtp(phone, otp);
    if (res) {
      if (!res.success) return { success: false, error: res.error };
      return { success: true, session: res.session };
    }
  }

  if (!verifyOTP(phone, otp)) {
    return { success: false, error: "Invalid or expired OTP" };
  }

  const users = getUsers();
  let user = users.find((u) => u.phone === phone);

  // Auto-create account on first OTP login
  if (!user) {
    user = {
      id: generateId(),
      name: "Citizen " + phone.slice(-4),
      email: `${phone.replace(/\D/g, "")}@phone.bharatform.ai`,
      phone,
      passwordHash: await hashPassword(otp + Date.now()),
      createdAt: Date.now(),
    };
    users.push(user);
    saveUsers(users);
  }

  setSession(user);
  return {
    success: true,
    session: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}

// SIGN IN with email + OTP (magic link style)
export async function signInWithEmailOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string; session?: Session }> {
  const emailErr = validateEmail(email);
  if (emailErr) return { success: false, error: emailErr };
  if (!otp) return { success: false, error: "OTP is required" };

  // Real backend (Supabase)
  if (isSupabaseConfigured) {
    const res = await sbVerifyEmailOtp(email, otp);
    if (res) {
      if (!res.success) return { success: false, error: res.error };
      return { success: true, session: res.session };
    }
  }

  // EmailJS / local email-OTP verification (real email sent client-side)
  const emailCheck = verifyEmailOtp(email, otp);
  if (!emailCheck.success) {
    return { success: false, error: emailCheck.error || "Invalid or expired OTP" };
  }

  const users = getUsers();
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // Auto-create account on first OTP login
  if (!user) {
    user = {
      id: generateId(),
      name: email.split("@")[0],
      email: email.toLowerCase(),
      passwordHash: await hashPassword(otp + Date.now()),
      createdAt: Date.now(),
    };
    users.push(user);
    saveUsers(users);
  }

  setSession(user);
  return {
    success: true,
    session: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}

// Send an OTP — uses Supabase email/SMS gateway when live, else local demo OTP.
// Returns { demoOtp } only in local mode (so the UI can show it for testing).
export async function sendOtp(
  identifier: string,
  channel: "email" | "phone"
): Promise<{ success: boolean; error?: string; demoOtp?: string; real?: boolean }> {
  // 1) Supabase backend (real email + SMS) if configured
  if (isSupabaseConfigured) {
    const res = channel === "email" ? await sbSendEmailOtp(identifier) : await sbSendPhoneOtp(identifier);
    if (res) {
      if (!res.success) return { success: false, error: res.error };
      return { success: true, real: true };
    }
  }

  // 2) Email: real client-side email via EmailJS (no backend needed)
  if (channel === "email" && isEmailJsConfigured) {
    const res = await sendEmailOtp(identifier);
    return { success: res.success, error: res.error, demoOtp: res.demoOtp, real: res.real };
  }

  // 3) Email fallback: still uses the EmailJS module (returns demo OTP if not configured)
  if (channel === "email") {
    const res = await sendEmailOtp(identifier);
    return { success: true, demoOtp: res.demoOtp, real: false };
  }

  // 4) Phone fallback: local demo OTP
  const { otp } = generateOTP(identifier);
  return { success: true, demoOtp: otp, real: false };
}

export async function resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    const res = await sbResetPasswordForEmail(email);
    if (res && !res.success) return { success: false, error: res.error };
    return { success: true };
  }
  // Local fallback: just return success to simulate email sent
  return { success: true };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    const res = await sbUpdatePassword(newPassword);
    if (res && !res.success) return { success: false, error: res.error };
    return { success: true };
  }
  return { success: true };
}

// "Continue with Google" — real OAuth via Supabase when live, else demo user.
export async function signInWithGoogle(): Promise<{ success: boolean; session?: Session; error?: string; redirecting?: boolean }> {
  if (isSupabaseConfigured) {
    const res = await sbSignInGoogle();
    if (res) {
      if (!res.success) return { success: false, error: res.error };
      return { success: true, redirecting: true };
    }
  }
  // Simulated demo user
  const users = getUsers();
  const demoEmail = "demo.google@bharatform.ai";
  let user = users.find((u) => u.email === demoEmail);
  if (!user) {
    user = {
      id: generateId(),
      name: "Demo Google User",
      email: demoEmail,
      passwordHash: await hashPassword("google-oauth-" + Date.now()),
      createdAt: Date.now(),
    };
    users.push(user);
    saveUsers(users);
  }
  setSession(user);
  return {
    success: true,
    session: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}
