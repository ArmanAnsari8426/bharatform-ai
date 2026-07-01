import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, FileText, Sparkles, Check, Search, UserCheck, BookOpen, Clock, Loader2 } from "lucide-react";
import { getCustomScholarships } from "../lib/contentStore";

type Scholarship = {
  id: string;
  name: string;
  nameHi: string;
  provider: string;
  amount: string;
  deadline: string;
  daysLeft: number;
  match: number;
  docs: string[];
  tags: string[];
  featured: boolean;
  eligibleStates: string[];
  eligibleCategories: string[];
  maxIncome?: number;
  educationLevels: string[];
};

const allScholarships: Scholarship[] = [
  {
    id: "nsp-pm",
    name: "National Scholarship Portal — Post Matric",
    nameHi: "राष्ट्रीय छात्रवृत्ति पोर्टल - पोस्ट मैट्रिक",
    provider: "Ministry of Electronics & IT",
    amount: "₹20,000 – ₹2,00,000",
    deadline: "31 Oct 2026",
    daysLeft: 47,
    match: 98,
    docs: ["Income Certificate", "Caste Certificate", "Previous Marksheet", "Aadhaar"],
    tags: ["SC/ST", "OBC", "Minority"],
    featured: true,
    eligibleStates: ["All"],
    eligibleCategories: ["SC/ST", "OBC"],
    maxIncome: 250000,
    educationLevels: ["Undergraduate", "Postgraduate", "PhD"],
  },
  {
    id: "pm-yasasvi",
    name: "PM YASASVI Scholarship Scheme",
    nameHi: "पीएम यशस्वी छात्रवृत्ति योजना",
    provider: "Ministry of Social Justice",
    amount: "₹75,000 – ₹1,25,000",
    deadline: "15 Sep 2026",
    daysLeft: 1,
    match: 92,
    docs: ["Income Certificate", "Aadhaar", "School ID"],
    tags: ["OBC", "EBC", "Class 9-12"],
    featured: false,
    eligibleStates: ["All"],
    eligibleCategories: ["OBC"],
    maxIncome: 250000,
    educationLevels: ["Class 10", "Class 12"],
  },
  {
    id: "bhm-minority",
    name: "Begum Hazrat Mahal Scholarship",
    nameHi: "बेगम हजरत महल छात्रवृत्ति",
    provider: "Maulana Azad Education Foundation",
    amount: "₹5,000 – ₹12,000",
    deadline: "30 Nov 2026",
    daysLeft: 77,
    match: 88,
    docs: ["Aadhaar", "Income Certificate", "Marksheet"],
    tags: ["Minority", "Girls", "Class 9-12"],
    featured: false,
    eligibleStates: ["All"],
    eligibleCategories: ["General", "OBC", "SC/ST"],
    maxIncome: 200000,
    educationLevels: ["Class 10", "Class 12"],
  },
  {
    id: "inspire-she",
    name: "Inspire Scholarship (SHE)",
    nameHi: "INSPIRE छात्रवृत्ति",
    provider: "Dept. of Science & Technology",
    amount: "₹80,000/year",
    deadline: "20 Dec 2026",
    daysLeft: 97,
    match: 84,
    docs: ["Class 12 Marksheet", "Aadhaar", "Bank Passbook"],
    tags: ["STEM", "Top 1%"],
    featured: true,
    eligibleStates: ["All"],
    eligibleCategories: ["General", "OBC", "SC/ST"],
    educationLevels: ["Undergraduate", "Postgraduate"],
  },
  {
    id: "up-prem-sc",
    name: "UP Pre-Matric Scholarship for SC/ST",
    nameHi: "यूपी प्री-मैट्रिक छात्रवृत्ति (SC/ST)",
    provider: "UP Social Welfare Dept.",
    amount: "₹3,000 – ₹5,000",
    deadline: "20 Oct 2026",
    daysLeft: 36,
    match: 95,
    docs: ["Caste Certificate", "Domicile Certificate", "Aadhaar"],
    tags: ["UP", "SC/ST", "School"],
    featured: false,
    eligibleStates: ["Uttar Pradesh"],
    eligibleCategories: ["SC/ST"],
    educationLevels: ["Class 10"],
  },
  {
    id: "mh-mahadbt",
    name: "MahaDBT Post-Matric Scholarship",
    nameHi: "महाडीबीटी पोस्ट-मैट्रिक छात्रवृत्ति",
    provider: "Maharashtra Social Justice Dept.",
    amount: "₹10,000 – ₹50,000",
    deadline: "15 Dec 2026",
    daysLeft: 92,
    match: 90,
    docs: ["Income Certificate", "Aadhaar", "College ID"],
    tags: ["Maharashtra", "Open/OBC/SC/ST"],
    featured: false,
    eligibleStates: ["Maharashtra"],
    eligibleCategories: ["General", "OBC", "SC/ST"],
    maxIncome: 800000,
    educationLevels: ["Undergraduate", "Postgraduate"],
  }
];

const stateHighlights = [
  { state: "UP", name: "UP Pre-Matric", amount: "₹3000", users: "1.2M+" },
  { state: "WB", name: "Oasis Scholarship", amount: "₹12000", users: "800K+" },
  { state: "TN", name: "BC/MBC Scholarship", amount: "₹5000", users: "600K+" },
  { state: "BR", name: "Post Matric Bihar", amount: "₹15000", users: "950K+" },
];

export default function Scholarships() {
  const [age, setAge] = useState("19");
  const [income, setIncome] = useState("below-2.5L");
  const [category, setCategory] = useState("OBC");
  const [state, setState] = useState("All");
  const [education, setEducation] = useState("Undergraduate");
  const [search, setSearch] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);
  const [customScholarships, setCustomScholarships] = useState(() => getCustomScholarships());

  useEffect(() => {
    const refresh = () => setCustomScholarships(getCustomScholarships());
    window.addEventListener("storage", refresh);
    window.addEventListener("bf-content-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("bf-content-updated", refresh);
    };
  }, []);

  const mergedScholarships = useMemo(() => [...customScholarships, ...allScholarships], [customScholarships]);

  const filteredScholarships = useMemo(() => {
    return mergedScholarships.filter(s => {
      // Search filter
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           s.nameHi.includes(search) ||
                           s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      
      if (!hasMatched) return matchesSearch;

      // Real matching logic
      const stateMatch = s.eligibleStates.includes("All") || s.eligibleStates.includes(state);
      const categoryMatch = s.eligibleCategories.includes(category);
      const educationMatch = s.educationLevels.includes(education);
      
      // Income matching
      let incomeNumeric = 10000000;
      if (income === "below-2.5L") incomeNumeric = 250000;
      else if (income === "2.5-5L") incomeNumeric = 500000;
      else if (income === "5-8L") incomeNumeric = 800000;
      
      const incomeMatch = !s.maxIncome || incomeNumeric <= s.maxIncome;

      return matchesSearch && stateMatch && categoryMatch && educationMatch && incomeMatch;
    });
  }, [search, state, category, education, income, hasMatched, mergedScholarships]);

  const handleMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setHasMatched(true);
    }, 1500);
  };

  const handleReset = () => {
    setHasMatched(false);
    setState("All");
    setCategory("OBC");
    setIncome("below-2.5L");
    setEducation("Undergraduate");
    setAge("19");
  };

  return (
    <section id="scholarships" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(255,153,51,0.04), var(--bg))" }}>
      <div className="absolute inset-0 dot-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700 mb-5"
          >
            <GraduationCap className="h-3 w-3" />
            SCHOLARSHIP FINDER · छात्रवृत्ति खोजक
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Don't let money stop your{" "}
            <span className="bg-gradient-to-r from-saffron-600 to-saffron-500 bg-clip-text text-transparent">
              dreams.
            </span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Access ₹20,000+ crore in central and state scholarships. Matching your profile in real-time.
          </p>
        </div>

        {/* State Highlights Ticker */}
        <div className="mb-12 flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex-shrink-0 flex items-center gap-2 text-xs font-bold text-navy-500 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
            State Trends:
          </div>
          {stateHighlights.map((h) => (
            <div key={h.state} className="flex-shrink-0 flex items-center gap-3 bg-white border border-navy-100 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-xs font-black text-saffron-600">{h.state}</span>
              <div className="h-4 w-px bg-navy-100" />
              <div>
                <div className="text-[10px] font-bold text-navy-900">{h.name}</div>
                <div className="text-[9px] text-navy-400">{h.users} applicants</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Profile Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="rounded-3xl border p-7 shadow-xl sticky top-24" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-saffron-500" />
                  <span className="text-lg font-bold" style={{ color: "var(--text)" }}>Build Profile</span>
                </div>
                <button onClick={handleReset} className="text-xs font-bold text-saffron-600 hover:underline">Reset</button>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy-500">Full Name</label>
                  <input type="text" placeholder="Enter student name" className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Age">
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="input-v2" />
                  </Field>
                  <Field label="Gender">
                    <select className="input-v2">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>

                <Field label="Home State">
                  <select value={state} onChange={(e) => setState(e.target.value)} className="input-v2">
                    <option value="All">All Over India</option>
                    {["Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Delhi", "Bihar", "Gujarat", "West Bengal"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Category / Caste">
                  <div className="grid grid-cols-3 gap-1.5">
                    {["General", "OBC", "SC/ST"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`rounded-lg px-2 py-2 text-[11px] font-bold border transition-all ${
                          category === c
                            ? "bg-saffron-500 text-white border-saffron-500 shadow-md"
                            : "bg-white text-navy-600 border-navy-200 hover:border-saffron-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Family Income (Annual)">
                  <select value={income} onChange={(e) => setIncome(e.target.value)} className="input-v2">
                    <option value="below-2.5L">Below ₹2.5 Lakh</option>
                    <option value="2.5-5L">₹2.5 – 5 Lakh</option>
                    <option value="5-8L">₹5 – 8 Lakh</option>
                    <option value="above-8L">Above ₹8 Lakh</option>
                  </select>
                </Field>

                <Field label="Education Level">
                  <select value={education} onChange={(e) => setEducation(e.target.value)} className="input-v2">
                    {["Class 10", "Class 12", "Undergraduate", "Postgraduate", "PhD"].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </Field>

                <button
                  onClick={handleMatch}
                  disabled={isMatching}
                  className="w-full rounded-2xl bg-navy-900 hover:bg-navy-800 px-4 py-4 text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {isMatching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  )}
                  {isMatching ? "Finding Matches..." : "Match Scholarships"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search and Sort Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-navy-100 p-4 rounded-2xl shadow-sm">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, category..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-500" 
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-500 uppercase">Sort by:</span>
                <select className="text-xs font-bold bg-transparent border-none focus:ring-0 text-saffron-700 cursor-pointer">
                  <option>Match Score</option>
                  <option>Amount High to Low</option>
                  <option>Nearest Deadline</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredScholarships.length > 0 ? (
                <div className="space-y-4">
                  {filteredScholarships.map((s) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`group rounded-3xl border p-6 transition-all relative overflow-hidden ${
                        s.featured ? "border-saffron-300 shadow-saffron-500/5" : "border-navy-100"
                      }`}
                      style={{ background: "var(--surface)" }}
                    >
                      {s.featured && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-saffron-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md">
                            Top Pick
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center flex-shrink-0 shadow-lg text-white">
                              <GraduationCap className="h-7 w-7" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold truncate" style={{ color: "var(--text)" }}>{s.name}</h3>
                              <div className="text-xs font-hindi font-bold mt-0.5" style={{ color: "var(--text-muted)" }}>{s.nameHi}</div>
                              <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-soft)" }}>{s.provider}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <Stat label="Reward" value={s.amount} color="text-saffron-600" icon={Sparkles} />
                            <Stat label="Deadline" value={s.deadline} color="text-navy-900" icon={Calendar} urgent={s.daysLeft < 7} />
                            <Stat label="Match" value={hasMatched ? `${s.match}%` : "---"} color="text-india-600" icon={Check} />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {s.tags.map((t) => (
                              <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border" style={{ background: "var(--bg-muted)", color: "var(--text-soft)", borderColor: "var(--border)" }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="md:w-56 flex flex-col gap-3 justify-center md:border-l pl-0 md:pl-6" style={{ borderColor: "var(--border)" }}>
                          <button className="w-full rounded-xl bg-saffron-500 hover:bg-saffron-600 px-4 py-3 text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2">
                            Apply with AI <Sparkles className="h-3.5 w-3.5" />
                          </button>
                          <button className="w-full rounded-xl border border-navy-200 hover:bg-navy-50 px-4 py-3 text-sm font-bold text-navy-700 transition-all flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4" /> Save Later
                          </button>
                          <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-navy-400 uppercase tracking-widest">
                            <BookOpen className="h-3 w-3" /> 23.4k Students
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
                        <div className="text-[10px] font-bold uppercase text-navy-400 mr-2 flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Docs Required:
                        </div>
                        {s.docs.map((d) => (
                          <span key={d} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-navy-600">
                            <div className="h-1 w-1 rounded-full bg-india-500" /> {d}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center bg-white border border-dashed border-navy-200 rounded-3xl"
                >
                  <div className="text-5xl mb-4">🎓</div>
                  <h4 className="text-xl font-bold text-navy-900">No matching scholarships found</h4>
                  <p className="text-sm text-navy-500 mt-2 max-w-xs mx-auto">Try adjusting your profile or caste category to see more results.</p>
                  <button onClick={handleReset} className="mt-6 text-saffron-600 font-bold hover:underline">Clear all filters</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .input-v2 {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-muted);
          border: 1px solid var(--border);
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          outline: none;
          transition: all 0.2s;
        }
        .input-v2:focus {
          background: white;
          border-color: #FF9933;
          box-shadow: 0 0 0 4px rgba(255, 153, 51, 0.1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function Stat({ label, value, color, icon: Icon, urgent }: { label: string, value: string, color: string, icon: any, urgent?: boolean }) {
  return (
    <div className="bg-navy-50/50 rounded-2xl p-3 border border-navy-100/50">
      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-navy-400 mb-1">
        <Icon className="h-2.5 w-2.5" /> {label}
      </div>
      <div className={`text-sm font-bold truncate ${color} ${urgent ? 'animate-pulse' : ''}`}>{value}</div>
    </div>
  );
}
