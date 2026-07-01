import { useState, useEffect } from "react";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export type AdminData = {
  users: any[];
  feedback: any[];
  transactions: any[];
  analyses: any[];
  loading: boolean;
};

// Helper to read from local storage safely
function readLocal<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
}

export function useAdminData(tick: number): AdminData {
  const [data, setData] = useState<AdminData>({
    users: [],
    feedback: [],
    transactions: [],
    analyses: [],
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchRealData() {
      if (isSupabaseConfigured) {
        const sb = getSupabase();
        if (sb) {
          try {
            // Fetch concurrently from real database
            const [
              { data: profiles, error: pErr },
              { data: fb, error: fErr },
              { data: txns, error: tErr },
              { data: anls, error: aErr }
            ] = await Promise.all([
              sb.from("profiles").select("*").order("created_at", { ascending: false }),
              sb.from("feedback").select("*").order("created_at", { ascending: false }),
              sb.from("transactions").select("*").order("created_at", { ascending: false }),
              sb.from("analyses").select("*").order("created_at", { ascending: false })
            ]);
            
            if (pErr) console.error("Profiles err:", pErr);
            if (fErr) console.error("Feedback err:", fErr);
            if (tErr) console.error("Txn err:", tErr);
            if (aErr) console.error("Analyses err:", aErr);

            if (mounted) {
              // If RLS blocked the query (returned null), fallback to local storage
              // so the admin dashboard doesn't just show 0 when testing without updating RLS rules.
              if (profiles === null && fb === null && txns === null) {
                 setData({
                  users: readLocal("bf-users", []),
                  feedback: readLocal("bf-launch-supporters", []),
                  transactions: readLocal("bf-transactions", []),
                  analyses: readLocal("bf-analyses", []),
                  loading: false,
                });
                return;
              }

              setData({
                // Map DB schema to local naming convention so UI components don't break
                users: (profiles || []).map(p => ({ ...p, createdAt: p.created_at })),
                feedback: (fb || []).map(f => ({ ...f, createdAt: f.created_at })),
                transactions: (txns || []).map(t => ({ ...t, createdAt: t.created_at })),
                analyses: (anls || []).map(a => ({ ...a, createdAt: a.created_at })),
                loading: false,
              });
            }
            return;
          } catch (e) {
            console.error("Admin data fetch error:", e);
          }
        }
      }

      // Fallback: Read from local storage (Demo Mode)
      if (mounted) {
        setData({
          users: readLocal("bf-users", []),
          feedback: readLocal("bf-launch-supporters", []),
          transactions: readLocal("bf-transactions", []),
          analyses: readLocal("bf-analyses", []),
          loading: false,
        });
      }
    }

    fetchRealData();

    return () => { mounted = false; };
  }, [tick]); // Refetch whenever `tick` increments (from real-time context triggers or polling)

  return data;
}
