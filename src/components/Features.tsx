import { motion } from "framer-motion";
import {
  FileSearch,
  ClipboardCheck,
  GraduationCap,
  Home,
  Bot,
  SearchX,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Form Analyzer",
    titleHi: "फॉर्म विश्लेषक",
    subtitle: "AI Vision for any PDF",
    desc: "Upload any government form. AI explains every field in Hindi & English — with examples, mistakes to avoid, and required attachments.",
    color: "saffron",
    size: "lg",
    badge: "Most used",
    stats: [
      { label: "Forms parsed", value: "1.2M+" },
      { label: "Avg. time saved", value: "4.5 hrs" },
      { label: "Field accuracy", value: "98.4%" },
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Document Readiness Checker",
    titleHi: "दस्तावेज़ तैयारी जांच",
    subtitle: "Know before you apply",
    desc: "Get a readiness score out of 100. Find missing documents before submission.",
    color: "india",
    size: "md",
  },
  {
    icon: Bot,
    title: "Bharat AI Assistant",
    titleHi: "भारत AI सहायक",
    subtitle: "Ask anything, in any language",
    desc: "Chat in Hindi, English, Tamil, Bengali, Marathi, Telugu, Urdu. Real answers, not links.",
    color: "navy",
    size: "md",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Finder",
    titleHi: "छात्रवृत्ति खोजक",
    subtitle: "Find what you qualify for",
    desc: "Personalized matches based on age, income, category, state & education.",
    color: "saffron",
    size: "md",
  },
  {
    icon: Home,
    title: "Scheme Eligibility Checker",
    titleHi: "योजना पात्रता जांच",
    subtitle: "Government schemes for you",
    desc: "Discover central & state schemes you're eligible for — benefits, deadlines, links.",
    color: "india",
    size: "md",
  },
  {
    icon: SearchX,
    title: "Missing Document Finder",
    titleHi: "गुम दस्तावेज़ खोजक",
    subtitle: "Never miss a paper again",
    desc: "AI cross-checks your application against 100+ government service databases.",
    color: "navy",
    size: "sm",
  },
  {
    icon: BookOpen,
    title: "Government Service Guide",
    titleHi: "सरकारी सेवा गाइड",
    subtitle: "Plain-language walkthroughs",
    desc: "Step-by-step guides for every major government service across India.",
    color: "saffron",
    size: "sm",
  },
  {
    icon: ShieldCheck,
    title: "Rejection Prevention",
    titleHi: "अस्वीकृति रोकथाम",
    subtitle: "Submit with confidence",
    desc: "Predict rejection risk. Fix issues before they cost you time and money.",
    color: "india",
    size: "sm",
  },
];

const colorMap = {
  saffron: { light: "rgba(255, 153, 51, 0.08)", border: "rgba(255, 153, 51, 0.25)", text: "#E6862E", icon: "from-saffron-400 to-saffron-600" },
  india: { light: "rgba(19, 136, 8, 0.08)", border: "rgba(19, 136, 8, 0.25)", text: "#138808", icon: "from-india-500 to-india-700" },
  navy: { light: "rgba(15, 23, 42, 0.06)", border: "rgba(15, 23, 42, 0.2)", text: "#1E293B", icon: "from-navy-700 to-navy-900" },
};

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 dot-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700 mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
            PRODUCT CAPABILITIES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            What do you need help with?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg"
            style={{ color: "var(--text-soft)" }}
          >
            One platform. Eight powerful AI tools. Built for every Indian citizen.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {features.map((f, i) => {
            const colors = colorMap[f.color as keyof typeof colorMap];
            const sizeClass = {
              lg: "lg:col-span-2 lg:row-span-2",
              md: "lg:col-span-2",
              sm: "lg:col-span-1",
            }[f.size];

            return (
              <motion.a
                key={f.title}
                href="#analyze"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`group relative rounded-2xl border p-6 lg:p-7 transition-all hover:shadow-xl hover:-translate-y-0.5 overflow-hidden ${sizeClass}`}
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  ["--feature-light" as any]: colors.light,
                  ["--feature-border" as any]: colors.border,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.border)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/40 blur-2xl pointer-events-none" style={{ background: colors.light, filter: "blur(60px)" }} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors.icon} text-white shadow-lg`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    {f.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border" style={{ background: "var(--surface)", borderColor: colors.border, color: colors.text }}>
                        {f.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                    {f.title}
                  </h3>
                  <div className="text-xs font-semibold font-hindi mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {f.titleHi}
                  </div>
                  <div className={`text-xs font-semibold uppercase tracking-wider mt-2 mb-3`} style={{ color: colors.text }}>
                    {f.subtitle}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{f.desc}</p>

                  <div className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all`} style={{ color: colors.text }}>
                    Try now
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>

                  {f.size === "lg" && f.stats && (
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {f.stats.map((s) => (
                        <div key={s.label} className="rounded-lg p-2.5 border" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
                          <div className="text-lg font-bold tabular-nums" style={{ color: "var(--text)" }}>{s.value}</div>
                          <div className="text-[10px] uppercase tracking-wide font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
