import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, HeartHandshake, MessageSquare, Send, Sparkles, Star, MapPin, CheckCircle2 } from "lucide-react";
import { IndiaFlagWaving } from "./IndiaFlag";
import AshokaEmblem from "./AshokaEmblem";
import { STATES } from "../lib/states";

function useCountdown(target: Date) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Launch() {
  const target = new Date("2026-08-15T00:00:00+05:30");
  const { days, hours, minutes, seconds } = useCountdown(target);
  const [submitted, setSubmitted] = useState(false);
  const [detectedState, setDetectedState] = useState<string>("Maharashtra");

  // Try to auto-detect state from timezone / locale
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Indian state timezones are all Asia/Kolkata, so use locale/lang heuristic
      const lang = navigator.language.toLowerCase();
      const stored = localStorage.getItem("bf-user-state");
      if (stored) {
        setDetectedState(stored);
        return;
      }
      if (tz.includes("Kolkata") || tz.includes("Calcutta")) {
        // Use ms-fallback for hindi-belt
        const fallbackByLang: Record<string, string> = {
          "hi": "Uttar Pradesh", "bn": "West Bengal", "ta": "Tamil Nadu", "te": "Andhra Pradesh",
          "mr": "Maharashtra", "gu": "Gujarat", "kn": "Karnataka", "ml": "Kerala", "pa": "Punjab",
          "or": "Odisha", "as": "Assam", "ur": "Jammu & Kashmir",
        };
        const langCode = lang.split("-")[0];
        if (fallbackByLang[langCode]) setDetectedState(fallbackByLang[langCode]);
      }
    } catch {}
  }, []);

  const submitSupport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const supporters = JSON.parse(localStorage.getItem("bf-launch-supporters") || "[]");
    const stateValue = data.get("state") as string;
    supporters.push({
      name: data.get("name"),
      state: stateValue,
      role: data.get("role"),
      improvement: data.get("improvement"),
      rating: data.get("rating"),
      feedback: data.get("feedback"),
      createdAt: Date.now(),
    });
    localStorage.setItem("bf-launch-supporters", JSON.stringify(supporters));
    if (stateValue) localStorage.setItem("bf-user-state", stateValue);
    event.currentTarget.reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // (State names are inlined in the background marquee below)

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />

      {/* Background: scrolling state names - properly contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {[
          { top: "8%", size: "3.5rem", dir: "normal", dur: "60s", offset: 0 },
          { top: "26%", size: "4.5rem", dir: "reverse", dur: "75s", offset: 6 },
          { top: "48%", size: "3rem", dir: "normal", dur: "55s", offset: 12 },
          { top: "70%", size: "4rem", dir: "reverse", dur: "70s", offset: 18 },
          { top: "88%", size: "3.5rem", dir: "normal", dur: "65s", offset: 24 },
        ].map((row, i) => {
          const slice = [...STATES.slice(row.offset), ...STATES.slice(0, row.offset)].slice(0, 18);
          const text = slice.map(s => s.name).join(" • ");
          return (
            <div
              key={i}
              className="absolute whitespace-nowrap text-white/[0.035] font-black uppercase tracking-wider"
              style={{
                top: row.top,
                fontSize: row.size,
                animation: `marquee ${row.dur} linear infinite`,
                animationDirection: row.dir as any,
                left: 0,
                width: "max-content",
                lineHeight: 1,
              }}
            >
              {text} • {text} • {text}
            </div>
          );
        })}
      </div>

      {/* Subtle radial glow instead of Ashoka watermarks (cleaner background) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,153,51,0.08), transparent 70%)" }} />
      </div>

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-saffron-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-india-600/15 blur-3xl" />

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -30, 0], rotate: [0, 360], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10 + i * 1.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          className="absolute h-2 w-2 rounded-full bg-saffron-400/30"
          style={{ top: `${5 + i * 8}%`, left: `${3 + i * 8}%` }}
        />
      ))}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Ashoka emblem at top — clean container with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-5"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-saffron-500/20 blur-2xl scale-150" />
            <AshokaEmblem className="relative h-20 w-auto drop-shadow-2xl" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-saffron-400/40 bg-saffron-500/10 px-4 py-1.5 text-xs font-semibold text-saffron-300 mb-6"
        >
          <Calendar className="h-3 w-3" />
          INDEPENDENCE DAY LAUNCH · सत्यमेव जयते
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <IndiaFlagWaving className="h-20 w-32 drop-shadow-2xl" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="block">Launching on</span>
          <span className="block mt-2 bg-gradient-to-r from-saffron-400 via-saffron-300 to-saffron-400 bg-clip-text text-transparent">
            15 August 2026
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl sm:text-2xl text-navy-200 max-w-3xl mx-auto leading-relaxed"
        >
          India's Independence Day. The day every Indian citizen gets an{" "}
          <span className="text-saffron-300 font-semibold">AI Government Assistant</span> that speaks their language.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-3 font-hindi text-lg text-navy-300"
        >
          हर Form, अब आसान।
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 inline-flex items-center gap-3 sm:gap-4 flex-wrap justify-center"
        >
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Minutes", value: minutes },
            { label: "Seconds", value: seconds },
          ].map((t, i) => (
            <div key={t.label} className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-2xl border border-saffron-400/30 bg-white/5 backdrop-blur p-4 sm:p-5 min-w-[80px] sm:min-w-[100px]">
                <div className="text-4xl sm:text-5xl font-bold tabular-nums text-saffron-300">
                  {String(t.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-navy-300 mt-1 font-bold">{t.label}</div>
              </div>
              {i < 3 && <div className="text-3xl text-navy-500 font-bold hidden sm:block">:</div>}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-saffron-600 transition-all shadow-xl shadow-saffron-500/30">
            <Sparkles className="h-4 w-4" />
            Join the waitlist
          </a>
          <a href="#launch-supporters" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all backdrop-blur">
            <HeartHandshake className="h-4 w-4" />
            Support before launch
          </a>
        </motion.div>

        <motion.div
          id="launch-supporters"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-16 grid max-w-5xl gap-4 lg:grid-cols-12"
        >
          {/* Who supports */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur lg:col-span-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-saffron-300">
              <Star className="h-4 w-4 fill-current" />
              Who can support before launch?
            </div>
            <div className="space-y-3">
              {[
                { role: "Students", text: "Test scholarship discovery and form explanations.", emoji: "🎓" },
                { role: "Parents", text: "Review service guides for first-time internet users.", emoji: "👪" },
                { role: "Teachers & NGOs", text: "Help improve Hindi and regional language clarity.", emoji: "📚" },
                { role: "CSC / Cyber cafe owners", text: "Give feedback on real government workflow gaps.", emoji: "🏪" },
                { role: "Government aspirants", text: "Help refine UPSC, SSC, and state PSC content.", emoji: "🏛️" },
                { role: "Farmers", text: "Validate PM Kisan, KCC, and rural scheme flows.", emoji: "🌾" },
              ].map((item) => (
                <div key={item.role} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-start gap-2.5">
                  <div className="text-xl">{item.emoji}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.role}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-navy-300">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback form */}
          <form onSubmit={submitSupport} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur lg:col-span-7">
            <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-saffron-300">
              <MessageSquare className="h-4 w-4" />
              Tell us what to improve before launch
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-300 mb-1">Your Name *</label>
                <input
                  name="name"
                  required
                  placeholder="Aarav Sharma"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-400 outline-none focus:border-saffron-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-300 mb-1 flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" /> Your State *
                </label>
                <select
                  name="state"
                  required
                  defaultValue={detectedState}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400"
                >
                  <optgroup label="States" className="text-navy-900">
                    {STATES.filter((s) => s.type === "state").map((s) => (
                      <option key={s.code} value={s.name} className="text-navy-900">{s.name} ({s.nameHi})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Union Territories" className="text-navy-900">
                    {STATES.filter((s) => s.type === "ut").map((s) => (
                      <option key={s.code} value={s.name} className="text-navy-900">{s.name}</option>
                    ))}
                  </optgroup>
                </select>
                <div className="mt-1 text-[10px] text-saffron-300 font-semibold">📍 Auto-detected: {detectedState}</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-300 mb-1">I am a *</label>
                <select
                  name="role"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400"
                >
                  {["Student", "Parent", "Teacher / NGO", "CSC / Cyber cafe", "Government aspirant", "Farmer", "Senior citizen", "Other"].map((r) => (
                    <option key={r} className="text-navy-900">{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-300 mb-1">Top priority to improve *</label>
                <select
                  name="improvement"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-saffron-400"
                >
                  {[
                    "More Hindi & regional language clarity",
                    "More state-specific portals",
                    "Better document checklist",
                    "Scholarship deadline alerts",
                    "Step-by-step video guides",
                    "Voice-based form filling",
                    "Offline mode for rural areas",
                    "WhatsApp integration",
                  ].map((i) => (
                    <option key={i} className="text-navy-900">{i}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-300 mb-2 flex items-center gap-1">
                <Star className="h-2.5 w-2.5" /> How would you rate BharatForm AI? *
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="cursor-pointer">
                    <input type="radio" name="rating" value={n} required defaultChecked={n === 5} className="peer sr-only" />
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold transition-all peer-checked:bg-saffron-500 peer-checked:border-saffron-400">
                      {"⭐".repeat(n)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-300 mb-1">Your detailed feedback *</label>
              <textarea
                name="feedback"
                required
                rows={3}
                placeholder="What should BharatForm AI fix before launch? Be specific..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-navy-400 outline-none focus:border-saffron-400"
              />
            </div>

            <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="text-xs text-navy-300">
                <CheckCircle2 className="inline h-3 w-3 text-india-400 mr-1" />
                Saved to admin dashboard
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-india-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-india-700">
                <Send className="h-4 w-4" />
                Submit feedback
              </button>
            </div>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl border border-india-400/30 bg-india-500/10 px-3 py-2 text-sm font-semibold text-india-200 flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Dhanyavaad! 🙏 Your feedback was saved for the admin team.
              </motion.div>
            )}
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-navy-400"
        >
          Helping every Indian understand government services. <span className="text-saffron-400">No agents. No middlemen. No mistakes.</span>
        </motion.p>
      </div>
    </section>
  );
}
