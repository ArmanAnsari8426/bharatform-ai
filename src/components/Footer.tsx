import { Mail, MessageCircle, Send, Globe, Camera, Play } from "lucide-react";
import { useApp } from "../lib/context";

const footerLinks = {
  Services: [
    { label: "Passport", href: "#services" },
    { label: "Aadhaar", href: "#services" },
    { label: "PAN Card", href: "#services" },
    { label: "Driving License", href: "#services" },
    { label: "Voter ID", href: "#services" },
    { label: "Ration Card", href: "#services" },
  ],
  Scholarships: [
    { label: "National Scholarship Portal", href: "#scholarships" },
    { label: "PM YASASVI", href: "#scholarships" },
    { label: "Inspire Scholarship", href: "#scholarships" },
    { label: "Minority Scholarship", href: "#scholarships" },
    { label: "State Scholarships", href: "#scholarships" },
  ],
  Schemes: [
    { label: "PM Awas Yojana", href: "#schemes" },
    { label: "Ayushman Bharat", href: "#schemes" },
    { label: "PM Kisan", href: "#schemes" },
    { label: "MUDRA Yojana", href: "#schemes" },
    { label: "Sukanya Samriddhi", href: "#schemes" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
    { label: "Contact", href: "#contact" },
  ],
  Support: [
    { label: "Help Center", href: "#help" },
    { label: "API Docs", href: "#api" },
    { label: "Status", href: "#status" },
    { label: "Community", href: "#community" },
    { label: "Feedback", href: "#feedback" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "DPDP Compliance", href: "#dpdp" },
    { label: "Data Deletion", href: "#data-deletion" },
    { label: "Cookie Policy", href: "#cookies" },
  ],
};

export default function Footer() {
  const { openSignUp } = useApp();

  return (
    <footer className="bg-navy-950 text-navy-200 relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500 opacity-80" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-india-600/5 rounded-full blur-3xl" />

      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Get government updates{" "}
                <span className="text-saffron-400">in your inbox.</span>
              </h3>
              <p className="mt-2 text-navy-300 text-sm">
                Weekly digest of new schemes, scholarship deadlines & form changes. Hindi & English.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => { e.preventDefault(); openSignUp(); }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-navy-400 focus:outline-none focus:border-saffron-400 focus:bg-white/10"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-saffron-500 hover:bg-saffron-600 px-5 py-3 text-sm font-bold text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-navy-900 shadow-md">
                <ChakraMark className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-white">
                  BharatForm <span className="text-saffron-400">AI</span>
                </span>
                <span className="text-[10px] font-medium text-navy-400 tracking-wide uppercase">
                  Har Form, Ab Aasaan
                </span>
              </div>
            </a>
            <p className="text-sm text-navy-300 leading-relaxed">
              India's AI Government Assistant. Understand, prepare, and complete any government process with confidence.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {[Send, Globe, Play, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-saffron-400/50 flex items-center justify-center text-navy-300 hover:text-saffron-400 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <a href="mailto:ansariboy8426@gmail.com" className="flex items-center gap-2 text-navy-300 hover:text-saffron-400 transition-colors">
                <Mail className="h-4 w-4" /> ansariboy8426@gmail.com
              </a>
              <a href="#" className="flex items-center gap-2 text-navy-300 hover:text-saffron-400 transition-colors">
                <MessageCircle className="h-4 w-4" /> WhatsApp Support
              </a>
            </div>
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                  {title}
                </div>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-navy-300 hover:text-saffron-400 transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-navy-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 BharatForm AI. Made & Founded by Arman Ansari 🇮🇳 in Bengaluru, Delhi & Mumbai.</span>
            <a href="#admin" className="text-saffron-400 font-semibold hover:underline">Admin Console →</a>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-india-500" />
              <span>All systems operational</span>
            </div>
            <span>·</span>
            <span>SOC 2 Type II Certified</span>
            <span>·</span>
            <span>DPDP Act 2023 Compliant</span>
            <span>·</span>
            <span>Powered by Gemini 2.5 Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ChakraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + Math.cos(rad) * 4;
        const y1 = 12 + Math.sin(rad) * 4;
        const x2 = 12 + Math.cos(rad) * 8;
        const y2 = 12 + Math.sin(rad) * 8;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        );
      })}
    </svg>
  );
}
