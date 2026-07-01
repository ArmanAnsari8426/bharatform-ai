import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, Sparkles, Sun, Moon, Crown, LogOut, User, KeyRound, CheckCircle2 } from "lucide-react";
import { languages } from "../lib/i18n";
import { useApp } from "../lib/context";
import IndiaFlag from "./IndiaFlag";

export default function Navbar() {
  const { lang, setLang, theme, setTheme, t, session, signOut, openSignIn, openAnalysis, openApiKey, hasKey } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t.nav_features, href: "#features" },
    { label: t.nav_services, href: "#services" },
    { label: t.nav_scholarships, href: "#scholarships" },
    { label: t.nav_schemes, href: "#schemes" },
    { label: t.nav_pricing, href: "#pricing" },
    { label: t.nav_faq, href: "#faq" },
  ];

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    saffron: <Crown className="h-4 w-4" />,
  };

  return (
    <>
      {/* Top utility bar - india.gov.in style */}
      <div className="hidden md:block border-b" style={{ background: "var(--bg-soft)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-[11px]">
            <div className="flex items-center gap-4" style={{ color: "var(--text-soft)" }}>
              <div className="flex items-center gap-1.5">
                <IndiaFlag className="h-3 w-auto rounded-sm shadow-sm" />
                <span className="font-semibold">Government of India inspired</span>
              </div>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span>स्वच्छ भारत · डिजिटल इंडिया · आत्मनिर्भर भारत</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: "var(--text-soft)" }}>
              <a href="#" className="hover:text-saffron-700">Skip to main</a>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <a href="#" className="hover:text-saffron-700">Accessibility</a>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <a href="tel:14400" className="hover:text-saffron-700 font-semibold">Helpline: 14400</a>
            </div>
          </div>
        </div>
      </div>

      <div className="tricolor-line" />
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-40 w-full transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--header-bg)" : "var(--bg)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <a href="#" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-navy-900 shadow-md shadow-saffron-500/20">
                  <ChakraLogo className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-india-600 border-2 border-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
                  BharatForm <span className="text-saffron-600">AI</span>
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
                  {t.hero_tagline}
                </span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-saffron-50"
                  style={{ color: "var(--text-soft)" }}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              {/* API Key indicator */}
              <button
                onClick={openApiKey}
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  hasKey
                    ? "text-india-700 bg-india-50 hover:bg-india-100"
                    : "text-amber-700 bg-amber-50 hover:bg-amber-100 animate-pulse"
                }`}
                title={hasKey ? "Gemini API connected" : "Connect Gemini API key for real AI"}
              >
                {hasKey ? <CheckCircle2 className="h-3.5 w-3.5" /> : <KeyRound className="h-3.5 w-3.5" />}
                <span className="hidden md:inline">{hasKey ? "AI Connected" : "Connect AI"}</span>
              </button>

              {/* Language */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setLangOpen(!langOpen);
                    setThemeOpen(false);
                    setUserOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-saffron-50"
                  style={{ color: "var(--text-soft)" }}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline">{currentLang.native}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onMouseLeave={() => setLangOpen(false)}
                      className="absolute right-0 mt-2 w-52 rounded-xl border bg-white shadow-xl p-1.5 z-50"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                        Choose Language
                      </div>
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded-lg hover:bg-saffron-50 ${
                            lang === l.code ? "bg-saffron-50 text-saffron-700 font-semibold" : "text-navy-700"
                          }`}
                        >
                          <span>{l.native}</span>
                          <span className="text-xs text-navy-400">{l.english}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme */}
              <div className="relative">
                <button
                  onClick={() => {
                    setThemeOpen(!themeOpen);
                    setLangOpen(false);
                    setUserOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-saffron-50"
                  style={{ color: "var(--text-soft)" }}
                  aria-label="Theme"
                >
                  {themeIcons[theme]}
                </button>
                <AnimatePresence>
                  {themeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onMouseLeave={() => setThemeOpen(false)}
                      className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-xl p-1.5 z-50"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                        Theme
                      </div>
                      {[
                        { code: "light" as const, label: "Light", icon: Sun },
                        { code: "dark" as const, label: "Dark", icon: Moon },
                        { code: "saffron" as const, label: "Saffron", icon: Crown },
                      ].map((th) => (
                        <button
                          key={th.code}
                          onClick={() => {
                            setTheme(th.code);
                            setThemeOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg hover:bg-saffron-50 ${
                            theme === th.code ? "bg-saffron-50 text-saffron-700 font-semibold" : "text-navy-700"
                          }`}
                        >
                          <th.icon className="h-3.5 w-3.5" />
                          {th.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User / Sign in */}
              {session ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => {
                      setUserOpen(!userOpen);
                      setLangOpen(false);
                      setThemeOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-saffron-50"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white text-sm font-bold">
                      {session.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onMouseLeave={() => setUserOpen(false)}
                        className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-xl p-1.5 z-50"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                          <div className="text-sm font-semibold text-navy-900 truncate">{session.name}</div>
                          <div className="text-xs text-navy-500 truncate">{session.email}</div>
                        </div>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-navy-700 rounded-lg hover:bg-saffron-50">
                          <User className="h-3.5 w-3.5" /> Dashboard
                        </button>
                        <button
                          onClick={openApiKey}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-navy-700 rounded-lg hover:bg-saffron-50"
                        >
                          <KeyRound className="h-3.5 w-3.5" /> Manage AI Key
                        </button>
                        <button
                          onClick={() => {
                            signOut();
                            setUserOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 rounded-lg hover:bg-red-50"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={openSignIn}
                  className="hidden md:inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-saffron-50"
                  style={{ color: "var(--text-soft)" }}
                >
                  {t.nav_signin}
                </button>
              )}

              <button
                onClick={() => openAnalysis()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-800 transition-all shadow-sm hover:shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
                <span className="hidden sm:inline">{t.nav_analyze}</span>
                <span className="sm:hidden">Analyze</span>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-saffron-50"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="py-3 space-y-1">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-saffron-50"
                      style={{ color: "var(--text-soft)" }}
                    >
                      {l.label}
                    </a>
                  ))}
                  {!session && (
                    <button
                      onClick={() => {
                        openSignIn();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-saffron-50 text-saffron-700"
                    >
                      Sign In · Sign Up
                    </button>
                  )}
                  <div className="px-3 py-2 border-t my-2" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-1.5">Language</div>
                    <div className="flex flex-wrap gap-1.5">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setLang(l.code)}
                          className={`text-xs px-2.5 py-1 rounded-full border ${
                            lang === l.code
                              ? "bg-saffron-500 text-white border-saffron-500"
                              : "border-navy-200 text-navy-700"
                          }`}
                        >
                          {l.native}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

function ChakraLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
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
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
