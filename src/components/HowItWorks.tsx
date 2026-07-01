import { motion } from "framer-motion";
import { Upload, ScanLine, FileSearch, Send, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Form",
    titleHi: "फॉर्म अपलोड करें",
    desc: "Drop any government PDF, photo of a form, or paste form text. We support Hindi & English.",
    bullets: ["PDF, JPG, PNG", "Hindi + English", "Up to 50 pages"],
    color: "saffron",
  },
  {
    icon: ScanLine,
    title: "AI Analysis",
    titleHi: "AI विश्लेषण",
    desc: "Gemini Vision reads every field, identifies required documents, and flags common mistakes.",
    bullets: ["Gemini 2.5 Pro", "99.2% field detection", "Field-level explanation"],
    color: "india",
  },
  {
    icon: FileSearch,
    title: "Understand Requirements",
    titleHi: "आवश्यकताएं समझें",
    desc: "Get a plain-language explanation in your language. Know exactly what documents you need.",
    bullets: ["7 Indian languages", "Document checklist", "Mistake warnings"],
    color: "navy",
  },
  {
    icon: Send,
    title: "Submit With Confidence",
    titleHi: "विश्वास से जमा करें",
    desc: "Verify readiness, fix missing items, and submit knowing your application is complete.",
    bullets: ["Readiness score", "Rejection prevention", "Submission guide"],
    color: "saffron",
  },
];

const colorMap = {
  saffron: { bg: "#FF9933", ring: "rgba(255,153,51,0.3)", text: "#E6862E" },
  india: { bg: "#138808", ring: "rgba(19,136,8,0.3)", text: "#138808" },
  navy: { bg: "#0F172A", ring: "rgba(15,23,42,0.3)", text: "#1E293B" },
};

export default function HowItWorks() {
  return (
    <section className="py-24 relative" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-india-200 bg-india-50 px-3 py-1 text-xs font-semibold text-india-700 mb-5"
          >
            HOW IT WORKS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            From confused to confident
            <br />
            <span className="text-saffron-600">in 4 simple steps.</span>
          </motion.h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-300 via-india-400 to-saffron-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {steps.map((s, i) => {
              const colors = colorMap[s.color as keyof typeof colorMap];
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ring-8"
                      style={{ background: colors.bg, boxShadow: `0 0 0 8px ${colors.ring}` }}
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-bold tabular-nums" style={{ color: "var(--text-muted)" }}>
                      0{i + 1}
                    </div>
                  </div>

                  <div className="rounded-2xl border p-5 hover:shadow-lg transition-all h-full" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>{s.title}</h3>
                    <div className="text-xs font-semibold font-hindi mt-0.5" style={{ color: "var(--text-muted)" }}>{s.titleHi}</div>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{s.desc}</p>

                    <div className="mt-4 space-y-1.5">
                      {s.bullets.map((b) => (
                        <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-soft)" }}>
                          <div className="h-1 w-1 rounded-full" style={{ background: colors.bg }} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-12 -right-2.5 z-20 h-5 w-5 items-center justify-center rounded-full border shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <ArrowRight className="h-2.5 w-2.5" style={{ color: "var(--text-muted)" }} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
