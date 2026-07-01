import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Heart,
  Briefcase,
  Wheat,
  Users,
  Check,
  ArrowRight,
  Loader2,
  TrendingUp,
  Search,
  BadgeCheck,
  CircleAlert,
  IndianRupee,
  MapPin,
  FileText,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { getCustomSchemes } from "../lib/contentStore";

type Scheme = {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  benefit: string;
  icon: any;
  color: string;
  official: string;
  status: string;
  popularity: number;
  trending: boolean;
  central: boolean;
  states: string[];
  occupations: string[];
  categories: string[];
  genders: string[];
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  needsRural?: boolean;
  needsGirlChild?: boolean;
  needsFarmer?: boolean;
  description: string;
  documents: string[];
};

type UserProfile = {
  age: number;
  occupation: string;
  income: number;
  state: string;
  category: string;
  gender: string;
  residence: string;
  familyType: string;
  hasDaughter: string;
};

const allSchemes: Scheme[] = [
  {
    id: "pm-awas-urban",
    name: "PM Awas Yojana — Urban",
    nameHi: "पीएम आवास योजना - शहरी",
    category: "Housing",
    benefit: "₹2.67 Lakh subsidy on home loan interest",
    icon: Home,
    color: "saffron",
    official: "pmaymis.gov.in",
    status: "Active",
    popularity: 94,
    trending: true,
    central: true,
    states: ["All"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    maxIncome: 600000,
    description: "Affordable housing support for urban low-income families.",
    documents: ["Aadhaar", "Income Proof", "Residence Proof", "Bank Details"],
  },
  {
    id: "pm-awas-rural",
    name: "PM Awas Yojana — Gramin",
    nameHi: "पीएम आवास योजना - ग्रामीण",
    category: "Housing",
    benefit: "Up to ₹1.2 Lakh housing assistance",
    icon: Home,
    color: "india",
    official: "pmayg.nic.in",
    status: "Active",
    popularity: 89,
    trending: true,
    central: true,
    states: ["All"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    maxIncome: 300000,
    needsRural: true,
    description: "Housing support for rural poor households.",
    documents: ["Aadhaar", "Land Record", "Bank Account", "Gram Panchayat Verification"],
  },
  {
    id: "pm-jay",
    name: "Ayushman Bharat (PM-JAY)",
    nameHi: "आयुष्मान भारत",
    category: "Healthcare",
    benefit: "₹5 Lakh/year health cover per family",
    icon: Heart,
    color: "india",
    official: "pmjay.gov.in",
    status: "Active",
    popularity: 98,
    trending: true,
    central: true,
    states: ["All"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    maxIncome: 250000,
    description: "Cashless hospital treatment coverage for eligible families.",
    documents: ["Aadhaar", "Ration Card", "SECC Eligibility", "Mobile Number"],
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    nameHi: "पीएम किसान सम्मान निधि",
    category: "Agriculture",
    benefit: "₹6,000/year direct income support",
    icon: Wheat,
    color: "saffron",
    official: "pmkisan.gov.in",
    status: "Active",
    popularity: 96,
    trending: true,
    central: true,
    states: ["All"],
    occupations: ["Farmer"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    needsFarmer: true,
    description: "Direct annual cash transfer for small and marginal farmers.",
    documents: ["Aadhaar", "Land Record", "Bank Passbook", "Mobile Number"],
  },
  {
    id: "mudra-shishu",
    name: "MUDRA Yojana — Shishu",
    nameHi: "मुद्रा योजना - शिशु",
    category: "Business",
    benefit: "Loan up to ₹50,000 without collateral",
    icon: Briefcase,
    color: "navy",
    official: "mudra.org.in",
    status: "Active",
    popularity: 84,
    trending: true,
    central: true,
    states: ["All"],
    occupations: ["Self-employed", "Business Owner", "Laborer"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    description: "Micro-credit support for very small businesses and self-employed citizens.",
    documents: ["Aadhaar", "PAN", "Bank Statement", "Business Proof"],
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana",
    nameHi: "सुकन्या समृद्धि योजना",
    category: "Girl Child",
    benefit: "8.2% interest, tax-free savings for girl child",
    icon: Users,
    color: "india",
    official: "nsiindia.gov.in",
    status: "Active",
    popularity: 91,
    trending: false,
    central: true,
    states: ["All"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    needsGirlChild: true,
    description: "Savings scheme for families with a girl child below 10 years.",
    documents: ["Girl Child Birth Certificate", "Parent Aadhaar", "Address Proof"],
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana",
    nameHi: "अटल पेंशन योजना",
    category: "Pension",
    benefit: "₹1,000 – ₹5,000/month pension after age 60",
    icon: Users,
    color: "navy",
    official: "npscra.nsdl.co.in",
    status: "Active",
    popularity: 83,
    trending: false,
    central: true,
    states: ["All"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["All"],
    minAge: 18,
    maxAge: 40,
    description: "Low-cost pension product for unorganized sector workers.",
    documents: ["Aadhaar", "Bank Account", "Mobile Number"],
  },
  {
    id: "maharashtra-ladki",
    name: "Majhi Ladki Bahin Yojana",
    nameHi: "माझी लाडकी बहीण योजना",
    category: "Women Support",
    benefit: "₹1,500/month support for eligible women",
    icon: Heart,
    color: "saffron",
    official: "Maharashtra State Portal",
    status: "Active",
    popularity: 97,
    trending: true,
    central: false,
    states: ["Maharashtra"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["Female"],
    maxIncome: 250000,
    description: "State support scheme for women from low-income families in Maharashtra.",
    documents: ["Aadhaar", "Domicile", "Income Certificate", "Bank Account"],
  },
  {
    id: "karnataka-gruha",
    name: "Gruha Lakshmi Scheme",
    nameHi: "गृह लक्ष्मी योजना",
    category: "Women Support",
    benefit: "₹2,000/month to female head of family",
    icon: Heart,
    color: "india",
    official: "Seva Sindhu Karnataka",
    status: "Active",
    popularity: 88,
    trending: true,
    central: false,
    states: ["Karnataka"],
    occupations: ["All"],
    categories: ["General", "OBC", "SC/ST"],
    genders: ["Female"],
    description: "Financial support for women who are heads of families in Karnataka.",
    documents: ["Aadhaar", "Ration Card", "Bank Account", "Residence Proof"],
  },
  {
    id: "wb-lakshmir-bhandar",
    name: "Lakshmir Bhandar",
    nameHi: "लक्ष्मीर भंडार",
    category: "Women Support",
    benefit: "₹1,000 – ₹1,200/month for women",
    icon: Heart,
    color: "saffron",
    official: "West Bengal State Portal",
    status: "Active",
    popularity: 86,
    trending: true,
    central: false,
    states: ["West Bengal"],
    occupations: ["All"],
    categories: ["SC/ST", "OBC", "General"],
    genders: ["Female"],
    description: "Monthly support for women in West Bengal households.",
    documents: ["Aadhaar", "Domicile", "Bank Details"],
  },
];

const colorMap: Record<string, { bg: string; light: string; border: string; text: string }> = {
  saffron: { bg: "from-saffron-400 to-saffron-600", light: "rgba(255,153,51,0.08)", border: "rgba(255,153,51,0.25)", text: "#E6862E" },
  india: { bg: "from-india-500 to-india-700", light: "rgba(19,136,8,0.08)", border: "rgba(19,136,8,0.25)", text: "#138808" },
  navy: { bg: "from-navy-700 to-navy-900", light: "rgba(15, 23, 42, 0.06)", border: "rgba(15, 23, 42, 0.2)", text: "#1E293B" },
};

function iconForCategory(category: string) {
  const c = category.toLowerCase();
  if (c.includes("health")) return Heart;
  if (c.includes("agri") || c.includes("farmer")) return Wheat;
  if (c.includes("business") || c.includes("loan")) return Briefcase;
  if (c.includes("housing") || c.includes("home")) return Home;
  if (c.includes("women") || c.includes("girl")) return Users;
  return Home;
}

function incomeValue(v: string) {
  if (v === "below-2.5L") return 250000;
  if (v === "2.5-5L") return 500000;
  if (v === "5-8L") return 800000;
  return 10000000;
}

function evaluateScheme(scheme: Scheme, profile: UserProfile) {
  const reasonsYes: string[] = [];
  const reasonsNo: string[] = [];
  let score = 0;

  const stateMatch = scheme.states.includes("All") || scheme.states.includes(profile.state);
  if (stateMatch) {
    score += 20;
    reasonsYes.push(scheme.states.includes("All") ? "Available across India" : `Available in ${profile.state}`);
  } else {
    reasonsNo.push(`Not available in ${profile.state}`);
  }

  const ageMatch = (!scheme.minAge || profile.age >= scheme.minAge) && (!scheme.maxAge || profile.age <= scheme.maxAge);
  if (ageMatch) {
    score += 20;
    reasonsYes.push("Age criteria matched");
  } else {
    reasonsNo.push(`Age criteria not matched${scheme.minAge || scheme.maxAge ? ` (${scheme.minAge ?? 0}-${scheme.maxAge ?? 100})` : ""}`);
  }

  const incomeMatch = !scheme.maxIncome || profile.income <= scheme.maxIncome;
  if (incomeMatch) {
    score += 20;
    reasonsYes.push("Income criteria matched");
  } else {
    reasonsNo.push(`Income too high for this scheme`);
  }

  const occupationMatch = scheme.occupations.includes("All") || scheme.occupations.includes(profile.occupation);
  if (occupationMatch) {
    score += 15;
    reasonsYes.push(scheme.occupations.includes("All") ? "Open to all occupations" : `${profile.occupation} category supported`);
  } else {
    reasonsNo.push(`This scheme is not for ${profile.occupation}`);
  }

  const categoryMatch = scheme.categories.includes(profile.category);
  if (categoryMatch) {
    score += 10;
    reasonsYes.push(`${profile.category} category supported`);
  } else {
    reasonsNo.push(`${profile.category} category not supported`);
  }

  const genderMatch = scheme.genders.includes("All") || scheme.genders.includes(profile.gender);
  if (genderMatch) {
    score += 5;
    reasonsYes.push("Gender criteria matched");
  } else {
    reasonsNo.push(`This scheme is not for ${profile.gender.toLowerCase()} applicants`);
  }

  if (scheme.needsRural) {
    if (profile.residence === "Rural") {
      score += 5;
      reasonsYes.push("Rural residence matched");
    } else {
      reasonsNo.push("Rural residence required");
    }
  }

  if (scheme.needsGirlChild) {
    if (profile.hasDaughter === "Yes") {
      score += 5;
      reasonsYes.push("Girl child condition matched");
    } else {
      reasonsNo.push("Girl child required for this scheme");
    }
  }

  if (scheme.needsFarmer) {
    if (profile.occupation === "Farmer") {
      score += 5;
      reasonsYes.push("Farmer profile matched");
    } else {
      reasonsNo.push("Farmer profile required");
    }
  }

  return {
    eligible: score >= 60 && reasonsNo.length <= 2,
    score: Math.min(score, 100),
    reasonsYes,
    reasonsNo,
  };
}

export default function Schemes() {
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    occupation: "All",
    income: incomeValue("below-2.5L"),
    state: "All India",
    category: "OBC",
    gender: "Male",
    residence: "Urban",
    familyType: "Joint",
    hasDaughter: "No",
  });
  const [incomeBand, setIncomeBand] = useState("below-2.5L");
  const [search, setSearch] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [customSchemes, setCustomSchemes] = useState(() => getCustomSchemes());

  useEffect(() => {
    const refresh = () => setCustomSchemes(getCustomSchemes());
    window.addEventListener("storage", refresh);
    window.addEventListener("bf-content-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("bf-content-updated", refresh);
    };
  }, []);

  const mergedSchemes: Scheme[] = useMemo(() => [
    ...customSchemes.map((s) => ({ ...s, icon: iconForCategory(s.category) })),
    ...allSchemes,
  ], [customSchemes]);

  const trendingSchemes = mergedSchemes
    .filter((s) => s.trending)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  const matchedSchemes = useMemo(() => {
    const base = mergedSchemes.filter((s) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.nameHi.includes(search) ||
        s.category.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q)
      );
    });

    if (!hasChecked) return base.map((s) => ({ scheme: s, evaluation: null }));

    return base
      .map((s) => ({ scheme: s, evaluation: evaluateScheme(s, profile) }))
      .sort((a, b) => (b.evaluation?.score ?? 0) - (a.evaluation?.score ?? 0));
  }, [search, hasChecked, profile, mergedSchemes]);

  const handleCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setHasChecked(true);
    }, 1200);
  };

  const handleReset = () => {
    setHasChecked(false);
    setSearch("");
    setIncomeBand("below-2.5L");
    setProfile({
      age: 25,
      occupation: "All",
      income: incomeValue("below-2.5L"),
      state: "All India",
      category: "OBC",
      gender: "Male",
      residence: "Urban",
      familyType: "Joint",
      hasDaughter: "No",
    });
  };

  const suggestions = useMemo(() => {
    const tips: string[] = [];
    if (profile.income > 250000) tips.push("Get an updated income certificate — many welfare schemes prefer income below ₹2.5 lakh.");
    if (profile.state === "All India") tips.push("Select your actual state to unlock state-level schemes and better matches.");
    if (profile.occupation === "All") tips.push("Choose a specific occupation like Farmer or Self-employed for more accurate scheme results.");
    if (profile.gender === "Female") tips.push("Women-focused schemes are available — you already unlock more benefits in many states.");
    if (profile.hasDaughter === "Yes") tips.push("You may qualify for girl-child savings and education schemes like Sukanya Samriddhi.");
    if (tips.length === 0) tips.push("Your profile is strong. Try reviewing state-specific women, pension, and rural housing schemes as next options.");
    return tips.slice(0, 4);
  }, [profile]);

  return (
    <section id="schemes" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 dot-bg opacity-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-india-200 bg-india-50 px-3 py-1 text-xs font-semibold text-india-700 mb-5"
          >
            🏛️ SCHEME ELIGIBILITY · योजना पात्रता
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Government schemes
            <br />
            <span className="text-india-700">you're missing out on.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            500+ central and state schemes. AI-style eligibility scoring tells you what you qualify for — and why.
          </p>
        </div>

        {/* Trending schemes */}
        <div className="mb-10 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-3 min-w-max">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-india-50 border border-india-100 text-xs font-bold uppercase tracking-wider text-india-700">
              <TrendingUp className="h-3.5 w-3.5" /> Trending Now
            </div>
            {trendingSchemes.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border px-4 py-2 bg-white shadow-sm" style={{ borderColor: "var(--border)" }}>
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${colorMap[s.color].bg} text-white flex items-center justify-center`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{s.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.popularity}% trend score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checker Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16 rounded-[2.5rem] border-4 border-india-100 bg-white p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background for the form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-india-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron-50 rounded-full blur-3xl opacity-50 -ml-32 -mb-32" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-india-600 text-white flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900">Check Your Scheme Eligibility</h3>
                <p className="text-sm text-navy-500">Fill your profile details to see central and state benefits for you.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Field label="Full Name (As on Aadhaar)">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="input-v3"
                />
              </Field>

              <Field label="Current Age">
                <div className="relative">
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile((p) => ({ ...p, age: parseInt(e.target.value || "0") }))}
                    className="input-v3"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-navy-400">Years</span>
                </div>
              </Field>

              <Field label="Gender">
                <select value={profile.gender} onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))} className="input-v3">
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </Field>

              <Field label="Home State">
                <select value={profile.state} onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))} className="input-v3">
                  <option value="All India">All Over India</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </Field>

              <Field label="Occupation (व्यवसाय)">
                <select value={profile.occupation} onChange={(e) => setProfile((p) => ({ ...p, occupation: e.target.value }))} className="input-v3">
                  <option value="All">Any Occupation (कोई भी)</option>
                  <option value="Farmer">Farmer (किसान)</option>
                  <option value="Student">Student (छात्र)</option>
                  <option value="Self-employed">Self-employed (स्व-रोजगार)</option>
                  <option value="Business Owner">Business Owner (व्यापारी)</option>
                  <option value="Laborer">Laborer / Worker (मजदूर)</option>
                </select>
              </Field>

              <Field label="Annual Family Income">
                <select
                  value={incomeBand}
                  onChange={(e) => {
                    setIncomeBand(e.target.value);
                    setProfile((p) => ({ ...p, income: incomeValue(e.target.value) }));
                  }}
                  className="input-v3"
                >
                  <option value="below-2.5L">Below ₹2.5 Lakh</option>
                  <option value="2.5-5L">₹2.5 – 5 Lakh</option>
                  <option value="5-8L">₹5 – 8 Lakh</option>
                  <option value="above-8L">Above ₹8 Lakh</option>
                </select>
              </Field>

              <Field label="Caste Category (जाति)">
                <select value={profile.category} onChange={(e) => setProfile((p) => ({ ...p, category: e.target.value }))} className="input-v3">
                  <option value="General">General (सामान्य)</option>
                  <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                  <option value="SC/ST">SC / ST (अ.जा. / अ.ज.जा.)</option>
                </select>
              </Field>

              <Field label="Residence Area">
                <div className="flex gap-2 p-1 bg-navy-50 rounded-xl border border-navy-100">
                  {["Urban", "Rural"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProfile(p => ({ ...p, residence: type }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        profile.residence === type 
                        ? "bg-white text-india-700 shadow-sm" 
                        : "text-navy-500 hover:text-navy-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-10 flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-navy-100">
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${profile.hasDaughter === "Yes" ? "bg-india-600 border-india-600" : "border-navy-200"}`}>
                      {profile.hasDaughter === "Yes" && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={(e) => setProfile(p => ({ ...p, hasDaughter: e.target.checked ? "Yes" : "No" }))} />
                    <span className="text-sm font-semibold text-navy-700">Girl child in family?</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="h-5 w-5 rounded border-2 border-navy-200 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white opacity-0" />
                    </div>
                    <span className="text-sm font-semibold text-navy-700">Disabled (Divyang)?</span>
                  </label>
                </div>
                
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search specific scheme name..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border bg-navy-50 text-sm focus:outline-none focus:border-india-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {hasChecked && (
                  <button 
                    onClick={handleReset} 
                    className="px-6 py-4 rounded-2xl border-2 border-navy-200 hover:bg-navy-50 text-sm font-bold text-navy-700 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" /> Reset
                  </button>
                )}
                <button
                  onClick={handleCheck}
                  disabled={isChecking}
                  className="px-10 py-4 rounded-2xl bg-india-600 hover:bg-india-700 text-white font-bold transition-all shadow-xl shadow-india-600/20 flex items-center justify-center gap-3 disabled:opacity-70 text-lg group"
                >
                  {isChecking ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <BadgeCheck className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  )}
                  {isChecking ? "Verifying..." : "Find My Schemes"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        {hasChecked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto mb-10">
            <div className="rounded-3xl border border-saffron-200 bg-saffron-50 p-5">
              <div className="flex items-center gap-2 mb-3 text-saffron-800 font-bold">
                <Sparkles className="h-4 w-4" /> What else should you update?
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-saffron-900">
                {suggestions.map((tip) => (
                  <div key={tip} className="rounded-xl bg-white/70 px-4 py-3 border border-saffron-100">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence mode="popLayout">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchedSchemes.map(({ scheme, evaluation }) => {
              const colors = colorMap[scheme.color];
              const score = evaluation?.score ?? scheme.popularity;
              const eligible = evaluation?.eligible ?? false;

              return (
                <motion.div
                  key={scheme.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative rounded-2xl border p-6 hover:shadow-xl transition-all overflow-hidden"
                  style={{ background: "var(--surface)", borderColor: eligible ? colors.border : "var(--border)" }}
                >
                  <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-white/30 blur-2xl" style={{ background: colors.light, filter: "blur(60px)" }} />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${colors.bg} text-white flex items-center justify-center shadow-lg`}>
                        <scheme.icon className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border`} style={{ background: "var(--surface)", borderColor: colors.border, color: eligible ? colors.text : "#64748B" }}>
                          <span className={`h-1.5 w-1.5 rounded-full ${eligible ? "bg-india-500" : "bg-amber-500"}`} />
                          {hasChecked ? (eligible ? "Eligible" : "Maybe") : scheme.status}
                        </span>
                        <div className="mt-2 text-xs font-bold" style={{ color: eligible ? colors.text : "var(--text-muted)" }}>
                          Score: {score}%
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                      {scheme.central ? "Central Scheme" : "State Scheme"} · {scheme.category}
                    </div>
                    <h3 className="text-lg font-bold leading-snug" style={{ color: "var(--text)" }}>{scheme.name}</h3>
                    <div className="text-xs font-semibold font-hindi mt-0.5" style={{ color: "var(--text-muted)" }}>{scheme.nameHi}</div>

                    <div className="mt-4 rounded-xl border p-3" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
                      <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>Benefit</div>
                      <div className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>{scheme.benefit}</div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--text-soft)" }}>
                      {scheme.description}
                    </p>

                    {hasChecked && evaluation && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Why you qualify</div>
                          <div className="space-y-1">
                            {evaluation.reasonsYes.slice(0, 3).map((r) => (
                              <div key={r} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-soft)" }}>
                                <Check className="h-3.5 w-3.5 text-india-600 mt-0.5 flex-shrink-0" /> {r}
                              </div>
                            ))}
                          </div>
                        </div>
                        {evaluation.reasonsNo.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-amber-700">What may block approval</div>
                            <div className="space-y-1">
                              {evaluation.reasonsNo.slice(0, 2).map((r) => (
                                <div key={r} className="flex items-start gap-2 text-xs text-amber-800">
                                  <CircleAlert className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> {r}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded-lg border px-2.5 py-2" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-1 text-navy-400 uppercase font-bold tracking-wider"><MapPin className="h-3 w-3" /> Coverage</div>
                        <div className="mt-1 font-semibold" style={{ color: "var(--text)" }}>
                          {scheme.states.includes("All") ? "All India" : scheme.states.join(", ")}
                        </div>
                      </div>
                      <div className="rounded-lg border px-2.5 py-2" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-1 text-navy-400 uppercase font-bold tracking-wider"><IndianRupee className="h-3 w-3" /> Type</div>
                        <div className="mt-1 font-semibold" style={{ color: "var(--text)" }}>{scheme.central ? "Central" : "State"}</div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-navy-50 border border-navy-100 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Key documents
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scheme.documents.slice(0, 3).map((doc) => (
                          <span key={doc} className="text-[10px] font-bold text-navy-600 px-2 py-1 rounded-md bg-white border border-navy-100">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <button className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all" style={{ color: colors.text }}>
                        Apply Now <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                        {scheme.official}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {hasChecked && matchedSchemes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-dashed border-india-200">
            <div className="text-5xl mb-4">🏛️</div>
            <h4 className="text-xl font-bold text-navy-900">No matching schemes found</h4>
            <p className="text-sm text-navy-500 mt-2">Try different criteria or update your state/income details to unlock more matches.</p>
            <button onClick={handleReset} className="mt-6 text-india-600 font-bold hover:underline">Reset Checker</button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 p-8 lg:p-12 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-saffron-400 mb-3">
                What else should we update?
              </div>
              <h3 className="text-3xl font-bold mb-3">
                Add more state schemes, pension products, women support, labor welfare and housing subsidies.
              </h3>
              <p className="text-navy-200 leading-relaxed">
                Next best updates for this section: caste-sensitive filters, district-level schemes, disabled citizen schemes, widow pension, MSME grants, state farmer incentives, and official portal tracking.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-5 py-3 text-sm font-bold text-white hover:bg-saffron-600 transition-colors">
                Explore all schemes <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "500+", l: "Central Schemes" },
                { v: "2,000+", l: "State Schemes" },
                { v: "94%", l: "Trending Match Accuracy" },
                { v: "Weekly", l: "Database Updates" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
                  <div className="text-3xl font-bold tabular-nums">{s.v}</div>
                  <div className="text-xs text-navy-300 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .input-v3 {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0F172A;
          outline: none;
          transition: all 0.2s;
        }
        .input-v3:focus {
          background: white;
          border-color: #138808;
          box-shadow: 0 0 0 4px rgba(19, 136, 8, 0.1);
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
      <label className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{label}</label>
      {children}
    </div>
  );
}
