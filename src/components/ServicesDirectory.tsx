import { motion } from "framer-motion";
import {
  CreditCard, Car, Vote, Wheat, Heart, GraduationCap, Briefcase,
  Home, Users, Building, FileText, Shield, ChevronRight, Search,
  Plane, BookOpen, TrendingUp, Landmark, Phone, ArrowRight
} from "lucide-react";
import { useState } from "react";

const categories = [
  {
    id: "identity",
    title: "Identity & Citizenship",
    titleHi: "पहचान और नागरिकता",
    color: "from-saffron-400 to-saffron-600",
    items: [
      { name: "Aadhaar Card", nameHi: "आधार कार्ड", icon: CreditCard, desc: "Apply / Update / Download", count: 23 },
      { name: "PAN Card", nameHi: "पैन कार्ड", icon: FileText, desc: "New / Correction / Link", count: 12 },
      { name: "Voter ID", nameHi: "वोटर आईडी", icon: Vote, desc: "New / Transfer / Correction", count: 8 },
      { name: "Passport", nameHi: "पासपोर्ट", icon: Plane, desc: "Fresh / Renewal / Tatkal", count: 15 },
      { name: "Driving License", nameHi: "ड्राइविंग लाइसेंस", icon: Car, desc: "Learner / Permanent / Renewal", count: 18 },
    ],
  },
  {
    id: "welfare",
    title: "Welfare & Subsidies",
    titleHi: "कल्याण और सब्सिडी",
    color: "from-india-500 to-india-700",
    items: [
      { name: "PM Awas Yojana", nameHi: "पीएम आवास योजना", icon: Home, desc: "Housing subsidy up to ₹2.67L", count: 9 },
      { name: "Ayushman Bharat", nameHi: "आयुष्मान भारत", icon: Heart, desc: "₹5L health cover", count: 6 },
      { name: "PM Kisan", nameHi: "पीएम किसान", icon: Wheat, desc: "₹6,000/year direct benefit", count: 7 },
      { name: "MUDRA Loan", nameHi: "मुद्रा ऋण", icon: Briefcase, desc: "Up to ₹10L business loan", count: 11 },
      { name: "Ration Card", nameHi: "राशन कार्ड", icon: Building, desc: "APL / BPL / AAY", count: 14 },
    ],
  },
  {
    id: "education",
    title: "Education & Skills",
    titleHi: "शिक्षा और कौशल",
    color: "from-navy-700 to-navy-900",
    items: [
      { name: "Scholarships", nameHi: "छात्रवृत्ति", icon: GraduationCap, desc: "Pre & post-matric", count: 32 },
      { name: "Skill India", nameHi: "स्किल इंडिया", icon: TrendingUp, desc: "PMKVY training", count: 18 },
      { name: "NCERT Books", nameHi: "एनसीईआरटी", icon: BookOpen, desc: "Free downloads", count: 5 },
      { name: "PM-USHA", nameHi: "पीएम-उषा", icon: Landmark, desc: "Higher education aid", count: 8 },
      { name: "Beti Bachao", nameHi: "बेटी बचाओ", icon: Users, desc: "Girl child education", count: 6 },
    ],
  },
  {
    id: "business",
    title: "Business & Tax",
    titleHi: "व्यवसाय और कर",
    color: "from-saffron-500 to-saffron-700",
    items: [
      { name: "GST", nameHi: "जीएसटी", icon: FileText, desc: "Registration / Return", count: 16 },
      { name: "Income Tax", nameHi: "आयकर", icon: Landmark, desc: "ITR filing / Refund", count: 14 },
      { name: "MSME / Udyam", nameHi: "उद्यम", icon: Briefcase, desc: "Business registration", count: 9 },
      { name: "FSSAI", nameHi: "एफएसएसएआई", icon: Shield, desc: "Food license", count: 7 },
      { name: "Startup India", nameHi: "स्टार्टअप", icon: TrendingUp, desc: "Funding / Recognition", count: 11 },
    ],
  },
];

const allServices = categories.flatMap(c => c.items);

export default function ServicesDirectory() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = allServices.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nameHi.includes(search) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const showCategory = activeCategory ? categories.find(c => c.id === activeCategory) : null;
  const displayItems = showCategory ? showCategory.items : filtered;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--bg-soft)" }}>
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700 mb-5"
          >
            <Landmark className="h-3 w-3" />
            GOVERNMENT SERVICE DIRECTORY · 250+ SERVICES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Browse services{" "}
            <span className="text-saffron-600">like never before.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Inspired by India.gov.in · Enhanced with AI · All major central & state services.
          </p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
              placeholder="Search 250+ government services..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 text-base focus:outline-none focus:border-saffron-400 focus:ring-4 focus:ring-saffron-100"
              style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
        </motion.div>

        {/* Categories */}
        {!search && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {categories.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className="group relative rounded-2xl border p-5 text-left overflow-hidden transition-all hover:shadow-lg"
                style={{
                  background: activeCategory === c.id ? "var(--surface)" : "var(--surface)",
                  borderColor: activeCategory === c.id ? "#FF9933" : "var(--border)",
                }}
              >
                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-10 blur-2xl`} />
                <div className={`relative h-10 w-10 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md mb-3`}>
                  <Building className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.title}</h3>
                <div className="text-xs font-hindi mt-0.5" style={{ color: "var(--text-muted)" }}>{c.titleHi}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {c.items.length} categories
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${activeCategory === c.id ? "rotate-90 text-saffron-600" : ""}`} style={{ color: activeCategory === c.id ? "#FF9933" : "var(--text-muted)" }} />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Service items */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {displayItems.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.name}
                href="#analyze"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group flex items-center gap-3 rounded-xl border p-3.5 hover:border-saffron-300 hover:shadow-md transition-all"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="h-10 w-10 rounded-lg bg-saffron-50 flex items-center justify-center flex-shrink-0 group-hover:bg-saffron-100 transition-colors">
                  <Icon className="h-5 w-5 text-saffron-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                  <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    <span className="font-hindi">{s.nameHi}</span> · {s.desc}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "#FF9933" }} />
              </motion.a>
            );
          })}
        </motion.div>

        {showCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-700 hover:underline"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              View all categories
            </button>
          </motion.div>
        )}

        {/* Helpline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border-2 border-saffron-200 bg-gradient-to-br from-saffron-50 to-white p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 text-white flex items-center justify-center shadow-md">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-bold" style={{ color: "var(--text)" }}>Can't find what you need?</div>
              <div className="text-sm" style={{ color: "var(--text-soft)" }}>Call the National Government Service Helpline: <strong>14400</strong> · Available 24/7 in 12 languages</div>
            </div>
          </div>
          <a
            href="tel:14400"
            className="inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-saffron-600 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call 14400
          </a>
        </motion.div>
      </div>
    </section>
  );
}
