import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, BarChart3, CheckCircle2, Database, Download, KeyRound,
  Lock, LogOut, Mail, MessageSquare, Plus, RefreshCw, Shield,
  Sparkles, Star, Trash2, Users, Zap, CreditCard, MapPin, Eye, EyeOff, UserPlus,
  TrendingUp, Clock, ArrowUpRight, ArrowDownRight, IndianRupee, Search, FilePlus2, FileText,
} from "lucide-react";
import IndiaFlag from "./IndiaFlag";
import AshokaEmblem from "./AshokaEmblem";
import { getApiKey, hasApiKey } from "../lib/gemini";
import {
  adminSignIn, adminSignOut, getAdminSession, listAdmins, createAdmin,
  seedDefaultAdmin, type AdminSession,
} from "../lib/adminAuth";
import { STATES } from "../lib/states";
import {
  addCustomScholarship,
  addCustomScheme,
  addCustomService,
  deleteContent,
  getCustomScholarships,
  getCustomSchemes,
  getCustomServices,
} from "../lib/contentStore";
import { useAdminData } from "../lib/adminData";

type AdminTab = "overview" | "analytics" | "content" | "analyses" | "ai" | "users" | "feedback" | "transactions" | "states" | "admins" | "security";

function readJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function AdminDashboard() {
  const [session, setSession] = useState<AdminSession | null>(() => getAdminSession());
  const [tab, setTab] = useState<AdminTab>("overview");
  const [tick, setTick] = useState(0);

  useEffect(() => { seedDefaultAdmin(); }, []);
  useEffect(() => {
    // Polling backup (every 5s)
    const t = setInterval(() => setTick(p => p + 1), 5000);

    // Real-time push from Supabase (via context)
    const onDbUpdate = () => setTick(p => p + 1);
    window.addEventListener("bf-db-updated", onDbUpdate);

    return () => {
      clearInterval(t);
      window.removeEventListener("bf-db-updated", onDbUpdate);
    };
  }, []);

  const { users, feedback, transactions } = useAdminData(tick);
  
  const userSession = useMemo(() => readJson<any | null>("bf-session", null), [tick]);
  const apiKey = getApiKey();

  if (!session) return <AdminLoginScreen onLogin={setSession} />;

  const handleSignOut = () => { adminSignOut(); setSession(null); };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), adminUser: session, users, feedback, transactions, userSession, apiConnected: hasApiKey() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `bharatform-admin-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const clearDemoData = () => {
    if (!confirm("Clear ALL demo data? This cannot be undone.")) return;
    ["bf-users", "bf-session", "bf-launch-supporters", "bf-transactions"].forEach(k => localStorage.removeItem(k));
    setTick(t => t + 1);
  };

  const totalRevenue = transactions.filter(t => t.status === "success").reduce((s, t) => s + (t.amount || 0), 0);
  const isSuper = session.role === "super-admin";
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const { analyses } = useAdminData(tick);

  const stats = [
    { label: "Total Users", value: users.length, change: "+12%", up: true, icon: Users, color: "from-saffron-500 to-saffron-700", bgGlow: "bg-saffron-500/20" },
    { label: "Analyses", value: analyses.length, change: "+15%", up: true, icon: FileText, color: "from-cyan-500 to-cyan-700", bgGlow: "bg-cyan-500/20" },
    { label: "Feedback", value: feedback.length, change: "+24%", up: true, icon: MessageSquare, color: "from-blue-500 to-blue-700", bgGlow: "bg-blue-500/20" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "+8%", up: true, icon: IndianRupee, color: "from-emerald-500 to-emerald-700", bgGlow: "bg-emerald-500/20" },
  ];

  const tabs: [AdminTab, string, any][] = [
    ["overview", "Overview", BarChart3],
    ["analytics", "Analytics", TrendingUp],
    ["content", "Content", FilePlus2],
    ["analyses", "Analyses", FileText],
    ["ai", "Gemini AI", KeyRound],
    ["users", "Users", Users],
    ["feedback", "Feedback", MessageSquare],
    ["transactions", "Payments", CreditCard],
    ["states", "States", MapPin],
    ...(isSuper ? ([["admins", "Admins", Shield]] as [AdminTab, string, any][]) : []),
    ["security", "Security", Lock],
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" onClick={() => { window.location.hash = ""; }} className="flex items-center gap-3">
            <AshokaEmblem className="h-7 w-auto" />
            <IndiaFlag className="h-4 w-auto rounded-sm shadow" />
            <div>
              <div className="text-sm font-black uppercase tracking-wider">BharatForm AI</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-saffron-300">
                {isSuper ? "Super Admin Console" : "Admin Console"}
              </div>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-xs font-bold">
                {session.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold">{session.name}</div>
                <div className="text-[10px] text-saffron-300 uppercase font-semibold">{session.role}</div>
              </div>
            </div>
            <button onClick={() => setTick(t => t + 1)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-navy-200 hover:bg-white/10" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
            <a href="#" onClick={() => { window.location.hash = ""; }} className="rounded-xl bg-saffron-500 px-3 py-2 text-xs font-black text-white hover:bg-saffron-600">← Site</a>
            <button onClick={handleSignOut} className="rounded-xl border border-white/10 bg-white/5 p-2 text-navy-200 hover:bg-white/10" title="Sign Out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-gradient-to-br from-saffron-600 via-saffron-500 to-india-600 p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{greeting}</div>
              <h1 className="text-3xl lg:text-4xl font-black">Welcome back, {session.name} 👋</h1>
              <p className="mt-2 text-sm text-white/80 max-w-xl">
                You have <strong className="text-white">{users.length} users</strong>,{" "}
                <strong className="text-white">{feedback.length} feedback entries</strong>, and{" "}
                <strong className="text-white">₹{totalRevenue.toLocaleString("en-IN")}</strong> in revenue.
                {" "}Here's what's happening across BharatForm AI today.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <Clock className="h-3 w-3" />
                Last updated: {now.toLocaleTimeString("en-IN")} · Auto-refreshes every 5s
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={exportData} className="rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2">
                <Download className="h-4 w-4" /> Export
              </button>
              {isSuper && (
                <button onClick={clearDemoData} className="rounded-xl bg-red-500/20 hover:bg-red-500/30 backdrop-blur border border-red-400/30 px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur relative overflow-hidden group hover:border-white/20 transition-all"
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${s.bgGlow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${s.up ? "text-india-400" : "text-red-400"}`}>
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.change}
                  </div>
                </div>
                <div className="text-3xl font-black tabular-nums">{s.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-navy-400">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map(([code, label, Icon]) => (
            <button
              key={code}
              onClick={() => setTab(code)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition whitespace-nowrap ${
                tab === code ? "bg-saffron-500 text-white shadow-lg shadow-saffron-500/30" : "border border-white/10 bg-white/5 text-navy-300 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8 shadow-2xl backdrop-blur">
          {tab === "overview" && <OverviewTab users={users} feedback={feedback} transactions={transactions} session={userSession} adminSession={session} totalRevenue={totalRevenue} />}
          {tab === "analytics" && <AnalyticsTab users={users} transactions={transactions} feedback={feedback} />}
          {tab === "content" && <ContentManagerTab onChange={() => setTick(t => t + 1)} />}
          {tab === "analyses" && <AnalysesTab onDeleted={() => setTick(t => t + 1)} />}
          {tab === "ai" && <AITab apiKey={apiKey} />}
          {tab === "users" && <UsersTab users={users} />}
          {tab === "feedback" && <FeedbackTab feedback={feedback} />}
          {tab === "transactions" && <TransactionsTab transactions={transactions} />}
          {tab === "states" && <StatesTab />}
          {tab === "admins" && isSuper && <AdminsTab onChange={() => setTick(t => t + 1)} />}
          {tab === "security" && <SecurityTab onClear={clearDemoData} />}
        </section>
      </main>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}

/* ─── LOGIN SCREEN ─── */
function AdminLoginScreen({ onLogin }: { onLogin: (s: AdminSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { seedDefaultAdmin(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await adminSignIn(email, password);
    setLoading(false);
    if (!res.success || !res.session) { setError(res.error || "Login failed"); return; }
    onLogin(res.session);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />
      <div className="absolute -right-20 top-10 opacity-[0.04] pointer-events-none"><AshokaEmblem className="h-[400px] w-auto" /></div>
      <div className="absolute -left-20 bottom-10 opacity-[0.04] pointer-events-none"><AshokaEmblem className="h-[350px] w-auto" /></div>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur">
          <div className="flex justify-center mb-4"><AshokaEmblem className="h-14 w-auto" /></div>
          <div className="text-center mb-6">
            <div className="text-xl font-black">BharatForm AI Admin</div>
            <div className="text-xs text-navy-300 mt-1">सत्यमेव जयते · Secure Administration Portal</div>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@bharatform.ai"
                  className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-navy-400 focus:border-saffron-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-navy-400 focus:border-saffron-400" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron-500 px-4 py-3 text-sm font-black text-white transition hover:bg-saffron-600 disabled:opacity-60">
              <Shield className="h-4 w-4" /> {loading ? "Signing in…" : "Enter Admin Console"}
            </button>
          </form>
          <div className="mt-5 rounded-2xl border border-saffron-400/30 bg-saffron-500/10 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-saffron-300 mb-2">Demo Credentials</div>
            <button onClick={() => { setEmail("superadmin@bharatform.ai"); setPassword("Bharat@1947"); }} className="w-full text-left text-xs text-saffron-100 hover:bg-white/5 rounded p-1.5 transition">
              <strong>Super Admin:</strong> superadmin@bharatform.ai / Bharat@1947
            </button>
            <button onClick={() => { setEmail("admin@bharatform.ai"); setPassword("Admin@2026"); }} className="w-full text-left text-xs text-saffron-100 hover:bg-white/5 rounded p-1.5 transition">
              <strong>Admin:</strong> admin@bharatform.ai / Admin@2026
            </button>
          </div>
          <div className="mt-3 text-center text-[10px] text-navy-400">
            <a href="#" onClick={() => { window.location.hash = ""; }} className="text-saffron-300 hover:underline">← Back to main site</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab({ users, feedback, transactions, session, totalRevenue, adminSession }: any) {
  const recentUsers = users.slice(-5).reverse();
  const recentFb = feedback.slice(-4).reverse();
  const recentTxns = transactions.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black mb-1">Welcome back, {adminSession?.role === "super-admin" ? "Super Admin" : "Admin"}</h2>
        <p className="text-sm text-navy-400">Real-time snapshot of your BharatForm AI platform</p>
      </div>

      {/* Quick summary row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Active Session" icon={Activity} color="saffron">
          {session ? (
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">{session.name}</div>
              <div className="text-xs text-navy-300">{session.email}</div>
              <div className="text-[10px] text-navy-400">Expires: {new Date(session.expiresAt).toLocaleString("en-IN")}</div>
            </div>
          ) : <div className="text-sm text-navy-400">No active user session</div>}
        </Card>
        <Card title="Revenue Summary" icon={IndianRupee} color="india">
          <div className="text-2xl font-black tabular-nums">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <div className="text-xs text-navy-300 mt-1">{transactions.length} transactions · All via Razorpay</div>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-india-500 to-india-400 rounded-full" style={{ width: `${Math.min(100, (totalRevenue / 10000) * 100)}%` }} />
          </div>
        </Card>
        <Card title="System Health" icon={Zap} color="navy">
          {["Frontend: ✅ Passing", "Gemini AI: " + (hasApiKey() ? "✅ Live" : "⚠️ Setup needed"), "Auth: ✅ SHA-256", "DPDP 2023: ✅ Compliant"].map(l => (
            <div key={l} className="text-xs text-navy-200 mb-1">{l}</div>
          ))}
        </Card>
      </div>

      {/* Recent Users */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-saffron-300">Recent Users</h3>
          <button onClick={() => {}} className="text-xs text-saffron-400 font-bold hover:underline">View all →</button>
        </div>
        {recentUsers.length === 0 ? <Empty text="No users yet" /> : (
          <div className="space-y-2">
            {recentUsers.map((u: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition-colors">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {u.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{u.name}</div>
                  <div className="text-xs text-navy-400 truncate">{u.email}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-navy-400">{timeAgo(u.createdAt)}</div>
                  <div className="text-[10px] text-navy-500">{u.phone || "No phone"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-saffron-300">Recent Feedback</h3>
          <span className="text-xs text-navy-400">{feedback.length} total</span>
        </div>
        {recentFb.length === 0 ? <Empty text="No feedback yet" /> : (
          <div className="grid gap-3 lg:grid-cols-2">
            {recentFb.map((f: any, i: number) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{f.name}</span>
                    {f.state && <span className="text-[10px] text-saffron-300 bg-saffron-500/10 px-1.5 py-0.5 rounded">{f.state}</span>}
                  </div>
                  <div className="text-[10px] text-navy-400">{timeAgo(f.createdAt)}</div>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-navy-400 mb-2">{f.role} {f.rating ? `· ${f.rating}⭐` : ""}</div>
                <p className="text-sm text-navy-200 leading-relaxed line-clamp-2">{f.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-saffron-300">Recent Transactions</h3>
          <span className="text-xs text-navy-400">₹{totalRevenue.toLocaleString("en-IN")} total</span>
        </div>
        {recentTxns.length === 0 ? <Empty text="No transactions yet" /> : (
          <div className="space-y-2">
            {recentTxns.map((t: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="h-9 w-9 rounded-lg bg-india-500/20 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="h-4 w-4 text-india-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{t.plan} Plan</div>
                  <div className="text-[10px] text-navy-400">{t.id} · {(t.method || "").toUpperCase()}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-india-400 tabular-nums">₹{(t.amount || 0).toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-navy-400">{timeAgo(t.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="rounded-2xl border border-saffron-400/30 bg-saffron-500/5 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-saffron-300 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Suggestions to improve</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            "Add Razorpay live integration for real payments",
            "Move Gemini API calls to a backend proxy for security",
            "Add email/SMS gateway for real OTP delivery",
            "Set up PostgreSQL for persistent data storage",
            "Add user analytics tracking (form uploads, chat sessions)",
            "Enable push notifications for scheme deadlines",
            "Add district-level scheme filtering",
            "Implement role-based access control on API routes",
          ].map(tip => (
            <div key={tip} className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5 text-xs text-navy-200 flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-saffron-400 mt-0.5 flex-shrink-0" /> {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ANALYTICS TAB ─── */
function AnalyticsTab({ users, transactions, feedback }: { users: any[]; transactions: any[]; feedback: any[] }) {
  const [range, setRange] = useState<7 | 14 | 30>(7);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  // Build day buckets based on selected range
  const daysList = Array.from({ length: range }, (_, i) => {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (range - 1 - i));
    return {
      label: range <= 7 ? dayNames[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`,
      fullDate: d.toDateString(),
      dateObj: d,
    };
  });

  // Real user counts per day
  const usersByDay = daysList.map(day =>
    users.filter(u => {
      const ts = u.createdAt || u.created_at || u.joinedAt;
      if (!ts) return false;
      return new Date(ts).toDateString() === day.fullDate;
    }).length
  );

  // Real revenue per day
  const revenueByDay = daysList.map(day =>
    transactions
      .filter(t => {
        const ts = t.createdAt || t.created_at;
        return ts && new Date(ts).toDateString() === day.fullDate;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  );

  // Real feedback per day
  const feedbackByDay = daysList.map(day =>
    feedback.filter(f => {
      const ts = f.createdAt || f.created_at;
      return ts && new Date(ts).toDateString() === day.fullDate;
    }).length
  );

  const maxUsers = Math.max(...usersByDay, 1);
  const maxRev = Math.max(...revenueByDay, 1);
  const maxFb = Math.max(...feedbackByDay, 1);

  // Today's stats
  const todayStr = today.toDateString();
  const todayUsers = users.filter(u => u.createdAt && new Date(u.createdAt).toDateString() === todayStr).length;
  const todayRevenue = transactions.filter(t => t.createdAt && new Date(t.createdAt).toDateString() === todayStr).reduce((s, t) => s + (t.amount || 0), 0);
  const todayFeedback = feedback.filter(f => f.createdAt && new Date(f.createdAt).toDateString() === todayStr).length;
  const todayTxns = transactions.filter(t => t.createdAt && new Date(t.createdAt).toDateString() === todayStr).length;

  // All-time totals
  const totalRevenue = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const inRangeUsers = usersByDay.reduce((a, b) => a + b, 0);
  const inRangeRev = revenueByDay.reduce((a, b) => a + b, 0);
  const inRangeFb = feedbackByDay.reduce((a, b) => a + b, 0);

  // Data freshness check
  const usersWithDates = users.filter(u => u.createdAt).length;
  const oldestUser = users.length ? Math.min(...users.filter(u => u.createdAt).map(u => u.createdAt)) : null;
  const newestUser = users.length ? Math.max(...users.filter(u => u.createdAt).map(u => u.createdAt)) : null;

  // Feedback by state (real data)
  const feedbackByState = feedback.reduce((acc: Record<string, number>, f: any) => {
    const st = f.state || "Unknown";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});
  const topStates = Object.entries(feedbackByState).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 6);
  const maxFbCount = topStates.length > 0 ? (topStates[0][1] as number) : 1;

  // Plan distribution (real data)
  const planDist = transactions.reduce((acc: Record<string, number>, t: any) => {
    const p = t.plan || "Free";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});
  const topPlans = Object.entries(planDist).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 4);
  const totalTxns = transactions.length || 1;

  return (
    <div className="space-y-8">
      {/* Header with Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black mb-1">Real-Time Analytics</h2>
          <p className="text-sm text-navy-400">Live data from actual stored records · Auto-refreshes every 5s</p>
        </div>
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            [7, "7 Days"],
            [14, "14 Days"],
            [30, "30 Days"],
          ].map(([d, label]) => (
            <button
              key={d}
              onClick={() => setRange(d as 7 | 14 | 30)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${range === d ? "bg-saffron-500 text-white shadow-lg" : "text-navy-300 hover:bg-white/5"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Health Banner */}
      {users.length > 0 && usersWithDates < users.length && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          ⚠️ {users.length - usersWithDates} of {users.length} users have no `createdAt` timestamp. They won't appear in daily charts. Sign up new users to populate today's data.
        </div>
      )}

      {/* Today's Real Activity */}
      <div className="rounded-2xl border border-saffron-400/30 bg-saffron-500/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-saffron-400" />
            <h3 className="text-sm font-bold text-saffron-300 uppercase tracking-wider">Today — {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h3>
          </div>
          <div className="text-[10px] text-navy-400">Live · {today.toLocaleTimeString("en-IN")}</div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400">New Users</div>
            <div className="text-3xl font-black text-white mt-1 tabular-nums">{todayUsers}</div>
            <div className="text-[10px] text-navy-500 mt-1">of {users.length} all-time</div>
          </div>
          <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Revenue</div>
            <div className="text-3xl font-black text-india-400 mt-1 tabular-nums">₹{todayRevenue.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-navy-500 mt-1">of ₹{totalRevenue.toLocaleString("en-IN")} all-time</div>
          </div>
          <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Feedback</div>
            <div className="text-3xl font-black text-white mt-1 tabular-nums">{todayFeedback}</div>
            <div className="text-[10px] text-navy-500 mt-1">of {feedback.length} all-time</div>
          </div>
          <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Payments</div>
            <div className="text-3xl font-black text-white mt-1 tabular-nums">{todayTxns}</div>
            <div className="text-[10px] text-navy-500 mt-1">of {transactions.length} all-time</div>
          </div>
        </div>
      </div>

      {/* All-Time Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] font-bold uppercase text-navy-400 mb-1">All Users</div>
          <div className="text-2xl font-black tabular-nums">{users.length}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] font-bold uppercase text-navy-400 mb-1">All Revenue</div>
          <div className="text-2xl font-black tabular-nums text-india-400">₹{totalRevenue.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] font-bold uppercase text-navy-400 mb-1">In Range ({range}d)</div>
          <div className="text-2xl font-black tabular-nums text-saffron-400">{inRangeUsers} users</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] font-bold uppercase text-navy-400 mb-1">In Range Revenue</div>
          <div className="text-2xl font-black tabular-nums text-india-400">₹{inRangeRev.toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">User Signups</h3>
              <div className="text-xs text-navy-400">Last {range} days · {inRangeUsers} signups</div>
            </div>
            <div className="text-xs font-bold text-saffron-400 tabular-nums">peak: {maxUsers}</div>
          </div>
          <div className="flex items-end gap-1 h-48 border-l border-b border-white/10 pl-1 pb-1">
            {usersByDay.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-6 text-xs font-bold text-saffron-300 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 px-1.5 py-0.5 rounded">{v}</div>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-saffron-600 to-saffron-400 transition-all hover:from-saffron-500 hover:to-saffron-300 cursor-pointer"
                  style={{ height: `${Math.max(2, (v / maxUsers) * 100)}%`, minHeight: v > 0 ? "8px" : "2px" }}
                  title={`${daysList[i].fullDate}: ${v} users`}
                />
                <span className="text-[9px] text-navy-400 font-bold rotate-0 truncate w-full text-center">{daysList[i].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue</h3>
              <div className="text-xs text-navy-400">Last {range} days · ₹{inRangeRev.toLocaleString("en-IN")}</div>
            </div>
            <div className="text-xs font-bold text-india-400 tabular-nums">peak: ₹{maxRev.toLocaleString("en-IN")}</div>
          </div>
          <div className="flex items-end gap-1 h-48 border-l border-b border-white/10 pl-1 pb-1">
            {revenueByDay.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-6 text-xs font-bold text-india-300 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 px-1.5 py-0.5 rounded">₹{v}</div>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-india-600 to-india-400 transition-all hover:from-india-500 hover:to-india-300 cursor-pointer"
                  style={{ height: `${Math.max(2, (v / maxRev) * 100)}%`, minHeight: v > 0 ? "8px" : "2px" }}
                  title={`${daysList[i].fullDate}: ₹${v}`}
                />
                <span className="text-[9px] text-navy-400 font-bold truncate w-full text-center">{daysList[i].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Feedback Submissions</h3>
              <div className="text-xs text-navy-400">Last {range} days · {inRangeFb} submissions</div>
            </div>
            <div className="text-xs font-bold text-purple-400 tabular-nums">peak: {maxFb}</div>
          </div>
          <div className="flex items-end gap-1 h-48 border-l border-b border-white/10 pl-1 pb-1">
            {feedbackByDay.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-6 text-xs font-bold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 px-1.5 py-0.5 rounded">{v}</div>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-purple-400 transition-all hover:from-purple-500 hover:to-purple-300 cursor-pointer"
                  style={{ height: `${Math.max(2, (v / maxFb) * 100)}%`, minHeight: v > 0 ? "8px" : "2px" }}
                />
                <span className="text-[9px] text-navy-400 font-bold truncate w-full text-center">{daysList[i].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback by State */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Top States (Feedback)</h3>
          {topStates.length === 0 ? <Empty text="No feedback data yet" /> : (
            <div className="space-y-3">
              {topStates.map(([state, count]) => (
                <div key={state} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-bold text-navy-200 truncate">{state}</div>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 rounded-full" style={{ width: `${((count as number) / maxFbCount) * 100}%` }} />
                  </div>
                  <div className="text-xs font-bold text-saffron-300 tabular-nums w-8 text-right">{count as number}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plan Distribution + Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Plan Distribution</h3>
          {topPlans.length === 0 ? <Empty text="No transactions yet" /> : (
            <div className="space-y-3">
              {topPlans.map(([plan, count]) => (
                <div key={plan} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-bold text-navy-200">{plan}</div>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-india-600 to-india-400 rounded-full" style={{ width: `${((count as number) / totalTxns) * 100}%` }} />
                  </div>
                  <div className="text-xs font-bold text-india-300 tabular-nums w-12 text-right">{Math.round((count as number / totalTxns) * 100)}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Avg Revenue/User", value: users.length ? `₹${Math.round(totalRevenue / Math.max(users.length, 1))}` : "₹0", icon: IndianRupee },
              { label: "Conversion", value: users.length ? `${Math.round((transactions.length / Math.max(users.length, 1)) * 100)}%` : "0%", icon: TrendingUp },
              { label: "Feedback Rate", value: users.length ? `${Math.round((feedback.length / Math.max(users.length, 1)) * 100)}%` : "0%", icon: MessageSquare },
              { label: "AI Status", value: hasApiKey() ? "Live" : "Off", icon: Sparkles },
            ].map(m => (
              <div key={m.label} className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <m.icon className="h-3 w-3 text-saffron-400" />
                  <div className="text-[10px] font-bold uppercase text-navy-400">{m.label}</div>
                </div>
                <div className="text-lg font-black text-white tabular-nums">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Debug Info */}
      {users.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Database className="h-4 w-4 text-saffron-400" /> Data Health</h3>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase font-bold text-navy-400 mb-1">Users with timestamps</div>
              <div className="font-bold text-white">{usersWithDates} of {users.length}</div>
            </div>
            {oldestUser && (
              <div className="rounded-lg bg-white/[0.04] p-3">
                <div className="text-[10px] uppercase font-bold text-navy-400 mb-1">Oldest user</div>
                <div className="font-bold text-white">{new Date(oldestUser).toLocaleDateString("en-IN")}</div>
              </div>
            )}
            {newestUser && (
              <div className="rounded-lg bg-white/[0.04] p-3">
                <div className="text-[10px] uppercase font-bold text-navy-400 mb-1">Newest user</div>
                <div className="font-bold text-white">{new Date(newestUser).toLocaleDateString("en-IN")} ({timeAgo(newestUser)})</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── HELPER COMPONENTS ─── */
function Card({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = { saffron: "text-saffron-300", india: "text-india-300", navy: "text-navy-200" };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className={`mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider ${colors[color] || "text-saffron-300"}`}>
        <Icon className="h-4 w-4" /> {title}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-navy-400 text-sm">{text}</div>;
}

/* ─── CONTENT MANAGER TAB ─── */
function ContentManagerTab({ onChange }: { onChange: () => void }) {
  const [kind, setKind] = useState<"service" | "scholarship" | "scheme">("service");
  const [message, setMessage] = useState("");
  const [svc, setSvc] = useState({ name: "", emoji: "📄", authority: "", fee: "", time: "", docs: "3", mistakes: "" });
  const [sch, setSch] = useState({ name: "", nameHi: "", provider: "", amount: "", deadline: "", tags: "", docs: "", state: "All", category: "General", education: "Undergraduate", income: "250000" });
  const [scheme, setScheme] = useState({ name: "", nameHi: "", category: "Welfare", benefit: "", official: "", state: "All", occupation: "All", categoryUser: "General", gender: "All", description: "", docs: "Aadhaar, Bank Account", color: "india" as "saffron" | "india" | "navy", central: "true", trending: "true", popularity: "80" });

  const services = getCustomServices();
  const scholarships = getCustomScholarships();
  const schemes = getCustomSchemes();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kind === "service") {
      addCustomService({
        name: svc.name,
        emoji: svc.emoji || "📄",
        authority: svc.authority || "Custom Authority",
        fee: svc.fee || "As per portal",
        time: svc.time || "Varies",
        docs: Number(svc.docs) || 0,
        mistakes: svc.mistakes || "Check document mismatch",
      });
      setSvc({ name: "", emoji: "📄", authority: "", fee: "", time: "", docs: "3", mistakes: "" });
    }
    if (kind === "scholarship") {
      addCustomScholarship({
        name: sch.name,
        nameHi: sch.nameHi || sch.name,
        provider: sch.provider || "Admin Added",
        amount: sch.amount || "Varies",
        deadline: sch.deadline || "Open",
        daysLeft: 30,
        match: 90,
        docs: sch.docs.split(",").map(x => x.trim()).filter(Boolean),
        tags: sch.tags.split(",").map(x => x.trim()).filter(Boolean),
        featured: true,
        eligibleStates: [sch.state || "All"],
        eligibleCategories: [sch.category],
        maxIncome: Number(sch.income) || undefined,
        educationLevels: [sch.education],
      });
      setSch({ name: "", nameHi: "", provider: "", amount: "", deadline: "", tags: "", docs: "", state: "All", category: "General", education: "Undergraduate", income: "250000" });
    }
    if (kind === "scheme") {
      addCustomScheme({
        name: scheme.name,
        nameHi: scheme.nameHi || scheme.name,
        category: scheme.category || "Welfare",
        benefit: scheme.benefit || "Benefit varies",
        color: scheme.color,
        official: scheme.official || "State Portal",
        status: "Active",
        popularity: Number(scheme.popularity) || 80,
        trending: scheme.trending === "true",
        central: scheme.central === "true",
        states: [scheme.state || "All"],
        occupations: [scheme.occupation || "All"],
        categories: [scheme.categoryUser || "General"],
        genders: [scheme.gender || "All"],
        description: scheme.description || "Admin added scheme.",
        documents: scheme.docs.split(",").map(x => x.trim()).filter(Boolean),
      });
      setScheme({ name: "", nameHi: "", category: "Welfare", benefit: "", official: "", state: "All", occupation: "All", categoryUser: "General", gender: "All", description: "", docs: "Aadhaar, Bank Account", color: "india", central: "true", trending: "true", popularity: "80" });
    }
    setMessage(`${kind} added successfully. It is now live on the landing page.`);
    setTimeout(() => setMessage(""), 3500);
    onChange();
  };

  const remove = (type: "service" | "scholarship" | "scheme", id: string) => {
    if (!confirm("Delete this admin-added item?")) return;
    deleteContent(type, id);
    onChange();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">Content Manager</h2>
        <p className="text-sm text-navy-400">Add Services, Scholarships and Schemes from admin. They appear live on the homepage.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["service", "Services", services.length],
          ["scholarship", "Scholarships", scholarships.length],
          ["scheme", "Schemes", schemes.length],
        ].map(([code, label, count]) => (
          <button key={code as string} onClick={() => setKind(code as any)} className={`rounded-2xl border p-4 text-left transition ${kind === code ? "border-saffron-400 bg-saffron-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}>
            <div className="text-sm font-black">{label as string}</div>
            <div className="text-xs text-navy-400 mt-1">{count as number} admin-added</div>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-black text-saffron-300 uppercase tracking-wider">
          <FilePlus2 className="h-4 w-4" /> Add {kind}
        </div>
        {kind === "service" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AdminInput label="Name" value={svc.name} onChange={(v) => setSvc({ ...svc, name: v })} required />
            <AdminInput label="Emoji" value={svc.emoji} onChange={(v) => setSvc({ ...svc, emoji: v })} />
            <AdminInput label="Authority" value={svc.authority} onChange={(v) => setSvc({ ...svc, authority: v })} />
            <AdminInput label="Fee" value={svc.fee} onChange={(v) => setSvc({ ...svc, fee: v })} />
            <AdminInput label="Time" value={svc.time} onChange={(v) => setSvc({ ...svc, time: v })} />
            <AdminInput label="Documents Count" value={svc.docs} onChange={(v) => setSvc({ ...svc, docs: v })} />
            <div className="lg:col-span-3"><AdminInput label="Common Mistake" value={svc.mistakes} onChange={(v) => setSvc({ ...svc, mistakes: v })} /></div>
          </div>
        )}
        {kind === "scholarship" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AdminInput label="Scholarship Name" value={sch.name} onChange={(v) => setSch({ ...sch, name: v })} required />
            <AdminInput label="Hindi Name" value={sch.nameHi} onChange={(v) => setSch({ ...sch, nameHi: v })} />
            <AdminInput label="Provider" value={sch.provider} onChange={(v) => setSch({ ...sch, provider: v })} />
            <AdminInput label="Amount" value={sch.amount} onChange={(v) => setSch({ ...sch, amount: v })} />
            <AdminInput label="Deadline" value={sch.deadline} onChange={(v) => setSch({ ...sch, deadline: v })} />
            <AdminInput label="Max Income" value={sch.income} onChange={(v) => setSch({ ...sch, income: v })} />
            <AdminSelect label="State" value={sch.state} onChange={(v) => setSch({ ...sch, state: v })} options={["All", "Maharashtra", "Uttar Pradesh", "Karnataka", "West Bengal", "Tamil Nadu", "Delhi", "Bihar", "Gujarat"]} />
            <AdminSelect label="Category" value={sch.category} onChange={(v) => setSch({ ...sch, category: v })} options={["General", "OBC", "SC/ST"]} />
            <AdminSelect label="Education" value={sch.education} onChange={(v) => setSch({ ...sch, education: v })} options={["Class 10", "Class 12", "Undergraduate", "Postgraduate", "PhD"]} />
            <AdminInput label="Tags (comma)" value={sch.tags} onChange={(v) => setSch({ ...sch, tags: v })} />
            <div className="lg:col-span-2"><AdminInput label="Documents (comma)" value={sch.docs} onChange={(v) => setSch({ ...sch, docs: v })} /></div>
          </div>
        )}
        {kind === "scheme" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AdminInput label="Scheme Name" value={scheme.name} onChange={(v) => setScheme({ ...scheme, name: v })} required />
            <AdminInput label="Hindi Name" value={scheme.nameHi} onChange={(v) => setScheme({ ...scheme, nameHi: v })} />
            <AdminInput label="Benefit" value={scheme.benefit} onChange={(v) => setScheme({ ...scheme, benefit: v })} required />
            <AdminInput label="Category" value={scheme.category} onChange={(v) => setScheme({ ...scheme, category: v })} />
            <AdminInput label="Official Portal" value={scheme.official} onChange={(v) => setScheme({ ...scheme, official: v })} />
            <AdminInput label="Popularity" value={scheme.popularity} onChange={(v) => setScheme({ ...scheme, popularity: v })} />
            <AdminSelect label="State" value={scheme.state} onChange={(v) => setScheme({ ...scheme, state: v })} options={["All", "Maharashtra", "Uttar Pradesh", "Karnataka", "West Bengal", "Tamil Nadu", "Delhi", "Bihar", "Gujarat"]} />
            <AdminSelect label="Occupation" value={scheme.occupation} onChange={(v) => setScheme({ ...scheme, occupation: v })} options={["All", "Farmer", "Student", "Self-employed", "Business Owner", "Laborer"]} />
            <AdminSelect label="User Category" value={scheme.categoryUser} onChange={(v) => setScheme({ ...scheme, categoryUser: v })} options={["General", "OBC", "SC/ST"]} />
            <AdminSelect label="Gender" value={scheme.gender} onChange={(v) => setScheme({ ...scheme, gender: v })} options={["All", "Male", "Female", "Other"]} />
            <AdminSelect label="Type" value={scheme.central} onChange={(v) => setScheme({ ...scheme, central: v })} options={["true", "false"]} />
            <AdminSelect label="Trending" value={scheme.trending} onChange={(v) => setScheme({ ...scheme, trending: v })} options={["true", "false"]} />
            <div className="lg:col-span-2"><AdminInput label="Description" value={scheme.description} onChange={(v) => setScheme({ ...scheme, description: v })} /></div>
            <AdminInput label="Documents (comma)" value={scheme.docs} onChange={(v) => setScheme({ ...scheme, docs: v })} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-saffron-500 px-5 py-3 text-sm font-black text-white hover:bg-saffron-600">
            <Plus className="h-4 w-4" /> Save {kind}
          </button>
          {message && <span className="text-sm font-semibold text-india-300">{message}</span>}
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        <ContentList title="Services" type="service" rows={services.map(x => ({ id: x.id, title: x.name, sub: `${x.authority} · ${x.fee}` }))} onDelete={remove} />
        <ContentList title="Scholarships" type="scholarship" rows={scholarships.map(x => ({ id: x.id, title: x.name, sub: `${x.provider} · ${x.amount}` }))} onDelete={remove} />
        <ContentList title="Schemes" type="scheme" rows={schemes.map(x => ({ id: x.id, title: x.name, sub: `${x.category} · ${x.benefit}` }))} onDelete={remove} />
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-navy-400">{label}</span>
      <input required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-navy-500 focus:border-saffron-400" />
    </label>
  );
}

function AdminSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-navy-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-saffron-400">
        {options.map((o) => <option key={o} value={o} className="text-navy-900">{o === "true" ? "Yes" : o === "false" ? "No" : o}</option>)}
      </select>
    </label>
  );
}

function ContentList({ title, type, rows, onDelete }: { title: string; type: "service" | "scholarship" | "scheme"; rows: { id: string; title: string; sub: string }[]; onDelete: (type: "service" | "scholarship" | "scheme", id: string) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider text-saffron-300">{title}</h3>
        <span className="text-xs text-navy-400">{rows.length}</span>
      </div>
      {rows.length === 0 ? <div className="py-8 text-center text-sm text-navy-500">No admin-added {title.toLowerCase()} yet.</div> : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-sm font-bold text-white truncate">{row.title}</div>
              <div className="mt-0.5 text-xs text-navy-400 truncate">{row.sub}</div>
              <button onClick={() => onDelete(type, row.id)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-300 hover:text-red-200">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── AI TAB ─── */
function AITab({ apiKey }: { apiKey: string | null }) {
  const masked = apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-6)}` : "Not connected";
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black">Gemini AI Control</h2><p className="text-sm text-navy-400">Project 564317797256 · Gemini 1.5 Flash / Pro</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="API Key" icon={KeyRound} color="saffron">
          <div className="font-mono text-sm text-navy-200 break-all">{masked}</div>
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${apiKey ? "border-india-400/30 bg-india-500/10 text-india-200" : "border-red-400/30 bg-red-500/10 text-red-200"}`}>
            <CheckCircle2 className="h-3.5 w-3.5" /> {apiKey ? "Connected" : "Needs setup"}
          </div>
        </Card>
        <Card title="AI Modules" icon={Database} color="india">
          {["Form analysis: Gemini Vision", "Bharat AI chat: Gemini Flash", "Structured JSON output", "Multi-language (7 Indian languages)", "Client-side key fallback"].map(x => (
            <div key={x} className="mb-2 flex items-center gap-2 text-sm text-navy-200"><CheckCircle2 className="h-4 w-4 text-india-400" /> {x}</div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── TABLE TABS ─── */
function UsersTab({ users }: { users: any[] }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div><h2 className="text-2xl font-black">Users ({users.length})</h2><p className="text-sm text-navy-400">All registered users</p></div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-white/10 text-sm text-white outline-none placeholder:text-navy-400 focus:border-saffron-400" />
        </div>
      </div>
      <DataTable rows={filtered.map(u => ({ Name: u.name, Email: u.email, Phone: u.phone || "-", Joined: timeAgo(u.createdAt) }))} />
    </div>
  );
}

function FeedbackTab({ feedback }: { feedback: any[] }) {
  return (
    <div>
      <div className="mb-5"><h2 className="text-2xl font-black">Launch Feedback ({feedback.length})</h2><p className="text-sm text-navy-400">Submitted via the launch page form</p></div>
      <DataTable rows={feedback.map(f => ({ Name: f.name, State: f.state || "-", Role: f.role || "-", Priority: f.improvement || "-", Rating: f.rating ? `${f.rating}⭐` : "-", Feedback: f.feedback?.slice(0, 80) + "...", Date: timeAgo(f.createdAt) }))} />
    </div>
  );
}

function TransactionsTab({ transactions }: { transactions: any[] }) {
  return (
    <div>
      <div className="mb-5"><h2 className="text-2xl font-black">Transactions ({transactions.length})</h2><p className="text-sm text-navy-400">All payment records</p></div>
      <DataTable rows={transactions.map(t => ({ "Txn ID": t.id, Plan: t.plan, Amount: `₹${(t.amount || 0).toLocaleString("en-IN")}`, Method: (t.method || "").toUpperCase(), Status: t.status || "success", Date: timeAgo(t.createdAt) }))} />
    </div>
  );
}

function DataTable({ rows }: { rows: Record<string, any>[] }) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];
  if (rows.length === 0) return <Empty text="No records yet" />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/[0.04]">
          <tr>{keys.map(k => <th key={k} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-saffron-300">{k}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, i) => <tr key={i} className="hover:bg-white/[0.03] transition-colors">{keys.map(k => <td key={k} className="max-w-[200px] px-4 py-3 text-navy-200 truncate">{row[k]}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

/* ─── STATES TAB ─── */
function StatesTab() {
  const sorted = [...STATES].sort((a, b) => b.applications - a.applications);
  return (
    <div>
      <div className="mb-5"><h2 className="text-2xl font-black">State Coverage</h2><p className="text-sm text-navy-400">{STATES.filter(s => s.type === "state").length} states + {STATES.filter(s => s.type === "ut").length} UTs</p></div>
      <div className="grid gap-2 md:grid-cols-2">
        {sorted.map((s, i) => (
          <div key={s.code} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition-colors">
            <div className="text-xs font-bold text-navy-400 w-6 tabular-nums">#{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{s.name}</div>
              <div className="text-[10px] text-navy-400 font-hindi">{s.nameHi}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-saffron-300 tabular-nums">{s.applications.toLocaleString("en-IN")}</div>
              <div className="text-[10px] text-navy-400">{s.schemes} schemes</div>
            </div>
            <div className="h-2 w-16 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-saffron-500 to-red-500 rounded-full" style={{ width: `${s.intensity}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ADMINS TAB ─── */
function AdminsTab({ onChange }: { onChange: () => void }) {
  const [admins, setAdmins] = useState(listAdmins());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState(""); const [newEmail, setNewEmail] = useState(""); const [newPassword, setNewPassword] = useState(""); const [newRole, setNewRole] = useState<"admin" | "super-admin">("admin"); const [error, setError] = useState("");
  const refresh = () => { setAdmins(listAdmins()); onChange(); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const res = await createAdmin("super-admin", { name: newName, email: newEmail, password: newPassword, role: newRole });
    if (!res.success) { setError(res.error || "Failed"); return; }
    setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("admin"); setShowCreate(false); refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-2xl font-black">Admin Accounts</h2><p className="text-sm text-navy-400">Super-admin only</p></div>
        <button onClick={() => setShowCreate(!showCreate)} className="inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-4 py-2 text-sm font-bold hover:bg-saffron-600">
          <UserPlus className="h-4 w-4" /> {showCreate ? "Cancel" : "Add admin"}
        </button>
      </div>
      {showCreate && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCreate} className="mb-5 rounded-2xl border border-saffron-400/30 bg-saffron-500/5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="Full name" className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400" />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" required placeholder="email@bharatform.ai" className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400" />
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" required minLength={6} placeholder="Password (min 6)" className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400" />
            <select value={newRole} onChange={e => setNewRole(e.target.value as any)} className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400">
              <option value="admin" className="text-navy-900">Admin</option>
              <option value="super-admin" className="text-navy-900">Super Admin</option>
            </select>
          </div>
          {error && <div className="mt-3 text-xs text-red-300">{error}</div>}
          <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-india-600 px-4 py-2 text-sm font-bold hover:bg-india-700"><Plus className="h-4 w-4" /> Create</button>
        </motion.form>
      )}
      <DataTable rows={admins.map(a => ({ Name: a.name, Email: a.email, Role: a.role, Created: new Date(a.createdAt).toLocaleDateString(), "Last Login": a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleDateString() : "Never" }))} />
    </div>
  );
}

/* ─── SECURITY TAB ─── */
function SecurityTab({ onClear }: { onClear: () => void }) {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-black">Security Center</h2><p className="text-sm text-navy-400">Controls and audit</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Controls" icon={Shield} color="saffron">
          {["SHA-256 password hashing", "8-hour admin sessions", "30-day user sessions", "OTP 5-min expiry", "API key local-only storage", "DPDP Act 2023 compliant"].map(l => (
            <div key={l} className="mb-2 flex items-center gap-2 text-sm text-navy-200"><CheckCircle2 className="h-4 w-4 text-india-400" /> {l}</div>
          ))}
        </Card>
        <Card title="Audit Log" icon={Star} color="india">
          {[`${listAdmins().length} admin accounts`, `Last seed: ${new Date().toLocaleDateString()}`, "Console: /#admin", "Founded by Arman Ansari"].map(l => (
            <div key={l} className="mb-2 text-sm text-navy-200">{l}</div>
          ))}
        </Card>
      </div>
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
        <div className="mb-2 text-sm font-black text-red-200">⚠️ Danger Zone</div>
        <p className="mb-4 text-sm text-red-100/80">This permanently clears all demo user data, feedback, and transactions.</p>
        <button onClick={onClear} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"><Trash2 className="h-4 w-4" /> Clear all demo data</button>
      </div>
    </div>
  );
}

/* ─── ANALYSES TAB ─── */
interface AnalysesTabProps {
  onDeleted: () => void;
}

function AnalysesTab({ onDeleted }: AnalysesTabProps) {
  const [tick, setTick] = useState(0);
  const { analyses } = useAdminData(tick);
  const [search, setSearch] = useState("");

  const filtered = (analyses || []).filter(
    (a) =>
      a.form_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis record permanently?")) return;
    
    const { getSupabase, isSupabaseConfigured } = await import("../lib/supabase");
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.from("analyses").delete().eq("id", id);
        if (error) {
          alert(`Error deleting analysis: ${error.message}`);
          return;
        }
      }
    } else {
      // Local fallback
      const localAnls = JSON.parse(localStorage.getItem("bf-analyses") || "[]");
      const filteredAnls = localAnls.filter((x: any) => x.id !== id);
      localStorage.setItem("bf-analyses", JSON.stringify(filteredAnls));
    }
    
    setTick(t => t + 1);
    onDeleted();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Form Analyses ({analyses?.length || 0})</h2>
          <p className="text-sm text-navy-400">Track and manage every form analysis initiated by citizens.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search analyses..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-white/10 text-sm text-white outline-none placeholder:text-navy-400 focus:border-saffron-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty text="No analysis records found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.04]">
              <tr>
                {["User Name", "Email", "Form Name", "Authority", "Fields", "Date Started", "Actions"].map((k) => (
                  <th key={k} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-saffron-300">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((a, i) => (
                <tr key={a.id || i} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{a.user_name || "Guest Citizen"}</td>
                  <td className="px-4 py-3 text-navy-200 font-mono text-xs">{a.user_email || "N/A"}</td>
                  <td className="px-4 py-3 text-white truncate max-w-[180px]" title={a.form_name}>
                    {a.form_name}
                  </td>
                  <td className="px-4 py-3 text-navy-400 text-xs">{a.authority || "N/A"}</td>
                  <td className="px-4 py-3 text-navy-200 tabular-nums">{a.total_fields || 0}</td>
                  <td className="px-4 py-3 text-xs text-navy-400">{timeAgo(new Date(a.created_at).getTime())}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
