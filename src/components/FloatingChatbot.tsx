import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Loader2, User, KeyRound, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import { useApp } from "../lib/context";
import { chatWithBharatAI } from "../lib/gemini";

type Msg = { role: "user" | "ai"; content: string; error?: boolean };

const quickPrompts = [
  "Passport ke liye documents?",
  "Emergency helpline numbers?",
  "PM Kisan Yojana kya hai?",
  "Scholarship kaise milegi?",
];

export default function FloatingChatbot() {
  const { lang, hasKey, openApiKey, session, openSignIn, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      content:
        lang === "hi"
          ? "नमस्ते! 🙏 मैं भारत AI हूँ। सरकारी फॉर्म, योजना, छात्रवृत्ति या किसी भी सरकारी सेवा के बारे में पूछें।"
          : "Namaste! 🙏 I'm Bharat AI. Ask me about government forms, schemes, scholarships, or any government service.",
    },
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;

    if (!session) {
      showToast("info", "Please Sign In to chat with Bharat AI");
      openSignIn();
      setOpen(false);
      return;
    }

    const history = messages.filter((m) => !m.error).slice(-8);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);

    try {
      const response = await chatWithBharatAI(history, text, lang);
      setMessages((m) => [...m, { role: "ai", content: response }]);
    } catch (e: any) {
      console.error("Floating chat error:", e);
      setMessages((m) => [...m, {
        role: "ai",
        content: "Gemini abhi high demand me ho sakta hai, lekin main fallback help de raha hoon. Passport/Aadhaar/PAN/scheme/scholarship ya helpline ka sawal poochiye. Emergency ke liye 112 call karein.",
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setOpen(!open); setUnread(false); }}
        className={`fixed bottom-6 right-24 z-[100] flex items-center gap-2 rounded-full shadow-2xl transition-all ${
          open
            ? "h-14 w-14 justify-center bg-saffron-600 text-white"
            : "h-14 px-5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:shadow-saffron-500/40"
        }`}
        aria-label="Ask Bharat AI"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <div className="relative">
              <Bot className="h-6 w-6" />
              {unread && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-india-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-india-500" />
                </span>
              )}
            </div>
            <span className="text-sm font-black whitespace-nowrap">Ask Bharat AI</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-24 right-6 z-[99] rounded-3xl border border-navy-200 bg-white shadow-2xl overflow-hidden flex flex-col ${
              expanded ? "w-[400px] h-[600px] sm:w-[440px]" : "w-[340px] h-[480px] sm:w-[380px]"
            }`}
            style={{ maxWidth: "calc(100vw - 3rem)", maxHeight: "calc(100vh - 8rem)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-saffron-600 via-saffron-500 to-india-600 text-white">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-india-400 border-2 border-saffron-500" />
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-1.5">
                    Bharat AI
                    {hasKey ? (
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">Live</span>
                    ) : (
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-amber-400/40 px-1.5 py-0.5 rounded">Demo</span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-india-300 animate-pulse" />
                    {hasKey ? "Powered by Gemini" : "Connect AI to chat"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setExpanded(!expanded)} className="h-8 w-8 rounded-lg hover:bg-white/20 flex items-center justify-center" aria-label="Resize">
                  {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-lg hover:bg-white/20 flex items-center justify-center" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-navy-50/30">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      m.role === "user"
                        ? "bg-navy-900 text-white"
                        : m.error
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gradient-to-br from-saffron-500 to-saffron-700 text-white"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-3.5 w-3.5" /> : m.error ? <AlertCircle className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-navy-900 text-white"
                        : m.error
                        ? "bg-amber-50 border border-amber-200 text-amber-900"
                        : "bg-white border border-navy-100 text-navy-800"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white flex-shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl bg-white border border-navy-100 px-3 py-2.5 inline-flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-saffron-500" />
                    <span className="text-xs text-navy-500">Soch raha hoon…</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-navy-50/30">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[11px] font-medium px-2.5 py-1.5 rounded-full bg-white border border-navy-200 text-navy-700 hover:border-saffron-300 hover:bg-saffron-50 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-navy-100 p-3 bg-white">
              <div className="flex items-end gap-2 rounded-2xl border border-navy-200 p-1.5 focus-within:border-saffron-400 transition-colors">
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
                  placeholder={lang === "hi" ? "अपना सवाल लिखें…" : "Type your question…"}
                  className="flex-1 resize-none bg-transparent text-sm text-navy-900 placeholder:text-navy-400 outline-none px-2 py-1.5 max-h-24"
                />
                {!hasKey && (
                  <button onClick={openApiKey} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50" title="Connect AI key">
                    <KeyRound className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                  className="p-2 rounded-xl bg-saffron-500 text-white hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1.5 text-[9px] text-center text-navy-400 flex items-center justify-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-saffron-500" />
                {hasKey ? "Verify important info from official sources" : "Demo mode · Connect Gemini for real answers"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
