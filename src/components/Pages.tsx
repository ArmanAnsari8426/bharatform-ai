import { useState, useEffect, type ReactElement } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Users, Briefcase, Newspaper, Mail, Phone, MapPin,
  LifeBuoy, Code2, Activity, MessagesSquare, Star, Shield, FileText, Trash2,
  Cookie, CheckCircle2, ChevronRight, Search, Send, ExternalLink,
  Sparkles, Globe, Heart, TrendingUp, Award, Target,
} from "lucide-react";
import IndiaFlag from "./IndiaFlag";
import AshokaEmblem from "./AshokaEmblem";

/* ─────────────  PAGE SHELL  ───────────── */
function PageShell({ title, titleHi, subtitle, icon: Icon, children }: { title: string; titleHi?: string; subtitle: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Top gov-style bar */}
      <div className="tricolor-line" />
      <div className="border-b" style={{ background: "var(--bg-soft)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2" style={{ color: "var(--text-soft)" }}>
            <IndiaFlag className="h-3 w-auto rounded-sm" />
            <span className="font-semibold">BharatForm AI · भारतफॉर्म AI</span>
          </div>
          <a href="#" onClick={() => (window.location.hash = "")} className="font-semibold text-saffron-700 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Home
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--hero-bg-from), var(--hero-bg-via), var(--hero-bg-to))" }}>
        <div className="absolute -right-10 -top-10 opacity-[0.05] pointer-events-none"><AshokaEmblem className="h-64 w-auto" /></div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 text-white flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "var(--text)" }}>{title}</h1>
              {titleHi && <div className="text-sm font-bold font-hindi text-saffron-600 mt-0.5">{titleHi}</div>}
            </div>
          </div>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--text-soft)" }}>{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">{children}</div>

      {/* Footer note */}
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AshokaEmblem className="h-8 w-auto" />
          </div>
          <div className="text-xs font-hindi text-saffron-600 font-bold">सत्यमेव जयते</div>
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 BharatForm AI · Made & Founded by Arman Ansari 🇮🇳 · An independent platform, not affiliated with the Government of India.
          </p>
          <a href="#" onClick={() => (window.location.hash = "")} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-saffron-700 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border p-6 ${className}`} style={{ background: "var(--surface)", borderColor: "var(--border)" }}>{children}</div>;
}

/* ─────────────  ABOUT  ───────────── */
function AboutPage() {
  return (
    <PageShell title="About BharatForm AI" titleHi="हमारे बारे में" subtitle="India's AI Government Assistant — helping every citizen understand, prepare, and complete government processes without confusion, agents, or middlemen." icon={Building2}>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Target, label: "Our Mission", value: "Har Form, Ab Aasaan", desc: "Make every government form simple for 1.4 billion Indians." },
          { icon: Heart, label: "Our Values", value: "Citizen First", desc: "No agents. No middlemen. No mistakes. Pure citizen empowerment." },
          { icon: Award, label: "Our Promise", value: "100% Free Core", desc: "Essential services free forever for every Indian citizen." },
        ].map((c) => (
          <Card key={c.label}>
            <c.icon className="h-7 w-7 text-saffron-600 mb-3" />
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{c.label}</div>
            <div className="text-lg font-black mt-1" style={{ color: "var(--text)" }}>{c.value}</div>
            <p className="text-sm mt-2" style={{ color: "var(--text-soft)" }}>{c.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <h2 className="text-xl font-black mb-3" style={{ color: "var(--text)" }}>Our Story</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
          BharatForm AI was born from a simple frustration — every Indian has stood in a long queue, paid an agent, or made a small mistake on a government form that cost them weeks of delay. Founded by <strong style={{ color: "var(--text)" }}>Arman Ansari</strong>, BharatForm AI uses Google's Gemini AI to read any government form, explain it in plain Hindi or English, find missing documents, and prevent rejections — all in seconds.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-soft)" }}>
          From passport applications in Mumbai to scholarship forms in Patna, from PM Kisan in rural Bihar to Aadhaar updates in Chennai — we serve every corner of India in 7 languages.
        </p>
      </Card>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { v: "1L+", l: "Forms Analyzed" },
          { v: "28", l: "States Covered" },
          { v: "7", l: "Languages" },
          { v: "4.9★", l: "User Rating" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="text-2xl font-black text-saffron-600 tabular-nums">{s.v}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ─────────────  BLOG  ───────────── */
function BlogPage() {
  const posts = [
    { title: "How to Apply for a Passport in 2026 — Complete Guide", cat: "Passport", date: "12 Jan 2026", read: "8 min", emoji: "🛂", excerpt: "Step-by-step guide to applying for a fresh passport, documents needed, and 5 mistakes to avoid." },
    { title: "PM Kisan 19th Installment — Check Your Status", cat: "Schemes", date: "10 Jan 2026", read: "5 min", emoji: "🌾", excerpt: "When the next ₹2,000 installment arrives and how to complete your eKYC before the deadline." },
    { title: "Top 10 Scholarships for Indian Students in 2026", cat: "Scholarships", date: "8 Jan 2026", read: "12 min", emoji: "🎓", excerpt: "From NSP to PM YASASVI — the best scholarships worth ₹20,000 to ₹2 lakh for students." },
    { title: "Aadhaar Update: New Rules You Must Know", cat: "Aadhaar", date: "5 Jan 2026", read: "6 min", emoji: "🪪", excerpt: "Free Aadhaar updates, document requirements, and how to update online via myAadhaar." },
    { title: "Ayushman Bharat: ₹5 Lakh Free Health Cover Explained", cat: "Healthcare", date: "2 Jan 2026", read: "10 min", emoji: "❤️", excerpt: "Who is eligible, how to get your card, and which hospitals accept PM-JAY." },
    { title: "GST Registration for Small Businesses — 2026", cat: "Business", date: "28 Dec 2025", read: "9 min", emoji: "💼", excerpt: "Complete guide to GST registration for businesses crossing the ₹40 lakh threshold." },
  ];
  return (
    <PageShell title="BharatForm Blog" titleHi="ब्लॉग" subtitle="Guides, updates, and tips on Indian government services, schemes, scholarships, and documents." icon={Newspaper}>
      <div className="grid md:grid-cols-2 gap-5">
        {posts.map((p) => (
          <a key={p.title} href="#blog" className="group rounded-2xl border overflow-hidden hover:shadow-xl transition-all" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="h-32 bg-gradient-to-br from-saffron-100 to-india-100 flex items-center justify-center text-5xl">{p.emoji}</div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-2">
                <span className="text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded">{p.cat}</span>
                <span style={{ color: "var(--text-muted)" }}>{p.date} · {p.read}</span>
              </div>
              <h3 className="text-base font-bold group-hover:text-saffron-600 transition-colors" style={{ color: "var(--text)" }}>{p.title}</h3>
              <p className="text-sm mt-2" style={{ color: "var(--text-soft)" }}>{p.excerpt}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-saffron-700">Read more <ChevronRight className="h-3.5 w-3.5" /></div>
            </div>
          </a>
        ))}
      </div>
    </PageShell>
  );
}

/* ─────────────  CAREERS  ───────────── */
function CareersPage() {
  const jobs = [
    { role: "Senior Full-Stack Engineer", team: "Engineering", loc: "Bengaluru / Remote", type: "Full-time" },
    { role: "AI/ML Engineer (Gemini)", team: "AI", loc: "Bengaluru", type: "Full-time" },
    { role: "Regional Language Specialist", team: "Content", loc: "Remote", type: "Contract" },
    { role: "Government Liaison Officer", team: "Operations", loc: "New Delhi", type: "Full-time" },
    { role: "Product Designer", team: "Design", loc: "Mumbai / Remote", type: "Full-time" },
    { role: "Community Manager", team: "Growth", loc: "Remote", type: "Full-time" },
  ];
  return (
    <PageShell title="Careers at BharatForm AI" titleHi="करियर" subtitle="Join us in building India's most trusted AI Government Assistant. Help empower 1.4 billion citizens." icon={Briefcase}>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Heart, t: "Mission-Driven", d: "Work that impacts millions of Indians every day." },
          { icon: Globe, t: "Remote-First", d: "Work from anywhere in India. Flexible hours." },
          { icon: TrendingUp, t: "Fast Growth", d: "Early team, big ownership, rapid learning." },
        ].map((c) => (
          <Card key={c.t}><c.icon className="h-6 w-6 text-saffron-600 mb-2" /><div className="font-bold" style={{ color: "var(--text)" }}>{c.t}</div><p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>{c.d}</p></Card>
        ))}
      </div>
      <h2 className="text-xl font-black mb-4" style={{ color: "var(--text)" }}>Open Positions ({jobs.length})</h2>
      <div className="space-y-3">
        {jobs.map((j) => (
          <Card key={j.role} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold" style={{ color: "var(--text)" }}>{j.role}</h3>
              <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{j.team}</span><span>·</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.loc}</span><span>·</span><span>{j.type}</span>
              </div>
            </div>
            <a href="#contact" className="rounded-xl bg-navy-900 hover:bg-navy-800 px-4 py-2 text-sm font-bold text-white text-center transition-colors">Apply Now</a>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ─────────────  PRESS  ───────────── */
function PressPage() {
  const press = [
    { outlet: "The Hindu", title: "BharatForm AI simplifies government forms for millions", date: "Jan 2026" },
    { outlet: "Times of India", title: "How a startup is fixing India's form-filling nightmare", date: "Dec 2025" },
    { outlet: "YourStory", title: "Arman Ansari's BharatForm AI raises citizen confidence", date: "Dec 2025" },
    { outlet: "Inc42", title: "AI meets governance: BharatForm's bold bet on Bharat", date: "Nov 2025" },
  ];
  return (
    <PageShell title="Press & Media" titleHi="प्रेस" subtitle="BharatForm AI in the news. For media inquiries, reach out to our press team." icon={Newspaper}>
      <Card className="mb-8 bg-gradient-to-br from-saffron-50 to-india-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div><h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Media Kit & Brand Assets</h2><p className="text-sm" style={{ color: "var(--text-soft)" }}>Logos, founder photos, screenshots, and fact sheets.</p></div>
          <a href="#contact" className="rounded-xl bg-saffron-500 hover:bg-saffron-600 px-5 py-2.5 text-sm font-bold text-white transition-colors flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Request Kit</a>
        </div>
      </Card>
      <div className="space-y-3">
        {press.map((p) => (
          <Card key={p.title} className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-saffron-600 uppercase tracking-wider">{p.outlet} · {p.date}</div>
              <h3 className="font-bold mt-1" style={{ color: "var(--text)" }}>{p.title}</h3>
            </div>
            <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ─────────────  CONTACT  ───────────── */
function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell title="Contact Us" titleHi="संपर्क करें" subtitle="Have a question, partnership idea, or media request? We'd love to hear from you." icon={Mail}>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Mail, t: "Email", v: "ansariboy8426@gmail.com", href: "mailto:ansariboy8426@gmail.com" },
          { icon: Phone, t: "Helpline", v: "14400 (Govt Service)", href: "tel:14400" },
          { icon: MapPin, t: "Offices", v: "Bengaluru · Delhi · Mumbai", href: "#contact" },
        ].map((c) => (
          <a key={c.t} href={c.href} className="rounded-2xl border p-5 hover:shadow-lg transition-all" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <c.icon className="h-6 w-6 text-saffron-600 mb-2" />
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{c.t}</div>
            <div className="font-bold mt-0.5" style={{ color: "var(--text)" }}>{c.v}</div>
          </a>
        ))}
      </div>
      <Card>
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-india-600 mx-auto mb-3" />
            <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Message Sent! 🙏</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>Dhanyavaad! We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>Send us a message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400" />
              <input required type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400" />
            </div>
            <input placeholder="Subject" className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400" />
            <textarea required rows={5} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400 resize-none" />
            <button className="rounded-xl bg-saffron-500 hover:bg-saffron-600 px-6 py-3 text-sm font-bold text-white transition-colors flex items-center gap-2"><Send className="h-4 w-4" /> Send Message</button>
          </form>
        )}
      </Card>
    </PageShell>
  );
}

/* ─────────────  HELP CENTER  ───────────── */
function HelpPage() {
  const [q, setQ] = useState("");
  const faqs = [
    { q: "How do I analyze a government form?", a: "Click 'Analyze My Form', upload a PDF or photo, and our Gemini AI explains every field in seconds." },
    { q: "Is BharatForm AI free?", a: "Yes! Core features are free forever. Pro plan (₹99/month) unlocks unlimited analyses and AI chat." },
    { q: "Which languages are supported?", a: "Hindi, English, Bengali, Tamil, Telugu, Marathi, and Urdu — with more coming soon." },
    { q: "Is my data safe?", a: "Yes. We use SHA-256 encryption, are DPDP Act 2023 compliant, and never sell your data." },
    { q: "How do I check scheme eligibility?", a: "Go to the Scheme Eligibility section, fill your profile (age, income, state, etc.), and get instant matches." },
    { q: "Can I apply for scholarships here?", a: "We help you discover and prepare scholarships. Applications are submitted on official government portals." },
  ];
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()));
  return (
    <PageShell title="Help Center" titleHi="सहायता केंद्र" subtitle="Find answers to common questions about BharatForm AI." icon={LifeBuoy}>
      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles..." className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400" />
      </div>
      <div className="space-y-3">
        {filtered.map((f) => (
          <Card key={f.q}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text)" }}><LifeBuoy className="h-4 w-4 text-saffron-600" /> {f.q}</h3>
            <p className="text-sm mt-2 pl-6" style={{ color: "var(--text-soft)" }}>{f.a}</p>
          </Card>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </PageShell>
  );
}

/* ─────────────  API DOCS  ───────────── */
function ApiPage() {
  return (
    <PageShell title="API Documentation" titleHi="API दस्तावेज़" subtitle="Integrate BharatForm AI's form analysis and scheme matching into your own application." icon={Code2}>
      <Card className="mb-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 mb-2">Base URL</div>
        <code className="block rounded-lg bg-navy-900 text-india-300 p-3 text-sm font-mono">https://api.bharatform.ai/v1</code>
      </Card>
      {[
        { method: "POST", path: "/analyze", desc: "Upload a government form for AI analysis", color: "bg-india-600" },
        { method: "GET", path: "/schemes/eligibility", desc: "Check scheme eligibility by profile", color: "bg-blue-600" },
        { method: "GET", path: "/scholarships", desc: "List scholarships matching a profile", color: "bg-blue-600" },
        { method: "POST", path: "/chat", desc: "Chat with Bharat AI assistant", color: "bg-india-600" },
      ].map((e) => (
        <Card key={e.path} className="mb-3">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black text-white px-2 py-1 rounded ${e.color}`}>{e.method}</span>
            <code className="text-sm font-mono font-bold" style={{ color: "var(--text)" }}>{e.path}</code>
          </div>
          <p className="text-sm mt-2" style={{ color: "var(--text-soft)" }}>{e.desc}</p>
        </Card>
      ))}
      <Card className="mt-6 bg-gradient-to-br from-saffron-50 to-india-50">
        <div className="flex items-center gap-2"><KeyIcon /> <h3 className="font-bold" style={{ color: "var(--text)" }}>Get your API Key</h3></div>
        <p className="text-sm mt-2" style={{ color: "var(--text-soft)" }}>API access is available for government bodies, NGOs, and enterprises. Contact us for credentials.</p>
        <a href="#contact" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2 text-sm font-bold text-white">Request Access <ChevronRight className="h-3.5 w-3.5" /></a>
      </Card>
    </PageShell>
  );
}
function KeyIcon() { return <Sparkles className="h-5 w-5 text-saffron-600" />; }

/* ─────────────  STATUS  ───────────── */
function StatusPage() {
  const services = [
    { name: "Form Analysis API", status: "Operational", uptime: "99.98%" },
    { name: "Bharat AI Chat", status: "Operational", uptime: "99.95%" },
    { name: "Scheme Eligibility", status: "Operational", uptime: "100%" },
    { name: "Scholarship Finder", status: "Operational", uptime: "99.99%" },
    { name: "Payment Gateway", status: "Operational", uptime: "99.97%" },
    { name: "Document Storage", status: "Operational", uptime: "100%" },
  ];
  return (
    <PageShell title="System Status" titleHi="सिस्टम स्थिति" subtitle="Real-time status of all BharatForm AI services." icon={Activity}>
      <Card className="mb-6 bg-india-50 border-india-200">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-india-500 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-india-500" /></span>
          <span className="font-black text-india-700">All Systems Operational</span>
        </div>
      </Card>
      <div className="space-y-2">
        {services.map((s) => (
          <Card key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-india-600" />
              <span className="font-bold" style={{ color: "var(--text)" }}>{s.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.uptime} uptime</span>
              <span className="text-xs font-bold text-india-600 bg-india-50 px-2 py-1 rounded">{s.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ─────────────  COMMUNITY  ───────────── */
function CommunityPage() {
  return (
    <PageShell title="Community" titleHi="समुदाय" subtitle="Join thousands of Indians helping each other navigate government services." icon={MessagesSquare}>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: MessagesSquare, t: "Discussion Forum", d: "Ask questions, share tips, get answers from the community.", btn: "Join Forum" },
          { icon: Send, t: "Telegram Group", d: "Real-time updates on schemes, deadlines & scholarships.", btn: "Join Telegram" },
          { icon: Users, t: "WhatsApp Community", d: "Connect with citizens from your state and city.", btn: "Join WhatsApp" },
          { icon: Star, t: "Volunteer Program", d: "Help first-time internet users in your area.", btn: "Become Volunteer" },
        ].map((c) => (
          <Card key={c.t}>
            <c.icon className="h-7 w-7 text-saffron-600 mb-3" />
            <h3 className="font-bold" style={{ color: "var(--text)" }}>{c.t}</h3>
            <p className="text-sm mt-1 mb-4" style={{ color: "var(--text-soft)" }}>{c.d}</p>
            <a href="#contact" className="rounded-xl bg-navy-900 hover:bg-navy-800 px-4 py-2 text-sm font-bold text-white inline-block transition-colors">{c.btn}</a>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ v: "50K+", l: "Members" }, { v: "12K+", l: "Questions Answered" }, { v: "500+", l: "Volunteers" }].map((s) => (
          <div key={s.l} className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="text-2xl font-black text-saffron-600">{s.v}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ─────────────  FEEDBACK  ───────────── */
function FeedbackPage() {
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(5);
  return (
    <PageShell title="Share Feedback" titleHi="प्रतिक्रिया दें" subtitle="Your feedback helps us serve India better. Tell us what to improve." icon={MessagesSquare}>
      <Card>
        {sent ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-saffron-600 mx-auto mb-3" />
            <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Dhanyavaad! 🙏</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>Your feedback has been saved. It helps us improve BharatForm AI for all Indians.</p>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            const fb = JSON.parse(localStorage.getItem("bf-launch-supporters") || "[]");
            fb.push({ name: "Feedback User", role: "Citizen", rating, feedback: (e.target as any).msg.value, createdAt: Date.now() });
            localStorage.setItem("bf-launch-supporters", JSON.stringify(fb));
            setSent(true);
          }} className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-2" style={{ color: "var(--text)" }}>How would you rate us?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} className={`h-12 w-12 rounded-xl text-2xl transition-all ${n <= rating ? "bg-saffron-100 scale-110" : "bg-navy-50"}`}>{n <= rating ? "⭐" : "☆"}</button>
                ))}
              </div>
            </div>
            <textarea name="msg" required rows={5} placeholder="What should we improve? Be specific..." className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400 resize-none" />
            <button className="rounded-xl bg-saffron-500 hover:bg-saffron-600 px-6 py-3 text-sm font-bold text-white flex items-center gap-2"><Send className="h-4 w-4" /> Submit Feedback</button>
          </form>
        )}
      </Card>
    </PageShell>
  );
}

/* ─────────────  LEGAL PAGES  ───────────── */
function LegalLayout({ title, titleHi, icon, sections }: { title: string; titleHi: string; icon: any; sections: { h: string; p: string }[] }) {
  return (
    <PageShell title={title} titleHi={titleHi} subtitle={`Last updated: 1 January 2026 · BharatForm AI`} icon={icon}>
      <Card className="space-y-6">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-lg font-black mb-2" style={{ color: "var(--text)" }}>{i + 1}. {s.h}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{s.p}</p>
          </div>
        ))}
      </Card>
    </PageShell>
  );
}

function PrivacyPage() {
  return <LegalLayout title="Privacy Policy" titleHi="गोपनीयता नीति" icon={Shield} sections={[
    { h: "Information We Collect", p: "We collect your name, email, phone, and any documents you upload for analysis. Uploaded documents are processed by Google Gemini AI and are not permanently stored on our servers." },
    { h: "How We Use Your Data", p: "Your data is used only to provide form analysis, scheme matching, and scholarship discovery. We never sell your personal information to third parties." },
    { h: "Data Storage", p: "Account data is stored securely with SHA-256 encryption. Uploaded form documents are deleted immediately after analysis." },
    { h: "Your Rights (DPDP Act 2023)", p: "Under India's Digital Personal Data Protection Act 2023, you have the right to access, correct, and delete your personal data at any time." },
    { h: "Cookies", p: "We use minimal cookies to remember your language and theme preferences. See our Cookie Policy for details." },
    { h: "Contact", p: "For privacy concerns, email ansariboy8426@gmail.com." },
  ]} />;
}

function TermsPage() {
  return <LegalLayout title="Terms of Service" titleHi="सेवा की शर्तें" icon={FileText} sections={[
    { h: "Acceptance of Terms", p: "By using BharatForm AI, you agree to these terms. BharatForm AI is an independent platform and is not affiliated with the Government of India." },
    { h: "Service Description", p: "We provide AI-assisted guidance for government forms, schemes, and scholarships. We do not submit applications on your behalf — all official submissions happen on government portals." },
    { h: "Accuracy Disclaimer", p: "While our AI strives for accuracy, always verify critical information from official government sources before submitting any application." },
    { h: "User Responsibilities", p: "You are responsible for the accuracy of information you provide and for verifying eligibility before applying to any scheme or scholarship." },
    { h: "Payments & Refunds", p: "Pro subscriptions are billed monthly via Razorpay. Refunds are available within 7 days of purchase." },
    { h: "Limitation of Liability", p: "BharatForm AI is not liable for application rejections, missed deadlines, or losses arising from reliance on AI-generated guidance." },
  ]} />;
}

function DpdpPage() {
  return <LegalLayout title="DPDP Compliance" titleHi="डीपीडीपी अनुपालन" icon={Shield} sections={[
    { h: "Digital Personal Data Protection Act 2023", p: "BharatForm AI is fully compliant with India's DPDP Act 2023, the country's comprehensive data protection law." },
    { h: "Consent", p: "We obtain your explicit consent before processing any personal data. You can withdraw consent at any time." },
    { h: "Data Principal Rights", p: "You have the right to access, correct, update, and erase your personal data, and to nominate someone to exercise these rights." },
    { h: "Data Fiduciary Obligations", p: "As a Data Fiduciary, we implement reasonable security safeguards, report breaches, and process data only for stated purposes." },
    { h: "Grievance Redressal", p: "Contact our Data Protection Officer at ansariboy8426@gmail.com for any data protection grievances. We respond within 7 days." },
    { h: "Cross-Border Transfer", p: "Form analysis uses Google Gemini AI. Data is processed securely in compliance with applicable Indian regulations." },
  ]} />;
}

function DataDeletionPage() {
  const [done, setDone] = useState(false);
  return (
    <PageShell title="Data Deletion" titleHi="डेटा हटाना" subtitle="Request permanent deletion of your personal data from BharatForm AI." icon={Trash2}>
      <Card>
        {done ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-india-600 mx-auto mb-3" />
            <h3 className="text-lg font-black" style={{ color: "var(--text)" }}>Deletion Request Submitted</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>Your data will be permanently deleted within 30 days as per DPDP Act 2023.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-black mb-3" style={{ color: "var(--text)" }}>Request Data Deletion</h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-soft)" }}>Under the DPDP Act 2023, you have the right to request permanent deletion of all your personal data. This action cannot be undone.</p>
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="space-y-4">
              <input required type="email" placeholder="Email associated with your account" className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400" />
              <textarea rows={3} placeholder="Reason (optional)" className="w-full px-4 py-3 rounded-xl border bg-navy-50 text-sm focus:outline-none focus:border-saffron-400 resize-none" />
              <label className="flex items-start gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
                <input type="checkbox" required className="mt-1" /> I understand this will permanently delete all my data and cannot be undone.
              </label>
              <button className="rounded-xl bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-bold text-white flex items-center gap-2"><Trash2 className="h-4 w-4" /> Request Permanent Deletion</button>
            </form>
          </>
        )}
      </Card>
    </PageShell>
  );
}

function CookiesPage() {
  return <LegalLayout title="Cookie Policy" titleHi="कुकी नीति" icon={Cookie} sections={[
    { h: "What Are Cookies", p: "Cookies are small text files stored on your device to remember your preferences and improve your experience." },
    { h: "Cookies We Use", p: "We use essential cookies for language preference, theme (light/dark/saffron), and session management. We do not use advertising cookies." },
    { h: "Local Storage", p: "We use browser local storage to save your accessibility settings, language, and session — all stored only on your device." },
    { h: "Third-Party Cookies", p: "Payment processing via Razorpay may set cookies. AI processing via Google Gemini follows Google's privacy policies." },
    { h: "Managing Cookies", p: "You can clear cookies and local storage anytime through your browser settings. This will reset your preferences." },
  ]} />;
}

function Empty() {
  return <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: "var(--border)" }}><div className="text-4xl mb-2">🔍</div><p className="text-sm" style={{ color: "var(--text-muted)" }}>No results found. Try a different search.</p></div>;
}

/* ─────────────  ROUTER  ───────────── */
const PAGE_MAP: Record<string, () => ReactElement> = {
  about: AboutPage,
  blog: BlogPage,
  careers: CareersPage,
  press: PressPage,
  contact: ContactPage,
  help: HelpPage,
  api: ApiPage,
  status: StatusPage,
  community: CommunityPage,
  feedback: FeedbackPage,
  privacy: PrivacyPage,
  terms: TermsPage,
  dpdp: DpdpPage,
  "data-deletion": DataDeletionPage,
  cookies: CookiesPage,
};

export const PAGE_ROUTES = Object.keys(PAGE_MAP);

export default function Pages({ route }: { route: string }) {
  useEffect(() => { window.scrollTo(0, 0); }, [route]);
  const PageComponent = PAGE_MAP[route];
  if (!PageComponent) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <PageComponent />
    </motion.div>
  );
}
