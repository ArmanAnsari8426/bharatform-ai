import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User, Mic, Languages, ThumbsUp, Copy, Plus, KeyRound, AlertCircle, Loader2 } from "lucide-react";
import { useApp } from "../lib/context";
import { chatWithBharatAI } from "../lib/gemini";

type Msg = {
  role: "user" | "ai";
  content: string;
  error?: boolean;
};

const suggestionsByLang: Record<string, string[]> = {
  en: [
    "Emergency helplines in India?",
    "What documents are needed for a passport?",
    "How do I apply for an income certificate?",
    "What is PM Kisan Yojana?",
    "Aadhaar update fee?",
    "PAN-Aadhaar linking deadline?",
  ],
  hi: [
    "भारत में आपातकालीन हेल्पलाइन?",
    "पासपोर्ट के लिए कौन से दस्तावेज चाहिए?",
    "आय प्रमाण पत्र के लिए कैसे आवेदन करूं?",
    "पीएम किसान योजना क्या है?",
    "आधार अपडेट की फीस क्या है?",
    "ड्राइविंग लाइसेंस के लिए क्या चाहिए?",
  ],
};

export default function AskBharatAI() {
  const { lang, hasKey, openApiKey, session, openSignIn, showToast } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      content:
        lang === "hi"
          ? "नमस्ते! 🙏 मैं भारत AI हूँ — आपका सरकारी सहायक।\n\nकोई भी सरकारी फॉर्म, योजना, छात्रवृत्ति, या दस्तावेज़ के बारे में पूछें। मैं हिंदी, English, और 5+ भारतीय भाषाओं में जवाब दे सकता हूँ।"
          : "Namaste! 🙏 I'm Bharat AI — your government services assistant.\n\nAsk me anything about Indian government forms, schemes, scholarships, or documents. I answer in Hindi, English, and 5+ Indian languages.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [langMode, setLangMode] = useState<"auto" | "hi" | "en">("auto");
  const endRef = useRef<HTMLDivElement>(null);

  const suggestions = suggestionsByLang[lang === "hi" ? "hi" : "en"];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    if (!session) {
      showToast("info", "Please Sign In to chat with Bharat AI");
      openSignIn();
      return;
    }

    const userMsg: Msg = { role: "user", content: text };
    const history = messages.filter((m) => !m.error).slice(-10); // last 10 messages
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const targetLang = langMode === "auto" ? lang : langMode;
      const response = await chatWithBharatAI(history, text, targetLang);
      setMessages((m) => [...m, { role: "ai", content: response }]);
    } catch (e: any) {
      console.error("Chat Error:", e);
      setMessages((m) => [...m, {
        role: "ai",
        content: "Gemini abhi busy ya network slow lag raha hai, lekin main help kar sakta hoon. Aap passport, Aadhaar, PAN, scholarship, scheme eligibility ya emergency helpline ke baare me sawal pooch sakte hain. Agar urgent help chahiye to 112 call karein.",
      }]);
    } finally {
      setTyping(false);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section id="ask" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 dot-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold mb-5"
            style={{ color: "var(--text-soft)" }}
          >
            <Sparkles className="h-3 w-3 text-saffron-500" />
            ASK BHARAT AI · REAL GEMINI 2.5
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Ask anything.{" "}
            <span className="bg-gradient-to-r from-saffron-600 via-saffron-500 to-india-600 bg-clip-text text-transparent">
              In any language.
            </span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Real AI · Live Gemini API · Hindi, English & 5+ Indian languages
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-3xl border overflow-hidden shadow-2xl" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between border-b px-5 py-3"
              style={{ background: "linear-gradient(to right, rgba(255,153,51,0.06), transparent)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-india-500 border-2 border-white" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                    Bharat AI
                    {hasKey ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-india-50 text-india-700 border border-india-200 px-1.5 py-0.5 rounded">LIVE</span>
                    ) : (
                      <button onClick={openApiKey} className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 hover:bg-amber-100">
                        <KeyRound className="h-2 w-2" /> Connect AI
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-india-500 animate-pulse" />
                    {hasKey ? "Online · Gemini 2.5 Flash" : "Demo mode · Connect for real AI"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg px-2 py-1 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <Languages className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
                {[
                  { code: "auto", label: "Auto" },
                  { code: "hi", label: "हिं" },
                  { code: "en", label: "EN" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLangMode(l.code as typeof langMode)}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      langMode === l.code ? "bg-saffron-500 text-white" : ""
                    }`}
                    style={{ color: langMode === l.code ? "white" : "var(--text-soft)" }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[440px] overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      m.role === "user"
                        ? "bg-navy-900 text-white"
                        : m.error
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gradient-to-br from-saffron-500 to-saffron-700 text-white"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : m.error ? <AlertCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${m.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap text-left ${
                        m.role === "user"
                          ? "bg-navy-900 text-white"
                          : m.error
                          ? "bg-amber-50 border border-amber-200 text-amber-900"
                          : ""
                      }`}
                      style={m.role === "ai" && !m.error ? { background: "var(--bg-muted)", color: "var(--text)", border: "1px solid var(--border)" } : {}}
                    >
                      {m.content}
                    </div>
                    {m.role === "ai" && !m.error && (
                      <div className="mt-1.5 flex items-center gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        <button className="hover:opacity-70 inline-flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button onClick={() => copyMessage(m.content)} className="hover:opacity-70 inline-flex items-center gap-1">
                          <Copy className="h-3 w-3" />
                        </button>
                        <span>· Gemini 2.5 Flash</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 inline-flex items-center gap-2 border" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
                      <Loader2 className="h-3 w-3 animate-spin text-saffron-500" />
                      <span className="text-xs font-medium" style={{ color: "var(--text-soft)" }}>Bharat AI is thinking…</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {messages.length <= 2 && (
              <div className="px-5 pb-3 flex flex-wrap gap-1.5 border-t pt-3"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}
              >
                {suggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all"
                    style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-soft)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t p-3" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-end gap-2 rounded-2xl border p-2" style={{ borderColor: "var(--border)" }}>
                <button className="p-2 rounded-lg hover:bg-navy-50" style={{ color: "var(--text-muted)" }}>
                  <Plus className="h-4 w-4" />
                </button>
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={lang === "hi" ? "हिंदी, English, या अपनी भाषा में पूछें…" : "Ask in Hindi, English, or your language…"}
                  className="flex-1 resize-none bg-transparent text-sm outline-none px-2 py-1.5 font-hindi"
                  style={{ color: "var(--text)" }}
                />
                <button className="p-2 rounded-lg hover:bg-navy-50" style={{ color: "var(--text-muted)" }}>
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                  className="p-2 rounded-lg bg-saffron-500 text-white hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                {hasKey ? (
                  <>Powered by Google Gemini · Verify critical info from official sources</>
                ) : (
                  <button onClick={openApiKey} className="font-semibold text-saffron-700 hover:underline">
                    🔑 Connect Gemini API key for real AI responses (free)
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
