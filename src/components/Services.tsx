import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, IndianRupee, FileText, ExternalLink, ChevronRight, Shield, X, Search } from "lucide-react";
import ServiceDetailModal, { SERVICES_DATA } from "./ServiceDetail";
import { getCustomServices } from "../lib/contentStore";

const services = [
  {
    id: "passport",
    name: "Passport",
    emoji: "🛂",
    authority: "MEA",
    fee: "₹1,500 – ₹2,000",
    time: "30 – 45 days",
    docs: 6,
    mistakes: "Photo background mismatch",
  },
  {
    id: "aadhaar",
    name: "Aadhaar",
    emoji: "🪪",
    authority: "UIDAI",
    fee: "Free / ₹50",
    time: "7 – 30 days",
    docs: 4,
    mistakes: "Wrong document upload",
  },
  {
    id: "pan",
    name: "PAN Card",
    emoji: "💳",
    authority: "Income Tax Dept.",
    fee: "₹107",
    time: "15 – 20 days",
    docs: 3,
    mistakes: "Name mismatch with Aadhaar",
  },
  {
    id: "driving",
    name: "Driving License",
    emoji: "🚗",
    authority: "RTO",
    fee: "₹200 – ₹1,000",
    time: "7 – 30 days",
    docs: 5,
    mistakes: "Missing medical certificate",
  },
  {
    id: "voter",
    name: "Voter ID",
    emoji: "🗳️",
    authority: "Election Commission",
    fee: "Free",
    time: "15 – 30 days",
    docs: 3,
    mistakes: "Wrong constituency selected",
  },
  {
    id: "income",
    name: "Income Certificate",
    emoji: "💰",
    authority: "State Revenue Dept.",
    fee: "₹10 – ₹50",
    time: "7 – 21 days",
    docs: 5,
    mistakes: "Outdated salary slips",
  },
  {
    id: "caste",
    name: "Caste Certificate",
    emoji: "📜",
    authority: "State Revenue Dept.",
    fee: "₹10 – ₹50",
    time: "15 – 30 days",
    docs: 4,
    mistakes: "Wrong sub-category mentioned",
  },
  {
    id: "ration",
    name: "Ration Card",
    emoji: "🌾",
    authority: "Food & Civil Supplies",
    fee: "Free / ₹30",
    time: "15 – 30 days",
    docs: 6,
    mistakes: "Aadhaar not seeded",
  },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customServices, setCustomServices] = useState(() => getCustomServices());

  useEffect(() => {
    const refresh = () => setCustomServices(getCustomServices());
    window.addEventListener("storage", refresh);
    window.addEventListener("bf-content-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("bf-content-updated", refresh);
    };
  }, []);

  const mergedServices = [...customServices, ...services];
  const filtered = mergedServices.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.authority.toLowerCase().includes(search.toLowerCase()));

  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold mb-5"
            style={{ color: "var(--text-soft)" }}
          >
            POPULAR SERVICES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Every government service,
            <br />
            <span className="text-saffron-600">demystified.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Click any service for full details — documents, fees, mistakes to avoid, step-by-step guide.
          </p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 100+ services…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedService(s.id)}
              className="group text-left rounded-2xl border p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{s.emoji}</div>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {s.authority}
                </span>
              </div>

              <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>{s.name}</h3>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <IndianRupee className="h-3 w-3" /> Fee
                  </span>
                  <span className="font-semibold" style={{ color: "var(--text)" }}>{s.fee}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <Clock className="h-3 w-3" /> Time
                  </span>
                  <span className="font-semibold" style={{ color: "var(--text)" }}>{s.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <FileText className="h-3 w-3" /> Documents
                  </span>
                  <span className="font-semibold" style={{ color: "var(--text)" }}>{s.docs} required</span>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2">
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Common Mistake
                </div>
                <div className="text-xs text-amber-900 mt-0.5">{s.mistakes}</div>
              </div>

              <div className="mt-4 flex gap-1.5">
                <div className="flex-1 rounded-lg bg-navy-900 group-hover:bg-saffron-500 px-3 py-2 text-xs font-semibold text-white transition-colors inline-flex items-center justify-center gap-1">
                  View Full Guide <ChevronRight className="h-3 w-3" />
                </div>
                {SERVICES_DATA[s.id] && (
                  <a
                    href={SERVICES_DATA[s.id].officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border px-2 py-2 hover:bg-navy-50 transition-colors"
                    style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
                    aria-label="Official portal"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🔍</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>No services found for "{search}"</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Try a different search or browse all services</div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm"
          style={{ color: "var(--text-soft)" }}
        >
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-india-600" />
            <span>100+ services covered</span>
          </div>
          <span className="hidden sm:block" style={{ color: "var(--text-muted)" }}>·</span>
          <span>Updated weekly from official government sources</span>
        </motion.div>
      </div>

      <ServiceDetailModal serviceId={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
}
