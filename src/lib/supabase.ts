import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase backend client.
 *
 * Provides REAL backend functionality:
 *  - Authentication (email/password, OTP, OAuth, sessions)
 *  - PostgreSQL database (users, feedback, transactions, content)
 *  - Row Level Security
 *
 * To enable, add to .env.local:
 *   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your-anon-public-key
 *
 * If not configured, the app gracefully falls back to local (browser) auth
 * so development keeps working without a backend.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "bf-supabase-auth",
      },
    });
  }
  return _client;
}

export function backendStatus() {
  return {
    configured: isSupabaseConfigured,
    url: SUPABASE_URL || null,
    provider: isSupabaseConfigured ? "Supabase (PostgreSQL + Auth)" : "Local (browser storage)",
  };
}
