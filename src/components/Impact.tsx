import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 100000, suffix: "+", label: "Forms Analyzed", note: "Across all categories" },
  { value: 28, suffix: "", label: "States & UTs", note: "Pan-India coverage" },
  { value: 7, suffix: "", label: "Indian Languages", note: "Auto-detect enabled" },
  { value: 4.9, suffix: "/5", label: "User Rating", note: "From 12,000+ reviews", decimals: 1 },
  { value: 99, suffix: "%", label: "Satisfaction Rate", note: "Verified citizens" },
  { value: 24, suffix: "/7", label: "AI Availability", note: "Always-on assistant" },
];

function useCountUp(end: number, duration = 2000, _decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(end * eased);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const decimals = stat.decimals ?? 0;
  const { count, ref } = useCountUp(stat.value, 2200, decimals);
  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("en-IN");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border p-6 hover:shadow-lg transition-all group"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF9933")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="absolute -top-2 left-6 w-12 h-1 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight" style={{ color: "var(--text)" }}>
        {formatted}
        <span className="text-saffron-600">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: "var(--text)" }}>{stat.label}</div>
      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.note}</div>
    </motion.div>
  );
}

export default function Impact() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-white to-india-500 opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-saffron-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-india-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-400/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-300 mb-5"
          >
            🇮🇳 NATIONAL IMPACT
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Built for{" "}
            <span className="bg-gradient-to-r from-saffron-400 to-saffron-300 bg-clip-text text-transparent">
              1.4 billion
            </span>{" "}
            Indians.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-navy-200"
          >
            Trusted by citizens from Kashmir to Kanyakumari. Every number tells a story.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-india-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-india-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-india-300">
              Live Activity · Last 60 minutes
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-navy-200">
            {[
              { city: "Mumbai", action: "Passport form analyzed" },
              { city: "Delhi", action: "Scholarship matched" },
              { city: "Bengaluru", action: "Aadhaar update checked" },
              { city: "Patna", action: "Income certificate prepared" },
              { city: "Chennai", action: "Driving license guide opened" },
              { city: "Hyderabad", action: "Ration card eligibility verified" },
              { city: "Kolkata", action: "PAN correction analyzed" },
              { city: "Jaipur", action: "PM Awas scheme checked" },
              { city: "Lucknow", action: "Voter ID form uploaded" },
              { city: "Bhopal", action: "Caste certificate verified" },
              { city: "Ahmedabad", action: "Ayushman card checked" },
              { city: "Pune", action: "E-Shram card analyzed" },
            ].map((t, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2.5 py-1.5"
              >
                <span className="text-saffron-300 font-semibold">{t.city}</span>
                <span className="text-navy-400">·</span>
                <span>{t.action}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
