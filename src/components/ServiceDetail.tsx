import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Clock, IndianRupee, CheckCircle2, AlertTriangle, ExternalLink, ChevronRight, Sparkles, Languages, Download } from "lucide-react";

export type ServiceDetailData = {
  id: string;
  name: string;
  emoji: string;
  authority: string;
  authorityFull: string;
  description: string;
  fee: string;
  time: string;
  validity?: string;
  officialUrl: string;
  documents: { name: string; required: boolean; note?: string }[];
  steps: { title: string; description: string; time?: string }[];
  mistakes: string[];
  faqs: { q: string; a: string }[];
  formNumber?: string;
};

export const SERVICES_DATA: Record<string, ServiceDetailData> = {
  passport: {
    id: "passport",
    name: "Passport",
    emoji: "🛂",
    authority: "MEA",
    authorityFull: "Ministry of External Affairs",
    description: "Apply for a fresh Indian passport or renew your existing one. This service handles the complete application process from form filling to dispatch.",
    fee: "₹1,500 (36 pages) / ₹2,000 (60 pages)",
    time: "30 – 45 days",
    validity: "10 years (adult) / 5 years (minor)",
    officialUrl: "https://www.passportindia.gov.in",
    formNumber: "Form No. 1-A",
    documents: [
      { name: "Aadhaar Card", required: true },
      { name: "Birth Certificate / 10th Marksheet", required: true, note: "As age proof" },
      { name: "Address Proof (Aadhaar, Utility Bill, Bank Statement)", required: true },
      { name: "Passport-size Photo (35×45mm, white background)", required: true },
      { name: "Signature Scan", required: true },
      { name: "Annexure E/F/G/H (if applicable)", required: false, note: "For specific categories" },
    ],
    steps: [
      { title: "Register on Passport Seva", description: "Create account at passportindia.gov.in with email and mobile.", time: "5 min" },
      { title: "Fill Application Form 1-A", description: "Enter personal details exactly as on Aadhaar.", time: "15 min" },
      { title: "Pay Fee Online", description: "₹1,500 for 36-page, ₹2,000 for 60-page passport.", time: "3 min" },
      { title: "Book Appointment", description: "Select your nearest Passport Seva Kendra (PSK).", time: "5 min" },
      { title: "Visit PSK", description: "Carry all original documents for verification.", time: "2-3 hours" },
      { title: "Police Verification", description: "Local police will visit your address.", time: "7-21 days" },
      { title: "Receive Passport", description: "Delivered via Speed Post to your address.", time: "7-14 days" },
    ],
    mistakes: [
      "Photo with non-white background — major rejection cause",
      "Surname mismatch between form and Aadhaar",
      "Using nickname or initials instead of full legal name",
      "Photo not meeting 35×45mm dimensions",
      "Missing or incorrect date of birth on form",
      "Not carrying original documents to PSK",
    ],
    faqs: [
      { q: "How long does it take to get a passport?", a: "Typically 30-45 days from application date, including police verification." },
      { q: "Can I apply without Aadhaar?", a: "Yes, but you'll need alternative ID proof like Voter ID, PAN, or Driving License." },
      { q: "What if my name is different on Aadhaar?", a: "Update Aadhaar first, then apply for passport to avoid rejection." },
      { q: "Is Tatkal faster?", a: "Yes, Tatkal applications are processed in 7-14 days for an additional ₹2,000." },
    ],
  },
  aadhaar: {
    id: "aadhaar",
    name: "Aadhaar",
    emoji: "🪪",
    authority: "UIDAI",
    authorityFull: "Unique Identification Authority of India",
    description: "Apply for new Aadhaar or update existing details like name, address, date of birth, mobile number, or biometric data.",
    fee: "Free (new) / ₹50 (update)",
    time: "7 – 30 days",
    validity: "Lifetime",
    officialUrl: "https://myaadhaar.uidai.gov.in",
    documents: [
      { name: "Proof of Identity (POI)", required: true },
      { name: "Proof of Address (POA)", required: true },
      { name: "Date of Birth Proof (DoB)", required: true },
      { name: "Photograph", required: true },
    ],
    steps: [
      { title: "Visit Aadhaar Center or Online", description: "Find nearest enrollment center or use myaadhaar.uidai.gov.in", time: "5 min" },
      { title: "Fill Enrolment/Update Form", description: "Provide details and select fields to update.", time: "10 min" },
      { title: "Submit Documents", description: "Provide original documents for verification.", time: "5 min" },
      { title: "Biometric Capture", description: "Photo, fingerprints, and iris scan.", time: "10 min" },
      { title: "Get Acknowledgement", required: false, description: "14-digit enrollment ID slip.", time: "1 min" } as any,
      { title: "Receive Updated Aadhaar", description: "Download from UIDAI portal or receive by post.", time: "7-30 days" },
    ] as any,
    mistakes: [
      "Uploading unclear document scans",
      "Name mismatch between documents",
      "Wrong document category selected",
      "Outdated address proof (older than 3 months)",
      "Not carrying originals to enrollment center",
    ],
    faqs: [
      { q: "Can I update Aadhaar online?", a: "Yes, for name (limited), address, mobile, email, and gender. Document upload required for address." },
      { q: "How to download Aadhaar?", a: "Visit myaadhaar.uidai.gov.in and use 'Download Aadhaar' with enrollment ID or virtual ID." },
      { q: "Is Aadhaar mandatory?", a: "Not mandatory, but required for many government services, bank accounts, and subsidies." },
    ],
  },
  pan: {
    id: "pan",
    name: "PAN Card",
    emoji: "💳",
    authority: "Income Tax",
    authorityFull: "Income Tax Department",
    description: "Apply for new PAN, correct existing details, or get a re-print. PAN is required for all financial transactions above ₹50,000.",
    fee: "₹107 (Indian address)",
    time: "15 – 20 days",
    validity: "Lifetime",
    officialUrl: "https://www.incometax.gov.in",
    documents: [
      { name: "Aadhaar Card", required: true },
      { name: "Proof of Date of Birth", required: true },
      { name: "Photograph", required: true },
      { name: "Signature Scan", required: true },
    ],
    steps: [
      { title: "Visit UTI/Protean or NSDL Portal", description: "Choose your PAN service provider.", time: "2 min" },
      { title: "Fill Form 49A", description: "Enter personal details as per Aadhaar.", time: "10 min" },
      { title: "Upload Documents", description: "Aadhaar, photo, signature in specified format.", time: "5 min" },
      { title: "Pay Fee", description: "₹107 + GST via netbanking, card, or DD.", time: "3 min" },
      { title: "Get Acknowledgement", description: "15-digit application number.", time: "1 min" },
      { title: "Receive PAN", description: "e-PAN instantly, physical card in 15-20 days.", time: "15-20 days" },
    ],
    mistakes: [
      "Name mismatch with Aadhaar",
      "Wrong father's name spelling",
      "Photo not meeting specs (JPEG, <20KB)",
      "Signature in capitals or with unclear image",
      "Not linking PAN with Aadhaar (now mandatory)",
    ],
    faqs: [
      { q: "How to link PAN with Aadhaar?", a: "Visit incometax.gov.in → Quick Links → Link Aadhaar. Free until further notice." },
      { q: "PAN not received after 30 days?", a: "Track status using acknowledgment number on UTI/NSDL portal." },
      { q: "Can I have multiple PAN?", a: "No, holding multiple PANs is illegal. Surrender duplicates." },
    ],
  },
  driving: {
    id: "driving",
    name: "Driving License",
    emoji: "🚗",
    authority: "RTO",
    authorityFull: "Regional Transport Office",
    description: "Apply for Learner's License, Permanent Driving License, or renew existing DL. Also handle vehicle registration.",
    fee: "₹200 – ₹1,000",
    time: "7 – 30 days",
    validity: "20 years or until age 50, whichever is earlier",
    officialUrl: "https://parivahan.gov.in",
    documents: [
      { name: "Learner's License", required: true },
      { name: "Address Proof (Aadhaar)", required: true },
      { name: "Age Proof (10th Marksheet)", required: true },
      { name: "Medical Certificate (Form 1A)", required: true },
      { name: "Passport-size Photos", required: true },
    ],
    steps: [
      { title: "Apply on Parivahan Portal", description: "Register at parivahan.gov.in and fill Form 4.", time: "10 min" },
      { title: "Upload Documents", description: "All proofs in scanned format.", time: "5 min" },
      { title: "Book Slot for Test", description: "Choose RTO and time for driving test.", time: "3 min" },
      { title: "Visit RTO for Test", description: "Carry original documents + LL.", time: "Half day" },
      { title: "Pass Driving Test", description: "Practical test of vehicle handling.", time: "20 min" },
      { title: "Receive DL", description: "Soft copy immediately, hard copy via post.", time: "7-15 days" },
    ],
    mistakes: [
      "Missing medical certificate (Form 1A)",
      "Wrong vehicle class selected (MCWG, LMV, etc.)",
      "Inadequate address proof",
      "Photo with red eyes or unclear face",
      "Not practicing reverse parking before test",
    ],
    faqs: [
      { q: "How to renew expired DL?", a: "Apply on Parivahan within 30 days of expiry to avoid re-test." },
      { q: "DL valid across India?", a: "Yes, Indian DL is valid in all states. Some states require intimation within 6 months of move." },
      { q: "International Driving Permit?", a: "Apply at RTO with valid DL, passport, visa, and photos." },
    ],
  },
  voter: {
    id: "voter",
    name: "Voter ID",
    emoji: "🗳️",
    authority: "ECI",
    authorityFull: "Election Commission of India",
    description: "Apply for new Voter ID (EPIC), transfer your vote to another constituency, or correct details.",
    fee: "Free",
    time: "15 – 30 days",
    validity: "Lifetime (until deletion)",
    officialUrl: "https://voters.eci.gov.in",
    documents: [
      { name: "Age Proof (any one)", required: true },
      { name: "Address Proof (any one)", required: true },
      { name: "Passport-size Photo", required: true },
    ],
    steps: [
      { title: "Visit voters.eci.gov.in", description: "Register with mobile number.", time: "3 min" },
      { title: "Fill Form 6 (New Voter)", description: "Personal details and constituency.", time: "10 min" },
      { title: "Upload Documents", description: "Age, address proof, photo.", time: "5 min" },
      { title: "Submit Application", description: "Get reference number.", time: "2 min" },
      { title: "Verification by BLO", description: "Booth Level Officer visits your address.", time: "7-14 days" },
      { title: "Receive EPIC", description: "Voter ID card delivered or available to download.", time: "15-30 days" },
    ],
    mistakes: [
      "Wrong constituency selected",
      "Address not matching with documents",
      "Photo taken with head covering (unless for religious reasons)",
      "Age proof with unclear date of birth",
    ],
    faqs: [
      { q: "Can I vote without Voter ID?", a: "Yes, if your name is in electoral roll. You can also use alternative IDs." },
      { q: "How to change address on Voter ID?", a: "Apply online using Form 8A on ECI portal." },
      { q: "Can NRIs vote?", a: "Yes, through proxy voting or at designated polling stations. Apply via Form 6A." },
    ],
  },
  income: {
    id: "income",
    name: "Income Certificate",
    emoji: "💰",
    authority: "Revenue",
    authorityFull: "State Revenue Department",
    description: "Get official certificate declaring your family income, required for scholarships, fee waivers, and ration cards.",
    fee: "₹10 – ₹50",
    time: "7 – 21 days",
    validity: "6 months – 1 year (varies by state)",
    officialUrl: "https://edistrict.gov.in",
    documents: [
      { name: "Aadhaar Card", required: true },
      { name: "Ration Card", required: true },
      { name: "Salary Slips / Income Affidavit", required: true, note: "Last 6 months" },
      { name: "Bank Statement", required: true },
      { name: "Self-declaration affidavit", required: true },
    ],
    steps: [
      { title: "Visit State e-District Portal", description: "Find your state's online revenue portal.", time: "5 min" },
      { title: "Register / DigiLocker Login", description: "Create account or use DigiLocker.", time: "5 min" },
      { title: "Fill Application", description: "Enter income from all sources.", time: "15 min" },
      { title: "Upload Documents", description: "All proofs as PDF/JPEG.", time: "10 min" },
      { title: "Pay Fee", description: "₹10-₹50 via online payment.", time: "3 min" },
      { title: "Verification by Tehsildar", description: "Revenue official verifies documents.", time: "7-21 days" },
      { title: "Download Certificate", description: "Digitally signed PDF available.", time: "1 min" },
    ],
    mistakes: [
      "Outdated salary slips (older than 6 months)",
      "Not declaring all income sources",
      "Bank statement not stamped/signed",
      "Wrong financial year mentioned",
    ],
    faqs: [
      { q: "How long is income certificate valid?", a: "Usually 6 months to 1 year depending on state." },
      { q: "For which schemes is it needed?", a: "Scholarships, fee waivers, Ration Card, SC/ST/OBC certificates, housing schemes." },
      { q: "Free or paid?", a: "Nominal fee ₹10-₹50. Free for BPL families in some states." },
    ],
  },
};

export default function ServiceDetailModal({ serviceId, onClose }: { serviceId: string | null; onClose: () => void }) {
  const data = serviceId ? SERVICES_DATA[serviceId] : null;
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "steps" | "mistakes" | "faq">("overview");

  return (
    <AnimatePresence>
      {data && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl max-h-[90vh] pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500 z-10" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-2xl shadow-md">
                      {data.emoji}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-navy-900">{data.name}</div>
                      <div className="text-xs text-navy-500">{data.authorityFull} · {data.authority}</div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-9 w-9 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-navy-100 border-b border-navy-100">
                  {[
                    { icon: IndianRupee, label: "Fee", value: data.fee },
                    { icon: Clock, label: "Time", value: data.time },
                    { icon: FileText, label: "Form", value: data.formNumber || "Online" },
                    { icon: CheckCircle2, label: "Validity", value: data.validity || "Lifetime" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white p-3">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-navy-500 mb-0.5">
                        <s.icon className="h-3 w-3" />
                        {s.label}
                      </div>
                      <div className="text-sm font-bold text-navy-900 truncate">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-navy-100 px-6 overflow-x-auto">
                  {[
                    { code: "overview", label: "Overview" },
                    { code: "documents", label: `Documents (${data.documents.length})` },
                    { code: "steps", label: `Steps (${data.steps.length})` },
                    { code: "mistakes", label: `Mistakes (${data.mistakes.length})` },
                    { code: "faq", label: `FAQ (${data.faqs.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.code}
                      onClick={() => setActiveTab(tab.code as typeof activeTab)}
                      className={`px-3 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === tab.code
                          ? "border-saffron-500 text-navy-900"
                          : "border-transparent text-navy-500 hover:text-navy-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-gradient-to-br from-saffron-50 to-white border border-saffron-100 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-saffron-600" />
                          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">About this service</span>
                        </div>
                        <p className="text-sm text-navy-700 leading-relaxed">{data.description}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-navy-100 p-4">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-2">Quick Actions</div>
                          <div className="space-y-2">
                            <button className="w-full flex items-center justify-between rounded-lg bg-navy-900 hover:bg-navy-800 px-3 py-2.5 text-sm font-semibold text-white transition-colors">
                              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-saffron-400" /> Analyze my form with AI</span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <a href={data.officialUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between rounded-lg border border-navy-200 hover:bg-navy-50 px-3 py-2.5 text-sm font-semibold text-navy-700 transition-colors">
                              <span className="flex items-center gap-2"><ExternalLink className="h-4 w-4 text-india-600" /> Official Portal</span>
                              <ChevronRight className="h-4 w-4" />
                            </a>
                            <button className="w-full flex items-center justify-between rounded-lg border border-navy-200 hover:bg-navy-50 px-3 py-2.5 text-sm font-semibold text-navy-700 transition-colors">
                              <span className="flex items-center gap-2"><Download className="h-4 w-4 text-india-600" /> Download Form PDF</span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <button className="w-full flex items-center justify-between rounded-lg border border-navy-200 hover:bg-navy-50 px-3 py-2.5 text-sm font-semibold text-navy-700 transition-colors">
                              <span className="flex items-center gap-2"><Languages className="h-4 w-4 text-india-600" /> Translate this guide</span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="rounded-xl border border-navy-100 p-4">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-2">Key Highlights</div>
                          <ul className="space-y-2 text-sm text-navy-700">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-india-600 mt-0.5 flex-shrink-0" />
                              <span>100% online application available</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-india-600 mt-0.5 flex-shrink-0" />
                              <span>DigiLocker accepted for document upload</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-india-600 mt-0.5 flex-shrink-0" />
                              <span>Track application status online</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-india-600 mt-0.5 flex-shrink-0" />
                              <span>SMS/Email notifications at every step</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="space-y-2">
                      {data.documents.map((d, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white p-4">
                          <div className="h-9 w-9 rounded-lg bg-saffron-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-saffron-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-navy-900">{d.name}</span>
                              {d.required ? (
                                <span className="text-[10px] font-bold text-red-600 uppercase">Required</span>
                              ) : (
                                <span className="text-[10px] font-bold text-navy-500 uppercase">Conditional</span>
                              )}
                            </div>
                            {d.note && <div className="text-xs text-navy-500 mt-0.5">{d.note}</div>}
                          </div>
                          <button className="text-xs font-semibold text-saffron-700 hover:underline">Check →</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "steps" && (
                    <ol className="space-y-3">
                      {data.steps.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white p-4">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="text-sm font-bold text-navy-900">{s.title}</div>
                              {s.time && <span className="text-[10px] font-bold uppercase tracking-wider text-india-700 bg-india-50 px-2 py-0.5 rounded">{s.time}</span>}
                            </div>
                            <p className="text-xs text-navy-600 mt-1">{s.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {activeTab === "mistakes" && (
                    <div className="space-y-2">
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-4">
                        <div className="text-sm font-bold text-amber-900">⚠️ These mistakes cause 70% of rejections</div>
                        <p className="text-xs text-amber-800 mt-1">Avoid these common errors to ensure your application is approved on first try.</p>
                      </div>
                      {data.mistakes.map((m, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-white p-4">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-navy-800">{m}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "faq" && (
                    <div className="space-y-3">
                      {data.faqs.map((f, i) => (
                        <details key={i} className="group rounded-xl border border-navy-100 bg-white">
                          <summary className="cursor-pointer p-4 flex items-center justify-between gap-3 text-sm font-semibold text-navy-900">
                            {f.q}
                            <ChevronRight className="h-4 w-4 text-navy-400 transition-transform group-open:rotate-90" />
                          </summary>
                          <div className="px-4 pb-4 text-sm text-navy-600 leading-relaxed">{f.a}</div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-navy-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-saffron-50/30">
                  <div className="text-xs text-navy-600">
                    Need help? Ask Bharat AI anything about this service.
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-navy-200 hover:bg-white px-4 py-2 text-sm font-semibold text-navy-700">
                      Save for later
                    </button>
                    <a
                      href={data.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 hover:bg-saffron-600 px-4 py-2 text-sm font-semibold text-white transition-colors"
                    >
                      Go to official portal <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
