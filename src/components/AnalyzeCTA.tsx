import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, KeyRound } from "lucide-react";
import { useApp } from "../lib/context";

export default function AnalyzeCTA() {
  const { openAnalysis, openApiKey, hasKey, showToast, session, openSignIn } = useApp();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (!session) {
      showToast("info", "Please Sign In to analyze government forms");
      openSignIn();
      return;
    }
    const supported = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
    if (!supported.includes(f.type)) {
      showToast("error", "Unsupported file. Use PDF, JPG, PNG, or WEBP.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      showToast("error", "File too large. Max 20MB.");
      return;
    }
    openAnalysis(f);
  };

  return (
    <section id="analyze" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--bg), var(--bg-soft), var(--bg))" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-saffron-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-300 bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-800 mb-5"
          >
            <Sparkles className="h-3 w-3" />
            REAL AI · POWERED BY GEMINI 2.5
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Upload any form.{" "}
            <span className="text-saffron-600">Get instant clarity.</span>
          </motion.h2>
          <p className="mt-3 text-base" style={{ color: "var(--text-soft)" }}>
            Real Gemini AI analyzes every field, lists documents, flags mistakes — in 10 seconds.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border overflow-hidden shadow-2xl"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />

          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 lg:p-10">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                }}
                className={`relative block rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                  dragOver ? "border-saffron-500 scale-[1.01]" : "border-navy-200 hover:border-saffron-300"
                }`}
                style={{ background: dragOver ? "rgba(255,153,51,0.06)" : "var(--bg-muted)" }}
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white shadow-lg shadow-saffron-500/30 mb-4">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-base font-bold" style={{ color: "var(--text)" }}>
                    Drop your form here
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    or click to browse · PDF, JPG, PNG, WEBP · max 20MB
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); openAnalysis(); }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 hover:underline"
                  >
                    Or try a sample form →
                  </button>
                </div>
              </label>

              {!hasKey && (
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
                  <KeyRound className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs text-amber-900">
                    <strong>Free Gemini API key needed for real analysis.</strong> Takes 60 seconds — get one from Google AI Studio.
                  </div>
                  <button
                    onClick={openApiKey}
                    className="rounded-md bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l p-8 lg:p-10" style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, var(--bg-muted), rgba(255,153,51,0.04))" }}>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-saffron-700" />
                </div>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Your AI analysis appears here
                </div>
                <div className="text-xs mt-1 max-w-[220px]" style={{ color: "var(--text-muted)" }}>
                  Upload a form to see Gemini AI analyze every field in real-time
                </div>
                <button
                  onClick={() => openAnalysis()}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-saffron-400" />
                  Open Analyzer
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          style={{ color: "var(--text-soft)" }}
        >
          {[
            "🔒 End-to-end encrypted",
            "🇮🇳 Data stays in India",
            "⚡ 10-second analysis",
            "🗑️ Never stored",
          ].map((t) => (
            <span key={t} className="font-medium">{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
