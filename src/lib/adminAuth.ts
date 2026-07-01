// Admin authentication — email + password, two roles: super-admin + admin
import type { Session } from "./auth";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "super-admin" | "admin";
  passwordHash: string;
  createdAt: number;
  lastLoginAt?: number;
};

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  role: "super-admin" | "admin";
  expiresAt: number;
};

const ADMIN_KEY = "bf-admins";
const ADMIN_SESSION = "bf-admin-session";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "bharatform-admin-2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getAdmins(): AdminUser[] {
  try {
    const stored = JSON.parse(localStorage.getItem(ADMIN_KEY) || "[]");
    return stored;
  } catch {
    return [];
  }
}

function saveAdmins(admins: AdminUser[]) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
}

// SEED default super-admin on first run (idempotent — always ensures defaults exist)
let seedPromise: Promise<void> | null = null;

export async function seedDefaultAdmin() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const admins = getAdmins();
    const needsSuper = !admins.find(a => a.email === "superadmin@bharatform.ai");
    const needsAdmin = !admins.find(a => a.email === "admin@bharatform.ai");
    if (!needsSuper && !needsAdmin) return;

    const updated = [...admins];

    if (needsSuper) {
      updated.push({
        id: "super_001",
        email: "superadmin@bharatform.ai",
        name: "Super Admin",
        role: "super-admin",
        passwordHash: await hashPassword("Bharat@1947"),
        createdAt: Date.now(),
      });
    }

    if (needsAdmin) {
      updated.push({
        id: "admin_001",
        email: "admin@bharatform.ai",
        name: "Operations Admin",
        role: "admin",
        passwordHash: await hashPassword("Admin@2026"),
        createdAt: Date.now(),
      });
    }

    saveAdmins(updated);
  })();
  return seedPromise;
}

export function getAdminSession(): AdminSession | null {
  try {
    const sess = JSON.parse(localStorage.getItem(ADMIN_SESSION) || "null");
    if (!sess) return null;
    if (sess.expiresAt < Date.now()) {
      localStorage.removeItem(ADMIN_SESSION);
      return null;
    }
    return sess;
  } catch {
    return null;
  }
}

export function adminSignOut() {
  localStorage.removeItem(ADMIN_SESSION);
}

export async function adminSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }
  await seedDefaultAdmin();
  const admins = getAdmins();
  const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin) {
    return { success: false, error: "No admin account found with this email" };
  }
  const hash = await hashPassword(password);
  if (admin.passwordHash !== hash) {
    return { success: false, error: "Incorrect password" };
  }
  admin.lastLoginAt = Date.now();
  const idx = admins.findIndex((a) => a.id === admin.id);
  admins[idx] = admin;
  saveAdmins(admins);

  const session: AdminSession = {
    userId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };
  localStorage.setItem(ADMIN_SESSION, JSON.stringify(session));
  return { success: true, session };
}

export async function createAdmin(
  byRole: "super-admin",
  data: { name: string; email: string; password: string; role: "admin" | "super-admin" }
): Promise<{ success: boolean; error?: string }> {
  if (byRole !== "super-admin") {
    return { success: false, error: "Only super admins can create new admins" };
  }
  const admins = getAdmins();
  if (admins.find((a) => a.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "An admin with this email already exists" };
  }
  const newAdmin: AdminUser = {
    id: `admin_${Date.now()}`,
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
    passwordHash: await hashPassword(data.password),
    createdAt: Date.now(),
  };
  admins.push(newAdmin);
  saveAdmins(admins);
  return { success: true };
}

export async function changeAdminPassword(
  adminId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }
  const admins = getAdmins();
  const idx = admins.findIndex((a) => a.id === adminId);
  if (idx < 0) return { success: false, error: "Admin not found" };
  admins[idx].passwordHash = await hashPassword(newPassword);
  saveAdmins(admins);
  return { success: true };
}

export function deleteAdmin(adminId: string): { success: boolean; error?: string } {
  const admins = getAdmins();
  const idx = admins.findIndex((a) => a.id === adminId);
  if (idx < 0) return { success: false, error: "Admin not found" };
  if (admins[idx].id === "super_001") {
    return { success: false, error: "Cannot delete root super admin" };
  }
  admins.splice(idx, 1);
  saveAdmins(admins);
  return { success: true };
}

export function listAdmins(): AdminUser[] {
  return getAdmins().map((a) => ({ ...a, passwordHash: "***" }));
}

// Re-export for convenience
export type { Session };
