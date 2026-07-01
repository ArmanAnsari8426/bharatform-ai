import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Upload, Loader2, Sparkles } from "lucide-react";
import { useApp } from "../lib/context";

const services = [
  { id: "passport", label: "Passport", emoji: "🛂" },
  { id: "aadhaar", label: "Aadhaar", emoji: "🪪" },
  { id: "pan", label: "PAN Card", emoji: "💳" },
  { id: "driving", label: "Driving License", emoji: "🚗" },
  { id: "voter", label: "Voter ID", emoji: "🗳️" },
  { id: "income", label: "Income Certificate", emoji: "💰" },
];

type Doc = { name: string; status: "ready" | "missing" | "warn"; note?: string };

const checksByService: Record<string, Doc[]> = {
  passport: [
    { name: "Aadhaar Card", status: "ready" },
    { name: "Birth Certificate", status: "missing" },
    { name: "Address Proof", status: "ready" },
    { name: "Photo (35×45mm)", status: "warn", note: "Background appears non-white" },
    { name: "Signature", status: "ready" },
    { name: "10th Marksheet", status: "ready" },
  ],
  aadhaar: [
    { name: "Proof of Identity", status: "ready" },
    { name: "Proof of Address", status: "ready" },
    { name: "Date of Birth Proof", status: "ready" },
  ],
  pan: [
    { name: "Aadhaar Card", status: "ready" },
    { name: "Photo", status: "ready" },
    { name: "Signature", status: "missing" },
  ],
  driving: [
    { name: "Learner's License", status: "ready" },
    { name: "Address Proof", status: "ready" },
    { name: "Age Proof", status: "ready" },
    { name: "Medical Certificate", status: "missing" },
  ],
  voter: [
    { name: "Age Proof", status: "ready" },
    { name: "Address Proof", status: "ready" },
    { name: "Photo", status: "ready" },
  ],
  income: [
    { name: "Salary Slips", status: "ready" },
    { name: "Bank Statement", status: "warn", note: "Need 6 months, you have 3" },
    { name: "Aadhaar Card", status: "ready" },
  ],
};

export default function ReadinessChecker() {
  const { openAnalysis } = useApp();
  const [service, setService] = useState("passport");
  const [checking, setChecking] = useState(true);
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    setChecking(true);
    const t = setTimeout(() => {
      setDocs(checksByService[service]);
      setChecking(false);
    }, 1100);
    return () => clearTimeout(t);
  }, [service]);

  const ready = docs.filter((d) => d.status === "ready").length;
  const total = docs.length;
  const score = total ? Math.round((ready / total) * 100) : 0;
  const missing = docs.filter((d) => d.status === "missing").length;
  const warns = docs.filter((d) => d.status === "warn").length;

  const risk = missing > 1 ? "High" : missing > 0 || warns > 0 ? "Medium" : "Low";
  const riskColor = risk === "High" ? "text-red-600 bg-red-50 border-red-200" : risk === "Medium" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-india-700 bg-india-50 border-india-200";

  return (
    <section id="readiness" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold mb-5"
            style={{ color: "var(--text-soft)" }}
          >
            <Sparkles className="h-3 w-3" />
            DOCUMENT READINESS CHECKER
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Know exactly{" "}
            <span className="text-saffron-600">what's missing.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Pick a service. AI checks your documents. Get a readiness score and a fix-it list.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-3xl border overflow-hidden shadow-2xl" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r p-6" style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(255,153,51,0.04), transparent)" }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                  Select Service
                </div>
                <div className="space-y-1.5">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setService(s.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border ${
                        service === s.id
                          ? "bg-white shadow-sm"
                          : "border-transparent hover:bg-white/60"
                      }`}
                      style={{
                        background: service === s.id ? "var(--surface)" : "transparent",
                        borderColor: service === s.id ? "#FF9933" : "transparent",
                        color: service === s.id ? "var(--text)" : "var(--text-soft)",
                      }}
                    >
                      <span className="text-lg">{s.emoji}</span>
                      <span className="flex-1 text-left">{s.label}</span>
                      {service === s.id && (
                        <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                      )}
                    </button>
                  ))}
                </div>

                <button onClick={() => openAnalysis()} className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </button>
                <p className="mt-2 text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                  We never store your documents. Auto-deleted after 24h.
                </p>
              </div>

              <div className="lg:col-span-8 p-6 lg:p-8">
                {checking ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 text-saffron-500 animate-spin" />
                    <div className="mt-4 text-sm font-semibold" style={{ color: "var(--text)" }}>
                      AI is analyzing your documents…
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Checking against official requirements</div>
                  </div>
                ) : (
                  <motion.div key={service} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          {services.find((s) => s.id === service)?.label} Application
                        </div>
                        <div className="mt-1 text-2xl font-bold" style={{ color: "var(--text)" }}>Readiness Report</div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${riskColor}`}>
                        {risk} Risk
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="col-span-1 flex items-center justify-center">
                        <ScoreCircle score={score} />
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-2">
                        <Metric label="Ready" value={ready} color="#138808" />
                        <Metric label="Missing" value={missing} color="#DC2626" />
                        <Metric label="Warnings" value={warns} color="#F59E0B" />
                        <Metric label="Total Docs" value={total} color="var(--text)" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {docs.map((d, i) => (
                        <motion.div
                          key={d.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 rounded-xl border p-3"
                          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                        >
                          <DocIcon status={d.status} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                              {d.name}
                            </div>
                            {d.note && (
                              <div className="text-xs text-amber-700 mt-0.5">{d.note}</div>
                            )}
                          </div>
                          <StatusPill status={d.status} />
                        </motion.div>
                      ))}
                    </div>

                    <button onClick={() => openAnalysis()} className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-saffron-500 px-5 py-3 text-sm font-semibold text-white hover:bg-saffron-600 transition-colors shadow-md shadow-saffron-500/20">
                      Check My Documents →
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 90 ? "#138808" : score >= 70 ? "#F59E0B" : "#DC2626";

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90">
        <circle cx="45" cy="45" r={r} stroke="#E2E8F0" strokeWidth="6" fill="none" />
        <motion.circle
          cx="45"
          cy="45"
          r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>{score}%</div>
        <div className="text-[9px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Score</div>
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border p-3 text-center" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}

function DocIcon({ status }: { status: Doc["status"] }) {
  const map = {
    ready: { Icon: CheckCircle2, cls: "bg-india-100 text-india-700" },
    missing: { Icon: XCircle, cls: "bg-red-100 text-red-700" },
    warn: { Icon: AlertTriangle, cls: "bg-amber-100 text-amber-700" },
  } as const;
  const { Icon, cls } = map[status];
  return (
    <div className={`h-8 w-8 rounded-lg ${cls} flex items-center justify-center flex-shrink-0`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

function StatusPill({ status }: { status: Doc["status"] }) {
  const map = {
    ready: { label: "Ready", cls: "bg-india-50 text-india-700 border-india-200" },
    missing: { label: "Missing", cls: "bg-red-50 text-red-700 border-red-200" },
    warn: { label: "Issue", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  } as const;
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${cls}`}>
      {label}
    </span>
  );
}
