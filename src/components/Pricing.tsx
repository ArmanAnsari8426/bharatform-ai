import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, X, Shield } from "lucide-react";
import { useApp } from "../lib/context";
import PaymentModal, { type PaymentPlan } from "./PaymentModal";

const plans = [
  {
    name: "Free",
    nameHi: "मुफ्त",
    tagline: "Try it forever",
    price: "₹0",
    period: "forever",
    desc: "For first-time citizens exploring government services.",
    features: [
      { text: "5 Form Analyses/month", included: true },
      { text: "Hindi + English AI", included: true },
      { text: "Basic Document Checklist", included: true },
      { text: "Document Readiness Checker", included: false },
      { text: "Scholarship Finder", included: false },
      { text: "Unlimited AI Chat", included: false },
      { text: "Rejection Prevention", included: false },
      { text: "Priority Processing", included: false },
    ],
    cta: "Start Free",
    ctaStyle: "outline",
    badge: null,
    icon: Zap,
  },
  {
    name: "Pro",
    nameHi: "प्रो",
    tagline: "For active citizens",
    price: "₹99",
    period: "/month",
    desc: "Everything you need to handle any government process with confidence.",
    features: [
      { text: "Unlimited Form Analyses", included: true },
      { text: "All 7 Languages", included: true },
      { text: "Document Readiness Checker", included: true },
      { text: "Scholarship Finder", included: true },
      { text: "Scheme Eligibility Checker", included: true },
      { text: "Unlimited Bharat AI Chat", included: true },
      { text: "Rejection Prevention", included: true },
      { text: "Priority Processing", included: true },
    ],
    cta: "Start Pro Trial",
    ctaStyle: "primary",
    badge: "Most Popular",
    icon: Sparkles,
  },
  {
    name: "Family",
    nameHi: "परिवार",
    tagline: "For whole families",
    price: "₹199",
    period: "/month",
    desc: "Cover up to 5 family members. One subscription, full household.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Up to 5 family members", included: true },
      { text: "Shared document vault", included: true },
      { text: "Family deadline tracker", included: true },
      { text: "Phone + Email support", included: true },
      { text: "Dedicated family advisor", included: true },
      { text: "Tax filing assistance", included: true },
      { text: "Scheme auto-matching", included: true },
    ],
    cta: "Start Family Plan",
    ctaStyle: "outline",
    badge: "Best Value",
    icon: Crown,
  },
];

export default function Pricing() {
  const { openSignIn, session, showToast } = useApp();
  const [payOpen, setPayOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const startPayment = (planName: string, price: number, period: string, features: string[]) => {
    if (!session) {
      showToast("info", "Please sign in to subscribe");
      openSignIn();
      return;
    }
    if (price === 0) {
      showToast("success", "Free plan activated! Start using BharatForm AI now.");
      return;
    }
    setSelectedPlan({ name: planName, price, period, features });
    setPayOpen(true);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700 mb-5"
          >
            PRICING
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Simple pricing.{" "}
            <span className="text-saffron-600">Free for everyone.</span>
          </motion.h2>
          <p className="mt-4 text-lg" style={{ color: "var(--text-soft)" }}>
            Start free. Upgrade only when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {plans.map((p, i) => {
            const isFeatured = p.badge === "Most Popular";
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-7 transition-all ${
                  isFeatured ? "scale-[1.02]" : ""
                }`}
                style={
                  isFeatured
                    ? { background: "linear-gradient(135deg, #0F172A, #1E293B)", border: "2px solid rgba(255,153,51,0.5)", color: "white", boxShadow: "0 25px 50px -12px rgba(15,23,42,0.5)" }
                    : { background: "var(--surface)", border: "1px solid var(--border)" }
                }
              >
                {p.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                    isFeatured ? "bg-saffron-500 text-white" : "bg-india-600 text-white"
                  }`}>
                    <Sparkles className="h-2.5 w-2.5" />
                    {p.badge}
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                    isFeatured ? "bg-saffron-500/20 text-saffron-300" : "bg-saffron-50 text-saffron-600"
                  }`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${isFeatured ? "text-saffron-300" : ""}`} style={!isFeatured ? { color: "var(--text-muted)" } : {}}>
                    {p.tagline}
                  </div>
                </div>

                <h3 className={`text-2xl font-bold ${isFeatured ? "text-white" : ""}`} style={!isFeatured ? { color: "var(--text)" } : {}}>
                  {p.name}
                </h3>
                <div className={`text-xs font-semibold font-hindi mt-0.5 ${isFeatured ? "text-navy-300" : ""}`} style={!isFeatured ? { color: "var(--text-muted)" } : {}}>
                  {p.nameHi}
                </div>
                <p className={`mt-2 text-sm ${isFeatured ? "text-navy-200" : ""}`} style={!isFeatured ? { color: "var(--text-soft)" } : {}}>
                  {p.desc}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-5xl font-bold tabular-nums ${isFeatured ? "text-white" : ""}`} style={!isFeatured ? { color: "var(--text)" } : {}}>
                    {p.price}
                  </span>
                  <span className={`text-sm font-medium ${isFeatured ? "text-navy-300" : ""}`} style={!isFeatured ? { color: "var(--text-muted)" } : {}}>
                    {p.period}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const numericPrice = parseInt(p.price.replace(/[^\d]/g, ""), 10) || 0;
                    startPayment(p.name, numericPrice, p.period, p.features.filter(f => f.included).map(f => f.text));
                  }}
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all inline-flex items-center justify-center gap-1.5 ${
                    p.ctaStyle === "primary"
                      ? "bg-saffron-500 hover:bg-saffron-600 text-white shadow-lg"
                      : isFeatured
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      : "bg-navy-900 hover:bg-navy-800 text-white"
                  }`}
                >
                  {parseInt(p.price.replace(/[^\d]/g, ""), 10) > 0 && <Shield className="h-3.5 w-3.5" />}
                  {p.cta}
                </button>

                <div className={`mt-6 pt-6 border-t ${isFeatured ? "border-white/10" : ""}`} style={!isFeatured ? { borderColor: "var(--border)" } : {}}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${isFeatured ? "text-navy-300" : ""}`} style={!isFeatured ? { color: "var(--text-muted)" } : {}}>
                    What's included
                  </div>
                  <ul className="space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2 text-sm">
                        {f.included ? (
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isFeatured ? "bg-india-500/30 text-india-300" : "bg-india-100 text-india-700"
                          }`}>
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isFeatured ? "bg-white/5 text-navy-500" : "bg-navy-100 text-navy-400"
                          }`} style={!isFeatured ? { background: "var(--bg-muted)", color: "var(--text-muted)" } : {}}>
                            <X className="h-2.5 w-2.5" strokeWidth={3} />
                          </div>
                        )}
                        <span className={f.included ? (isFeatured ? "text-navy-100" : "") : (isFeatured ? "text-navy-500" : "")} style={!isFeatured ? { color: f.included ? "var(--text)" : "var(--text-muted)" } : {}}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          All plans include 🇮🇳 made-for-India features. Pay with UPI, cards, netbanking, or wallets via Razorpay.
        </motion.p>
      </div>

      <PaymentModal
        open={payOpen}
        plan={selectedPlan}
        onClose={() => setPayOpen(false)}
        onSuccess={(txn) => {
          setPayOpen(false);
          showToast("success", `Subscription active! Transaction: ${txn}`);
        }}
      />
    </section>
  );
}
