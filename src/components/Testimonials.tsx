import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "College Student",
    city: "Jaipur, Rajasthan",
    avatar: "P",
    color: "from-saffron-400 to-saffron-600",
    text: "मुझे पता ही नहीं था कि मेरे लिए 4 scholarships available हैं। BharatForm AI ने एक ही form भरकर सब बता दिया। मुझे ₹85,000 की scholarship मिल गई!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Parent of Two",
    city: "Patna, Bihar",
    avatar: "R",
    color: "from-india-500 to-india-700",
    text: "Passport renewal के लिए agent को ₹2,000 देने वाला था। BharatForm AI ने step-by-step बताया, मैंने खुद 45 minutes में apply कर दिया। पैसे भी बचे, झंझट भी नहीं।",
    rating: 5,
  },
  {
    name: "Anita Devi",
    role: "Farmer",
    city: "Nashik, Maharashtra",
    avatar: "A",
    color: "from-navy-700 to-navy-900",
    text: "मुझे PM Kisan योजना के बारे में कोई नहीं बताता था। यहाँ से पता चला कि मैं eligible हूँ। अब हर साल ₹6,000 आता है। बहुत बड़ी मदद।",
    rating: 5,
  },
  {
    name: "Mohammed Irfan",
    role: "Job Seeker",
    city: "Hyderabad, Telangana",
    avatar: "M",
    color: "from-saffron-400 to-saffron-600",
    text: "Driving license के लिए RTO के चक्कर काटते-काटते थक गया था। BharatForm AI ने बताया कि online apply कर सकता हूँ। 10 दिन में license आ गया।",
    rating: 5,
  },
  {
    name: "Lakshmi Iyer",
    role: "Senior Citizen",
    city: "Chennai, Tamil Nadu",
    avatar: "L",
    color: "from-india-500 to-india-700",
    text: "My English is not good. But BharatForm AI explains everything in Tamil. Income certificate for my pension became so simple. My granddaughter set it up in 5 minutes.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "First-time Voter",
    city: "Ahmedabad, Gujarat",
    avatar: "A",
    color: "from-navy-700 to-navy-900",
    text: "Voter ID के लिए confused था कि कौन सा form भरूं। AI ने बिल्कुल clearly बताया, और 3 mistakes पकड़ीं जो मैं करने वाला था। Great tool!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-india-200 bg-india-50 px-3 py-1 text-xs font-semibold text-india-700 mb-5"
          >
            <Star className="h-3 w-3 fill-current" />
            CITIZEN STORIES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Real Indians.{" "}
            <span className="text-saffron-600">Real results.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            From students to farmers to senior citizens — BharatForm AI is changing how India navigates government.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl border p-6 hover:shadow-xl transition-all"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <Quote className="absolute top-5 right-5 h-7 w-7 text-saffron-100" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold shadow-md`}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate" style={{ color: "var(--text)" }}>{t.name}</div>
                  <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{t.role} · {t.city}</div>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-saffron-400 text-saffron-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed font-hindi" style={{ color: "var(--text-soft)" }}>{t.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border p-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>As featured in</div>
          {["The Hindu", "Times of India", "NDTV", "Aaj Tak", "Indian Express", "Hindustan Times"].map((o) => (
            <div key={o} className="text-lg font-serif font-bold" style={{ color: "var(--text-muted)" }}>
              {o}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
