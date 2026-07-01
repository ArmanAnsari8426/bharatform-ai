import { motion } from "framer-motion";
import { Phone, Shield, UserRound, Baby, Truck, Flame, HeartPulse, Info, MessageSquareText, ExternalLink } from "lucide-react";

const helplines = [
  {
    number: "112",
    label: "National Emergency",
    labelHi: "राष्ट्रीय आपातकालीन",
    desc: "Single emergency number for all services",
    color: "bg-red-600",
    icon: Shield,
  },
  {
    number: "100",
    label: "Police",
    labelHi: "पुलिस",
    desc: "Emergency police assistance",
    color: "bg-navy-900",
    icon: Shield,
  },
  {
    number: "1091",
    label: "Women Helpline",
    labelHi: "महिला हेल्पलाइन",
    desc: "Emergency assistance for women",
    color: "bg-saffron-600",
    icon: UserRound,
  },
  {
    number: "1098",
    label: "Child Helpline",
    labelHi: "चाइल्ड हेल्पलाइन",
    desc: "For children in need of care and protection",
    color: "bg-india-600",
    icon: Baby,
  },
  {
    number: "102",
    label: "Ambulance",
    labelHi: "एम्बुलेंस",
    desc: "Emergency medical transport",
    color: "bg-red-500",
    icon: Truck,
  },
  {
    number: "101",
    label: "Fire",
    labelHi: "दमकल विभाग",
    desc: "Emergency fire services",
    color: "bg-orange-600",
    icon: Flame,
  },
  {
    number: "181",
    label: "Women in Distress",
    labelHi: "संकट में महिलाएं",
    desc: "24/7 help for women across India",
    color: "bg-pink-600",
    icon: HeartPulse,
  },
  {
    number: "1075",
    label: "Health Helpline",
    labelHi: "स्वास्थ्य हेल्पलाइन",
    desc: "National health & COVID-19 assistance",
    color: "bg-teal-600",
    icon: HeartPulse,
  },
];

export default function EmergencyHelplines() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--bg-soft)" }}>
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 mb-5"
          >
            <Phone className="h-3 w-3" />
            24/7 NATIONAL EMERGENCY HELPLINES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Help is just a{" "}
            <span className="text-red-600">call away.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Keep these essential numbers handy. Accessible from any mobile or landline across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((h, i) => (
            <motion.a
              key={h.number}
              href={`tel:${h.number}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl border p-5 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${h.color} text-white flex items-center justify-center shadow-lg shadow-black/10`}>
                  <h.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-black tabular-nums" style={{ color: "var(--text)" }}>
                  {h.number}
                </div>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>{h.label}</h3>
              <div className="text-xs font-hindi font-bold mt-0.5" style={{ color: "var(--text-muted)" }}>{h.labelHi}</div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{h.desc}</p>
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Call Now</span>
                <Phone className="h-3.5 w-3.5 text-red-500 group-hover:animate-bounce" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* State Specific & Cyber Cell */}
        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow-lg)" }}
          >
            <div className="h-16 w-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center flex-shrink-0 shadow-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold" style={{ color: "var(--text)" }}>Cyber Crime Reporting</h4>
              <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>Report financial frauds or cyber harassment immediately.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="tel:1930" className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800 transition-colors">
                  <Phone className="h-4 w-4" /> Call 1930
                </a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-navy-50 transition-colors">
                  <ExternalLink className="h-4 w-4" /> Portal
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow-lg)" }}
          >
            <div className="h-16 w-16 rounded-2xl bg-saffron-500 text-white flex items-center justify-center flex-shrink-0 shadow-xl">
              <MessageSquareText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold" style={{ color: "var(--text)" }}>Anti-Ragging Helpline</h4>
              <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>Safe and anonymous reporting for students in universities.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="tel:18001805522" className="inline-flex items-center gap-2 rounded-lg bg-saffron-500 px-4 py-2 text-sm font-bold text-white hover:bg-saffron-600 transition-colors">
                  <Phone className="h-4 w-4" /> 1800-180-5522
                </a>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-navy-500 uppercase tracking-wider">
                  <Info className="h-3.5 w-3.5 text-saffron-600" />
                  Available 24/7
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
