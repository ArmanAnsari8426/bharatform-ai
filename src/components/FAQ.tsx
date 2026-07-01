import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Is BharatForm AI a government website?",
    a: "No. BharatForm AI is an independent AI platform that helps citizens understand and complete government processes. We are not affiliated with the Government of India. We use publicly available information and AI to make forms easier. Always verify critical information from official sources.",
  },
  {
    q: "How does the Form Analyzer work?",
    a: "Upload any government PDF form (or take a photo). Our AI, powered by Gemini 2.5 Pro, reads every field and explains it in plain Hindi or English — including what to write, common mistakes, and which documents you need attached.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We use end-to-end encryption for all uploads. Documents are auto-deleted within 24 hours of analysis. We never sell or share your data. We are SOC 2 Type II certified and comply with India's DPDP Act 2023.",
  },
  {
    q: "Which languages do you support?",
    a: "Currently we support Hindi, English, Bengali, Marathi, Tamil, Telugu, and Urdu. The AI auto-detects your language from your question. We're adding Punjabi, Gujarati, Kannada, and Malayalam in the next quarter.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The Free plan gives you 5 form analyses per month forever, with no credit card required. The Pro plan (₹99/month) adds unlimited analyses, AI chat, scholarship finder, and document readiness checker.",
  },
  {
    q: "Do you help me fill the actual form?",
    a: "We explain every field and tell you exactly what to write — but you submit the form yourself on the official government portal. This keeps your data with the government and ensures your submission is official and valid.",
  },
  {
    q: "What if AI makes a mistake?",
    a: "AI is a powerful assistant, not a replacement for official sources. For critical decisions (visa applications, complex legal forms), we always recommend verifying with the relevant department. We mark our confidence level for every answer.",
  },
  {
    q: "Can I use this for my business or school?",
    a: "Yes! We have Enterprise and Education plans. Schools use us to help students apply for scholarships. Businesses use us for GST, FSSAI, and compliance forms. Contact us at enterprise@bharatform.ai.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold mb-5"
            style={{ color: "var(--text-soft)" }}
          >
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Questions, answered.
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-2xl border transition-all`}
              style={{
                background: open === i ? "rgba(255, 153, 51, 0.04)" : "var(--surface)",
                borderColor: open === i ? "#FF9933" : "var(--border)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-semibold text-base" style={{ color: "var(--text)" }}>{f.q}</span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all flex-shrink-0 ${
                    open === i ? "bg-saffron-500 text-white rotate-45" : ""
                  }`}
                  style={open !== i ? { background: "var(--bg-muted)", color: "var(--text-soft)" } : {}}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
