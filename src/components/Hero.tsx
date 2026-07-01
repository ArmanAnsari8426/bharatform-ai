import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Upload, MessageCircle, Shield, Cpu, FileCheck, ArrowRight, AlertCircle, FileText, Bot } from "lucide-react";
import { useApp } from "../lib/context";
import IndiaFlag, { IndiaFlagWaving } from "./IndiaFlag";
import IndiaMap from "./IndiaMap";
import AshokaEmblem from "./AshokaEmblem";

export default function Hero() {
  const { t, openAnalysis } = useApp();

  return (
    <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, var(--hero-bg-from), var(--hero-bg-via), var(--hero-bg-to))` }}>
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,153,51,0.25), transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(19,136,8,0.2), transparent 70%)", filter: "blur(80px)" }} />
      <div className="pointer-events-none absolute -right-10 top-20 hidden h-[440px] w-[380px] opacity-30 xl:block">
        <IndiaMap className="h-full w-full" />
      </div>

      {[
        { top: "18%", left: "6%", delay: 0.1 },
        { top: "72%", left: "12%", delay: 0.6 },
        { top: "16%", left: "88%", delay: 1.0 },
      ].map((flag, i) => (
        <motion.div
          key={i}
          className="absolute hidden rounded-md shadow-lg lg:block"
          style={{ top: flag.top, left: flag.left }}
          animate={{ y: [0, -10, 0], rotate: [0, i % 2 ? -3 : 3, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: flag.delay, ease: "easeInOut" }}
        >
          <IndiaFlag className="h-5 w-auto rounded-sm" />
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <AshokaEmblem className="h-24 sm:h-28 lg:h-32 w-auto" />
          </motion.div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-saffron-700 font-hindi">
            सत्यमेव जयते
          </div>
          <div className="text-[10px] uppercase tracking-widest text-navy-500">
            Truth Alone Triumphs
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}>
            <IndiaFlag className="h-3 w-auto rounded-sm shadow-sm" />
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-500" />
            </span>
            <span>{t.hero_announcement}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]"
              style={{ color: "var(--text)" }}
            >
              {t.hero_title_1}
              <br />
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-saffron-600 via-saffron-500 to-saffron-700 bg-clip-text text-transparent">
                  {t.hero_title_2}
                </span>
              </span>
              <br />
              <span style={{ color: "var(--text)" }}>{t.hero_title_3}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              style={{ color: "var(--text-soft)" }}
            >
              {t.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <button
                onClick={() => openAnalysis()}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-navy-800 transition-all"
                style={{ boxShadow: "0 10px 25px -5px rgba(15,23,42,0.3)" }}
              >
                <Upload className="h-5 w-5 text-saffron-400" />
                {t.hero_cta_primary}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#ask"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-base font-semibold transition-all"
                style={{ background: "var(--surface)", borderColor: "var(--border-strong)", color: "var(--text)" }}
              >
                <MessageCircle className="h-5 w-5 text-india-600" />
                {t.hero_cta_secondary}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm"
            >
              {[
                { flag: true, text: t.hero_badge_1 },
                { icon: Shield, text: t.hero_badge_2 },
                { icon: Cpu, text: t.hero_badge_3 },
                { icon: FileCheck, text: t.hero_badge_4 },
              ].map((b, i) => {
                const Icon = "icon" in b ? b.icon : null;
                return (
                  <div key={i} className="flex items-center gap-1.5" style={{ color: "var(--text-soft)" }}>
                    {Icon ? <Icon className="h-4 w-4 text-india-600" /> : <IndiaFlag className="h-3.5 w-auto rounded-sm shadow-sm" />}
                    <span className="font-medium">{b.text}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Big animated flag below badges on desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden lg:flex items-center gap-3 mt-8 pt-6 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <IndiaFlagWaving className="h-12 w-20" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-saffron-700">Proudly Indian</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Built in भारत · for भारत · by भारतीयों
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <FormAnalysisDemo onViewAll={openAnalysis} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormAnalysisDemo({ onViewAll }: { onViewAll: () => void }) {
  const { t } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % 4), 3500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      label: t.hero_demo_field,
      meaning: t.hero_demo_meaning,
      ai: "Bharat AI: Surname means your परिवार का नाम. Write the surname exactly as on Aadhaar.",
    },
    {
      label: "Common Mistake",
      meaning: "Many applicants write nicknames or father's name. Use only official surname.",
      ai: "⚠️ 40% of rejections come from surname mismatch with Aadhaar.",
    },
    {
      label: "Required Attachment",
      meaning: "Passport-size photo (35×45mm, white background)",
      ai: "📎 Photo dimensions: 35×45mm. White background. 80% face coverage.",
    },
    {
      label: "Cross-Reference",
      meaning: "Matched with Aadhaar, Birth Certificate, 10th Marksheet",
      ai: "✅ All 3 cross-references match. Confidence: 98%.",
    },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,153,51,0.25), rgba(19,136,8,0.15), rgba(15,23,42,0.15))" }} />

      <div className="relative rounded-2xl border overflow-hidden shadow-2xl"
        style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--card-shadow-lg)" }}>
        <div className="flex items-center gap-1.5 border-b px-4 py-2.5"
          style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3 flex items-center gap-1.5 px-3 py-1 rounded-md border"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <Shield className="h-3 w-3 text-india-600" />
            <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>bharatform.ai/analyze</span>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-saffron-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-saffron-700" />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{t.hero_demo_form}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.hero_demo_form_sub}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-india-50 border border-india-200 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-india-600 animate-pulse" />
              <span className="text-[10px] font-semibold text-india-700">AI Live</span>
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border-2 border-saffron-300 bg-saffron-50/50 p-3.5"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wide">Field {7 + step}</span>
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{steps[step].label}</span>
              <span className="text-[10px] text-red-500 font-bold">*Required</span>
            </div>
            <div className="text-xs leading-relaxed" style={{ color: "var(--text-soft)" }}>
              {steps[step].meaning}
            </div>
          </motion.div>

          <motion.div
            key={`ai-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 p-3.5 text-white shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 rounded-md bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400">{t.hero_demo_ai_label}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-navy-100">{steps[step].ai}</p>
          </motion.div>

          <div className="flex items-center gap-1.5 pt-1">
            {["24 fields", "92% Confident", "Hindi · English"].map((c, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-1 rounded-md border"
                style={{ background: "var(--bg-muted)", color: "var(--text-soft)", borderColor: "var(--border)" }}>
                {c}
              </span>
            ))}
          </div>

          <button
            onClick={onViewAll}
            className="w-full rounded-lg bg-saffron-500 hover:bg-saffron-600 px-3 py-2 text-xs font-bold text-white transition-colors"
          >
            {t.hero_demo_btn} →
          </button>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:flex absolute -left-6 -bottom-6 items-center gap-2.5 rounded-xl border bg-white p-3 shadow-xl"
        style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}
      >
        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-amber-700" />
        </div>
        <div>
          <div className="text-[11px] font-bold" style={{ color: "var(--text)" }}>1 issue found</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Photo size mismatch</div>
        </div>
      </motion.div>
    </div>
  );
}
