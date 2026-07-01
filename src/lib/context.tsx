import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations, type Lang, type Theme } from "./i18n";
import { getSession, signOut as authSignOut, type Session } from "./auth";
import { initSupabaseSessionSync } from "./supabaseAuth";
import { getSupabase } from "./supabase";
import { hasApiKey } from "./gemini";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: typeof translations.en;

  session: Session | null;
  setSession: (s: Session | null) => void;
  signOut: () => void;

  // Modal states
  signInOpen: boolean;
  signUpOpen: boolean;
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuth: () => void;
  switchAuth: () => void;

  analysisOpen: boolean;
  openAnalysis: (file?: File) => void;
  closeAnalysis: () => void;
  pendingFile: File | null;
  clearPendingFile: () => void;

  apiKeyOpen: boolean;
  openApiKey: () => void;
  closeApiKey: () => void;
  hasKey: boolean;
  refreshKey: () => void;

  // Toast
  toast: { type: "success" | "error" | "info"; message: string } | null;
  showToast: (type: "success" | "error" | "info", message: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "hi";
    return (localStorage.getItem("bf-lang") as Lang) || "hi";
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("bf-theme") as Theme) || "light";
  });
  const [session, setSessionState] = useState<Session | null>(() => getSession());

  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [hasKey, setHasKey] = useState(() => hasApiKey());
  const [toast, setToast] = useState<Ctx["toast"]>(null);

  useEffect(() => {
    localStorage.setItem("bf-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("bf-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Sync real backend (Supabase) auth session — handles OAuth return, refresh, sign-out
  useEffect(() => {
    const unsubscribe = initSupabaseSessionSync((s) => setSessionState(s));
    return unsubscribe;
  }, []);

  // REAL-TIME: Sync admin data (users, feedback, transactions) automatically
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    const triggerRefresh = () => window.dispatchEvent(new Event("bf-db-updated"));

    // Listen to new user registrations
    const usersChannel = sb
      .channel("public:profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, triggerRefresh)
      .subscribe();

    // Listen to new feedback
    const feedbackChannel = sb
      .channel("public:feedback")
      .on("postgres_changes", { event: "*", schema: "public", table: "feedback" }, triggerRefresh)
      .subscribe();

    // Listen to new transactions
    const txnChannel = sb
      .channel("public:transactions")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, triggerRefresh)
      .subscribe();

    return () => {
      sb.removeChannel(usersChannel);
      sb.removeChannel(feedbackChannel);
      sb.removeChannel(txnChannel);
    };
  }, []);

  const setSession = useCallback((s: Session | null) => {
    setSessionState(s);
  }, []);

  const signOut = useCallback(() => {
    authSignOut();
    setSessionState(null);
    setToast({ type: "info", message: "You have been signed out" });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openSignIn = useCallback(() => {
    setSignUpOpen(false);
    setSignInOpen(true);
  }, []);
  const openSignUp = useCallback(() => {
    setSignInOpen(false);
    setSignUpOpen(true);
  }, []);
  const closeAuth = useCallback(() => {
    setSignInOpen(false);
    setSignUpOpen(false);
  }, []);
  const switchAuth = useCallback(() => {
    if (signInOpen) {
      setSignInOpen(false);
      setSignUpOpen(true);
    } else {
      setSignUpOpen(false);
      setSignInOpen(true);
    }
  }, [signInOpen]);

  const openAnalysis = useCallback((file?: File) => {
    if (!session) {
      setToast({ type: "info", message: "Please Sign In to analyze government forms" });
      setTimeout(() => setToast(null), 3000);
      setSignUpOpen(false);
      setSignInOpen(true);
      return;
    }
    if (file) setPendingFile(file);
    setAnalysisOpen(true);
  }, [session]);
  const closeAnalysis = useCallback(() => {
    setAnalysisOpen(false);
  }, []);
  const clearPendingFile = useCallback(() => setPendingFile(null), []);

  const openApiKey = useCallback(() => setApiKeyOpen(true), []);
  const closeApiKey = useCallback(() => setApiKeyOpen(false), []);
  const refreshKey = useCallback(() => setHasKey(hasApiKey()), []);

  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang: setLangState,
        theme,
        setTheme: setThemeState,
        t: translations[lang],
        session,
        setSession,
        signOut,
        signInOpen,
        signUpOpen,
        openSignIn,
        openSignUp,
        closeAuth,
        switchAuth,
        analysisOpen,
        openAnalysis,
        closeAnalysis,
        pendingFile,
        clearPendingFile,
        apiKeyOpen,
        openApiKey,
        closeApiKey,
        hasKey,
        refreshKey,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
