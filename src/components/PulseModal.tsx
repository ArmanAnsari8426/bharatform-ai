import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Clock, ExternalLink, CheckCircle2, AlertCircle, TrendingUp, Bell } from "lucide-react";

export type PulseUpdate = {
  id: string;
  type: "new" | "deadline" | "update";
  title: string;
  description: string;
  category: string;
  date: string;
  daysLeft?: number;
  authority: string;
  link?: string;
};

export const PULSE_UPDATES: PulseUpdate[] = [
  { id: "1", type: "new", title: "PM Vishwakarma Yojana opens for 18 new crafts", description: "Skill training + ₹15,000 toolkit + ₹3 lakh collateral-free loan for traditional artisans.", category: "Skill Development", date: "Today", authority: "Ministry of MSME", link: "https://pmvishwakarma.gov.in" },
  { id: "2", type: "deadline", title: "Income Tax Return filing deadline", description: "Last date for FY 2025-26 ITR filing without late fee. File via e-filing portal.", category: "Taxation", date: "31 Dec 2026", daysLeft: 2, authority: "Income Tax Department", link: "https://incometax.gov.in" },
  { id: "3", type: "update", title: "Aadhaar PVC card now available for ₹50", description: "Order PVC Aadhaar card online with QR code, hologram & security features.", category: "Identity", date: "Yesterday", authority: "UIDAI", link: "https://uidai.gov.in" },
  { id: "4", type: "new", title: "PM Internship Scheme launched for 1 crore youth", description: "₹5,000/month stipend + ₹6,000 one-time grant for 12-month internships at top 500 companies.", category: "Employment", date: "Today", authority: "Ministry of Corporate Affairs" },
  { id: "5", type: "deadline", title: "PM Kisan eKYC deadline approaching", description: "Complete biometric eKYC to continue receiving ₹6,000/year. Visit CSC or pmkisan.gov.in.", category: "Agriculture", date: "28 Feb 2026", daysLeft: 8, authority: "Ministry of Agriculture", link: "https://pmkisan.gov.in" },
  { id: "6", type: "update", title: "FASTag now mandatory on all NH", description: "Vehicles without FASTag will pay double toll. Buy from any bank or Paytm.", category: "Transport", date: "3 days ago", authority: "NHAI", link: "https://fastag.ihmcl.com" },
  { id: "7", type: "new", title: "MUDRA Loan limit increased to ₹20 lakh for women", description: "Tarun Plus category — collateral-free loan for women entrepreneurs in services & manufacturing.", category: "Business", date: "Today", authority: "Ministry of Finance", link: "https://mudra.org.in" },
  { id: "8", type: "deadline", title: "National Scholarship Portal — Final Date", description: "Pre & post-matric scholarships for SC/ST/OBC/Minorities & PwD students.", category: "Education", date: "31 Oct 2026", daysLeft: 47, authority: "MoE", link: "https://scholarships.gov.in" },
  { id: "9", type: "update", title: "Driving License now via DigiLocker", description: "Soft-copy DL fetched from DigiLocker is legally valid across India. No need to carry physical copy.", category: "Transport", date: "Yesterday", authority: "MoRTH" },
  { id: "10", type: "new", title: "PM Surya Ghar Yojana: 300 units free electricity", description: "Subsidy up to ₹78,000 for rooftop solar installations. 1 crore households target.", category: "Energy", date: "Today", authority: "Ministry of New & Renewable Energy", link: "https://pmsuryaghar.gov.in" },
  { id: "11", type: "deadline", title: "PAN-Aadhaar linking — Final reminder", description: "Link your PAN with Aadhaar to keep it active. Inoperative PANs cannot file ITR or open bank accounts.", category: "Identity", date: "31 March 2026", daysLeft: 90, authority: "Income Tax", link: "https://incometax.gov.in" },
  { id: "12", type: "new", title: "Ayushman Vay Vandana Card for seniors", description: "All 70+ citizens get ₹5L/year health cover regardless of income, automatically.", category: "Healthcare", date: "2 days ago", authority: "Ministry of Health", link: "https://pmjay.gov.in" },
  { id: "13", type: "update", title: "Voter ID can be downloaded as e-EPIC", description: "Digital Voter ID with QR code, valid for all electoral & ID purposes.", category: "Electoral", date: "5 days ago", authority: "Election Commission", link: "https://voters.eci.gov.in" },
  { id: "14", type: "new", title: "PM-USHA: 100% central funding for top universities", description: "₹13,000 crore allocated for higher education institution upgrades.", category: "Education", date: "Today", authority: "MoE" },
  { id: "15", type: "deadline", title: "GST registration for ₹40L+ turnover", description: "Mandatory for businesses crossing turnover threshold. Apply via GST portal.", category: "Taxation", date: "Ongoing", authority: "CBIC", link: "https://gst.gov.in" },
  { id: "16", type: "new", title: "Stand-Up India: Bank loans for SC/ST/Women entrepreneurs", description: "₹10 lakh – ₹1 crore loans for greenfield enterprises. 1 SC/ST + 1 woman per bank branch.", category: "Business", date: "1 week ago", authority: "Ministry of Finance" },
];

const styles = {
  new: { bg: "bg-india-50", text: "text-india-700", border: "border-india-200", icon: CheckCircle2, label: "NEW" },
  deadline: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: AlertCircle, label: "DEADLINE" },
  update: { bg: "bg-saffron-50", text: "text-saffron-700", border: "border-saffron-200", icon: TrendingUp, label: "UPDATE" },
};

const categories = ["All", "Education", "Healthcare", "Identity", "Agriculture", "Business", "Taxation", "Transport", "Skill Development", "Employment", "Energy", "Electoral"];

export default function PulseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filter, setFilter] = useState<"all" | "new" | "deadline" | "update">("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = PULSE_UPDATES
    .filter((u) => filter === "all" || u.type === filter)
    .filter((u) => category === "All" || u.category === category)
    .filter((u) => !search || u.title.toLowerCase().includes(search.toLowerCase()) || u.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.daysLeft ?? 9999) - (b.daysLeft ?? 9999));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-4xl max-h-[92vh] pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[92vh]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500 z-10" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-india-500 to-india-700 flex items-center justify-center text-white">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-navy-900">Government Pulse</div>
                      <div className="text-xs text-navy-500">{PULSE_UPDATES.length} latest schemes, deadlines & policy updates · Updated daily</div>
                    </div>
                  </div>
                  <button onClick={onClose} className="h-9 w-9 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-6 py-4 border-b border-navy-100 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                    <input
                      type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search updates…"
                      className="w-full pl-9 pr-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-saffron-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { code: "all", label: "All", count: PULSE_UPDATES.length },
                      { code: "new", label: "🆕 New", count: PULSE_UPDATES.filter(u => u.type === "new").length },
                      { code: "deadline", label: "⏰ Deadlines", count: PULSE_UPDATES.filter(u => u.type === "deadline").length },
                      { code: "update", label: "📈 Updates", count: PULSE_UPDATES.filter(u => u.type === "update").length },
                    ].map((t) => (
                      <button key={t.code} onClick={() => setFilter(t.code as any)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                          filter === t.code ? "bg-saffron-500 text-white border-saffron-500" : "border-navy-200 text-navy-700 hover:bg-saffron-50"
                        }`}>
                        {t.label} ({t.count})
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {categories.map((c) => (
                      <button key={c} onClick={() => setCategory(c)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md ${
                          category === c ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                  {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="text-4xl mb-2">🔍</div>
                      <div className="text-sm font-semibold text-navy-700">No updates found</div>
                      <div className="text-xs text-navy-500 mt-1">Try changing filters or search</div>
                    </div>
                  ) : (
                    filtered.map((u, i) => {
                      const s = styles[u.type];
                      const Icon = s.icon;
                      return (
                        <motion.div key={u.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="rounded-xl border border-navy-100 bg-white p-4 hover:shadow-md hover:border-saffron-300 transition-all">
                          <div className="flex items-start gap-3">
                            <div className={`h-9 w-9 rounded-lg ${s.bg} ${s.text} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${s.bg} ${s.text} ${s.border} border px-1.5 py-0.5 rounded`}>{s.label}</span>
                                <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wide">{u.category}</span>
                                {u.daysLeft !== undefined && u.daysLeft <= 30 && (
                                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">⚠️ {u.daysLeft} days left</span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-navy-900">{u.title}</h3>
                              <p className="text-xs text-navy-600 mt-1 leading-relaxed">{u.description}</p>
                              <div className="mt-2 flex items-center gap-3 text-[10px] text-navy-500">
                                <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {u.date}</span>
                                <span>·</span>
                                <span className="font-semibold">{u.authority}</span>
                                {u.link && (
                                  <>
                                    <span>·</span>
                                    <a href={u.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-saffron-700 hover:underline">
                                      Visit portal <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-navy-100 px-6 py-3 bg-navy-50/30 text-xs text-navy-500 text-center">
                  Showing {filtered.length} of {PULSE_UPDATES.length} updates · 🇮🇳 Aggregated from official sources
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
