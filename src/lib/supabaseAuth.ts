import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Session } from "./auth";

const SESSION_KEY = "bf-session";

/** Map a Supabase user/session into the app's local Session shape. */
function mapSession(sbUser: any): Session {
  const meta = sbUser?.user_metadata || {};
  return {
    userId: sbUser?.id || "",
    name: meta.name || meta.full_name || sbUser?.email?.split("@")[0] || "Citizen",
    email: sbUser?.email || "",
    phone: sbUser?.phone || meta.phone || undefined,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
}

/** Mirror the Supabase session into localStorage so getSession() stays synchronous. */
function writeMirror(session: Session | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

/** Save extra user info to the `profiles` table (best-effort). */
async function upsertProfile(userId: string, data: { name?: string; email?: string; phone?: string }) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.from("profiles").upsert({
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      updated_at: new Date().toISOString(),
    });
  } catch {
    /* table may not exist yet — non-fatal */
  }
}

export async function sbSignUp(args: { name: string; email: string; phone?: string; password: string }) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.signUp({
    email: args.email,
    password: args.password,
    options: { data: { name: args.name, phone: args.phone } },
  });
  if (error) return { success: false as const, error: error.message };
  const user = data.user;
  if (user) await upsertProfile(user.id, { name: args.name, email: args.email, phone: args.phone });
  // If email confirmation is required, there may be no session yet
  if (!data.session) {
    return { success: true as const, needsConfirmation: true, session: undefined };
  }
  const session = mapSession(data.user);
  writeMirror(session);
  return { success: true as const, session };
}

export async function sbSignInPassword(email: string, password: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { success: false as const, error: error.message };
  const session = mapSession(data.user);
  writeMirror(session);
  return { success: true as const, session };
}

export async function sbSendEmailOtp(email: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) return { success: false as const, error: error.message };
  return { success: true as const };
}

export async function sbVerifyEmailOtp(email: string, token: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { success: false as const, error: error.message };
  const session = mapSession(data.user);
  writeMirror(session);
  return { success: true as const, session };
}

export async function sbSendPhoneOtp(phone: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.auth.signInWithOtp({ phone });
  if (error) return { success: false as const, error: error.message };
  return { success: true as const };
}

export async function sbVerifyPhoneOtp(phone: string, token: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) return { success: false as const, error: error.message };
  const session = mapSession(data.user);
  writeMirror(session);
  return { success: true as const, session };
}

export async function sbResetPasswordForEmail(email: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#reset-password`,
  });
  if (error) return { success: false as const, error: error.message };
  return { success: true as const };
}

export async function sbUpdatePassword(newPassword: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) return { success: false as const, error: error.message };
  return { success: true as const };
}

export async function sbSignInGoogle() {
  const sb = getSupabase();
  if (!sb) return null;
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) return { success: false as const, error: error.message };
  // Browser redirects to Google; session is set on return.
  return { success: true as const, redirecting: true };
}

export async function sbSignOut() {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
  writeMirror(null);
}

/** Hydrate the local session mirror from Supabase on app load + subscribe to changes. */
export function initSupabaseSessionSync(onChange?: (s: Session | null) => void) {
  const sb = getSupabase();
  if (!sb) return () => {};

  // Initial hydrate
  sb.auth.getSession().then(({ data }) => {
    if (data.session?.user) {
      const s = mapSession(data.session.user);
      writeMirror(s);
      onChange?.(s);
    }
  });

  // Live updates (sign in / out / token refresh / OAuth return)
  const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const s = mapSession(session.user);
      writeMirror(s);
      onChange?.(s);
    } else {
      writeMirror(null);
      onChange?.(null);
    }
  });

  return () => sub.subscription.unsubscribe();
}

export { isSupabaseConfigured };
