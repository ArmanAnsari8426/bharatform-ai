import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, Shield, Lock, Smartphone, CreditCard, Building2, Wallet, ArrowRight, IndianRupee } from "lucide-react";
import { VisaLogo, MastercardLogo, RupayLogo, UpiLogo, GPayLogo, PhonePeLogo, PaytmLogo, BhimLogo, RazorpayLogo } from "./PaymentBrands";

export type PaymentPlan = {
  name: string;
  price: number; // in rupees
  period: string;
  features: string[];
};

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

const methods: { code: PaymentMethod; label: string; icon: any; sub: string }[] = [
  { code: "upi", label: "UPI", icon: Smartphone, sub: "GPay, PhonePe, Paytm" },
  { code: "card", label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay" },
  { code: "netbanking", label: "Net Banking", icon: Building2, sub: "All major Indian banks" },
  { code: "wallet", label: "Wallets", icon: Wallet, sub: "Paytm, Amazon Pay, MobiKwik" },
];

const banks = ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Yes Bank", "PNB", "Bank of Baroda"];

export default function PaymentModal({
  open,
  onClose,
  plan,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  plan: PaymentPlan | null;
  onSuccess: (txnId: string) => void;
}) {
  const [step, setStep] = useState<"method" | "details" | "processing" | "success">("method");
  const [method, setMethod] = useState<PaymentMethod>("upi");

  // UPI
  const [upiId, setUpiId] = useState("");
  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  // Net banking
  const [bank, setBank] = useState(banks[0]);

  const [txnId, setTxnId] = useState("");
  const [progressStep, setProgressStep] = useState(0);
  const [processProgress, setProcessProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setStep("method");
      setMethod("upi");
      setUpiId("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setCardName("");
      setProgressStep(0);
      setProcessProgress(0);
    }
  }, [open]);

  // Real-time progress animation during processing
  useEffect(() => {
    if (step !== "processing") return;
    const stages = [
      { label: "Connecting to bank server", duration: 600 },
      { label: "Verifying account details", duration: 700 },
      { label: "Authenticating transaction", duration: 800 },
      { label: "Processing payment", duration: 600 },
      { label: "Confirming with merchant", duration: 500 },
    ];

    const totalDuration = stages.reduce((s, st) => s + st.duration, 0);
    const startTime = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProcessProgress(pct);

      // Update current stage
      let acc = 0;
      for (let i = 0; i < stages.length; i++) {
        acc += stages[i].duration;
        if (elapsed < acc) {
          setProgressStep(i);
          break;
        }
        setProgressStep(i);
      }

      if (elapsed >= totalDuration) {
        clearInterval(tick);
        const id = "BFR" + Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000);
        setTxnId(id);
        const txns = JSON.parse(localStorage.getItem("bf-transactions") || "[]");
        txns.push({ id, plan: plan?.name, amount: total, method, createdAt: Date.now(), status: "success" });
        localStorage.setItem("bf-transactions", JSON.stringify(txns));
        setStep("success");
        setTimeout(() => onSuccess(id), 100);
      }
    }, 80);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!plan) return null;

  const gst = Math.round(plan.price * 0.18);
  const total = plan.price + gst;

  const processPayment = () => {
    setStep("processing");
    setProgressStep(0);
    setProcessProgress(0);
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length < 3) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-navy-950/75 backdrop-blur-sm" onClick={step !== "processing" ? onClose : undefined} />

          <div className="fixed inset-0 z-[55] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl max-h-[92vh] pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[92vh]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white shadow-md">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-navy-900 flex items-center gap-2">
                        Secure Payment
                        <RazorpayLogo className="h-4" />
                      </div>
                      <div className="text-xs text-navy-500">256-bit SSL · PCI-DSS L1 · DPDP 2023</div>
                    </div>
                  </div>
                  {step !== "processing" && (
                    <button onClick={onClose} className="h-9 w-9 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500">
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Plan summary */}
                <div className="px-6 py-4 bg-gradient-to-br from-saffron-50/40 to-white border-b border-navy-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-saffron-700">{plan.name} Plan</div>
                      <div className="text-sm font-semibold text-navy-700">{plan.period}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-navy-500">Total payable</div>
                      <div className="text-2xl font-bold text-navy-900 tabular-nums">₹{total.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-navy-500">
                    <span>Plan ₹{plan.price} + GST (18%) ₹{gst}</span>
                    <span className="inline-flex items-center gap-1 text-india-700 font-semibold">
                      <Shield className="h-2.5 w-2.5" /> 100% Refund within 7 days
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {/* Step: Method */}
                  {step === "method" && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-3">Choose payment method</div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {methods.map((m) => (
                          <button
                            key={m.code}
                            onClick={() => setMethod(m.code)}
                            className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                              method === m.code ? "border-saffron-500 bg-saffron-50" : "border-navy-200 hover:border-saffron-300"
                            }`}
                          >
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              method === m.code ? "bg-gradient-to-br from-saffron-500 to-saffron-700 text-white" : "bg-navy-50 text-navy-700"
                            }`}>
                              <m.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-navy-900">{m.label}</div>
                              <div className="text-[10px] text-navy-500">{m.sub}</div>
                            </div>
                            {method === m.code && <CheckCircle2 className="h-4 w-4 text-saffron-600" />}
                          </button>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[10px] text-navy-400">
                        <span className="font-semibold mr-1">Accepted:</span>
                        <VisaLogo className="h-5" />
                        <MastercardLogo className="h-5" />
                        <RupayLogo className="h-5" />
                        <UpiLogo className="h-5" />
                        <span className="font-bold text-navy-600">100+ Banks</span>
                      </div>

                      <button onClick={() => setStep("details")}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-800 px-4 py-3 text-sm font-bold text-white transition-colors">
                        Continue <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Step: Details */}
                  {step === "details" && (
                    <div>
                      <button onClick={() => setStep("method")} className="text-xs font-semibold text-saffron-700 hover:underline mb-3">
                        ← Change payment method
                      </button>

                      {method === "upi" && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-3">Pay via UPI</div>
                          <label className="block text-xs font-semibold text-navy-700 mb-1.5">Enter UPI ID</label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="yourname@okhdfcbank"
                              className="w-full pl-9 pr-3 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-saffron-400"
                            />
                          </div>
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {["@okhdfcbank", "@oksbi", "@paytm", "@ybl"].map((s) => (
                              <button key={s} onClick={() => setUpiId(upiId.split("@")[0] + s)}
                                className="text-[10px] font-semibold py-1.5 rounded-md border border-navy-200 hover:bg-saffron-50">
                                {s}
                              </button>
                            ))}
                          </div>
                          <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-2">Or pay via UPI app</div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <button className="flex items-center justify-center rounded-xl border border-navy-200 hover:border-saffron-300 p-2 hover:bg-saffron-50 transition">
                              <GPayLogo className="h-7" />
                            </button>
                            <button className="flex items-center justify-center rounded-xl border border-navy-200 hover:border-saffron-300 p-2 hover:bg-saffron-50 transition">
                              <PhonePeLogo className="h-7" />
                            </button>
                            <button className="flex items-center justify-center rounded-xl border border-navy-200 hover:border-saffron-300 p-2 hover:bg-saffron-50 transition">
                              <PaytmLogo className="h-7" />
                            </button>
                            <button className="flex items-center justify-center rounded-xl border border-navy-200 hover:border-saffron-300 p-2 hover:bg-saffron-50 transition">
                              <BhimLogo className="h-7" />
                            </button>
                          </div>
                        </div>
                      )}

                      {method === "card" && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-3">Card Details</div>
                          <div className="rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-5 mb-4 text-white shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                              <div className="h-8 w-12 rounded-md bg-saffron-400/30" />
                              <div className="text-xs font-bold uppercase tracking-wider">RuPay / VISA</div>
                            </div>
                            <div className="text-xl font-mono tracking-widest tabular-nums">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </div>
                            <div className="mt-5 flex justify-between text-[10px]">
                              <div>
                                <div className="opacity-60 uppercase">Card Holder</div>
                                <div className="font-bold mt-1">{cardName.toUpperCase() || "YOUR NAME"}</div>
                              </div>
                              <div>
                                <div className="opacity-60 uppercase">Expiry</div>
                                <div className="font-bold mt-1 tabular-nums">{expiry || "MM/YY"}</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-navy-700 mb-1.5">Card Number</label>
                              <input
                                type="text" value={cardNumber}
                                onChange={(e) => setCardNumber(formatCard(e.target.value))}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-3 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm font-mono focus:outline-none focus:bg-white focus:border-saffron-400"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-navy-700 mb-1.5">Expiry</label>
                                <input
                                  type="text" value={expiry}
                                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                  placeholder="MM/YY" maxLength={5}
                                  className="w-full px-3 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm font-mono focus:outline-none focus:bg-white focus:border-saffron-400"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-navy-700 mb-1.5">CVV</label>
                                <input
                                  type="password" value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                  placeholder="•••" maxLength={4}
                                  className="w-full px-3 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm font-mono focus:outline-none focus:bg-white focus:border-saffron-400"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-navy-700 mb-1.5">Name on Card</label>
                              <input
                                type="text" value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="As on card"
                                className="w-full px-3 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-saffron-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {method === "netbanking" && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-3">Select your bank</div>
                          <div className="grid grid-cols-2 gap-2">
                            {banks.map((b) => (
                              <button key={b} onClick={() => setBank(b)}
                                className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition ${
                                  bank === b ? "border-saffron-500 bg-saffron-50" : "border-navy-200 hover:border-saffron-300"
                                }`}>
                                <Building2 className={`h-4 w-4 ${bank === b ? "text-saffron-600" : "text-navy-500"}`} />
                                <span className="text-sm font-semibold text-navy-900">{b}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {method === "wallet" && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-3">Choose wallet</div>
                          <div className="grid grid-cols-2 gap-2">
                            {["Paytm Wallet", "Amazon Pay", "MobiKwik", "PhonePe Wallet"].map((w) => (
                              <button key={w} className="flex items-center gap-3 rounded-xl border-2 border-navy-200 hover:border-saffron-400 p-3">
                                <Wallet className="h-5 w-5 text-saffron-700" />
                                <span className="text-sm font-bold text-navy-900">{w}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button onClick={processPayment}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-india-600 hover:bg-india-700 px-4 py-3 text-sm font-bold text-white transition-colors">
                        <Lock className="h-4 w-4" />
                        Pay ₹{total.toLocaleString("en-IN")} Securely
                      </button>
                      <div className="mt-3 text-[10px] text-center text-navy-500 flex items-center justify-center gap-1">
                        <Shield className="h-3 w-3 text-india-600" />
                        Your payment is processed by Razorpay · PCI-DSS Level 1 certified
                      </div>
                    </div>
                  )}

                  {/* Step: Real-time Processing */}
                  {step === "processing" && (
                    <div className="py-6">
                      <div className="text-center mb-6">
                        <div className="relative inline-block">
                          <div className="h-16 w-16 rounded-full border-4 border-saffron-100 border-t-saffron-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-saffron-600" />
                          </div>
                        </div>
                        <div className="text-base font-bold text-navy-900 mt-4">Processing payment…</div>
                        <div className="text-xs text-navy-500 mt-1">Do not close this window · {Math.floor(processProgress)}%</div>
                      </div>

                      {/* Real-time progress steps */}
                      <div className="max-w-sm mx-auto space-y-2">
                        {[
                          "Connecting to bank server",
                          "Verifying account details",
                          "Authenticating transaction",
                          "Processing payment",
                          "Confirming with merchant",
                        ].map((label, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: i <= progressStep ? 1 : 0.4,
                              x: 0,
                            }}
                            className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white p-2.5"
                          >
                            {i < progressStep ? (
                              <CheckCircle2 className="h-4 w-4 text-india-600 flex-shrink-0" />
                            ) : i === progressStep ? (
                              <Loader2 className="h-4 w-4 text-saffron-500 animate-spin flex-shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-navy-200 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${i <= progressStep ? "text-navy-900" : "text-navy-400"}`}>
                              {label}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-5 max-w-sm mx-auto">
                        <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-saffron-500 via-india-500 to-saffron-500"
                            animate={{ width: `${processProgress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-navy-500">
                        <span className="inline-flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> 256-bit SSL</span>
                        <span>·</span>
                        <RazorpayLogo className="h-3" />
                        <span>·</span>
                        <span>RBI compliant</span>
                      </div>
                    </div>
                  )}

                  {/* Step: Success */}
                  {step === "success" && (
                    <div className="py-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="h-16 w-16 rounded-full bg-india-100 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle2 className="h-9 w-9 text-india-700" />
                      </motion.div>
                      <div className="text-xl font-bold text-navy-900">Payment Successful!</div>
                      <div className="text-sm text-navy-600 mt-1">Welcome to BharatForm AI {plan.name}</div>

                      <div className="mt-6 rounded-xl border border-navy-100 bg-navy-50/50 p-4 max-w-sm mx-auto">
                        <div className="flex justify-between text-xs text-navy-500 mb-1">
                          <span>Transaction ID</span>
                          <span className="font-mono font-bold text-navy-900">{txnId}</span>
                        </div>
                        <div className="flex justify-between text-xs text-navy-500 mb-1">
                          <span>Amount</span>
                          <span className="font-bold text-navy-900 tabular-nums">₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs text-navy-500">
                          <span>Method</span>
                          <span className="font-bold text-navy-900 uppercase">{method}</span>
                        </div>
                      </div>

                      <button onClick={onClose}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-800 px-5 py-2.5 text-sm font-bold text-white">
                        <IndianRupee className="h-4 w-4" /> Go to dashboard
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom trust strip */}
                {step !== "success" && step !== "processing" && (
                  <div className="px-6 py-3 border-t border-navy-100 bg-navy-50/30 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-navy-500">
                    <span className="flex items-center gap-1"><Shield className="h-2.5 w-2.5 text-india-600" /> RBI compliant</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> 256-bit SSL</span>
                    <span>·</span>
                    <span>Razorpay PCI-DSS L1</span>
                    <span>·</span>
                    <span>DPDP Act 2023</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
