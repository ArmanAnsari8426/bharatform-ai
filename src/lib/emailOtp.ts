import emailjs from "@emailjs/browser";

/**
 * Real client-side Email OTP using EmailJS.
 *
 * This sends ACTUAL emails from the browser (no backend needed).
 *
 * Setup (free, 5 min):
 *  1. Create account at https://www.emailjs.com
 *  2. Add an Email Service (Gmail/Outlook) → copy SERVICE ID
 *  3. Create an Email Template with variables: {{passcode}}, {{to_email}}, {{time}}
 *     → copy TEMPLATE ID
 *  4. Account → API Keys → copy PUBLIC KEY
 *  5. Put them in .env.local:
 *       VITE_EMAILJS_SERVICE_ID=...
 *       VITE_EMAILJS_TEMPLATE_ID=...
 *       VITE_EMAILJS_PUBLIC_KEY=...
 *
 * If not configured, falls back to a demo OTP shown on screen.
 */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export const isEmailJsConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const OTP_STORE = "bf-email-otp-store";

type OtpEntry = { code: string; expiresAt: number; email: string };

function saveOtp(email: string, code: string) {
  const entry: OtpEntry = { code, email: email.toLowerCase(), expiresAt: Date.now() + 5 * 60 * 1000 };
  localStorage.setItem(OTP_STORE, JSON.stringify(entry));
}

function readOtp(): OtpEntry | null {
  try {
    return JSON.parse(localStorage.getItem(OTP_STORE) || "null");
  } catch {
    return null;
  }
}

function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send an OTP to the given email.
 * Returns { sent: true } on real send, or { sent: true, demoOtp } in fallback mode.
 */
export async function sendEmailOtp(
  email: string
): Promise<{ success: boolean; error?: string; demoOtp?: string; real?: boolean }> {
  const code = genCode();
  saveOtp(email, code);

  if (!isEmailJsConfigured) {
    // Fallback: show OTP on screen for testing
    return { success: true, demoOtp: code, real: false };
  }

  try {
    await emailjs.send(
      SERVICE_ID!,
      TEMPLATE_ID!,
      {
        passcode: code,
        to_email: email,
        email: email,
        to_name: email.split("@")[0],
        time: new Date().toLocaleString("en-IN"),
        app_name: "BharatForm AI",
      },
      { publicKey: PUBLIC_KEY! }
    );
    return { success: true, real: true };
  } catch (e: any) {
    // If sending fails, still allow demo fallback so user isn't blocked
    return { success: true, demoOtp: code, real: false, error: e?.text || e?.message };
  }
}

/** Verify the OTP the user typed. */
export function verifyEmailOtp(email: string, code: string): { success: boolean; error?: string } {
  const entry = readOtp();
  if (!entry) return { success: false, error: "No OTP found. Please request a new one." };
  if (entry.email !== email.toLowerCase()) return { success: false, error: "Email mismatch. Request a new OTP." };
  if (Date.now() > entry.expiresAt) return { success: false, error: "OTP expired. Request a new one." };
  if (entry.code !== code.trim()) return { success: false, error: "Incorrect OTP. Try again." };
  localStorage.removeItem(OTP_STORE);
  return { success: true };
}
