import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Lock, Eye, EyeOff, Loader2, Shield, AlertCircle, CheckCircle2, KeyRound, ArrowRight } from "lucide-react";
import { useApp } from "../lib/context";
import {
  signUp,
  signInWithPassword,
  sendOtp,
  signInWithPhoneOTP,
  signInWithEmailOTP,
  signInWithGoogle,
  resetPasswordForEmail,
} from "../lib/auth";
import { adminSignIn, seedDefaultAdmin } from "../lib/adminAuth";

type AuthMode = "email-password" | "email-otp" | "phone-otp" | "forgot-password";

export default function AuthModal() {
  const { signInOpen, signUpOpen, closeAuth, switchAuth, setSession, t, showToast } = useApp();
  const open = signInOpen || signUpOpen;
  const isSignIn = signInOpen;

  const [mode, setMode] = useState<AuthMode>("email-password");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDebug, setOtpDebug] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [resetSent, setResetSent] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setOtp("");
    setOtpSent(false);
    setOtpDebug(null);
    setError(null);
    setLoading(false);
    setMode("email-password");
    setResetSent(false);
  };

  const handleClose = () => {
    closeAuth();
    resetForm();
  };

  // Resend countdown timer
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const handleSwitch = () => {
    switchAuth();
    resetForm();
  };

  // SIGN UP
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signUp({ name, email, phone: phone || undefined, password });
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Sign up failed");
      return;
    }
    if (result.session) {
      setSession(result.session);
      showToast("success", `Welcome, ${result.session.name}! Account created.`);
      handleClose();
    }
  };

  // SIGN IN with password — auto-detects admin emails and routes to admin console
  const handleSignInPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // First try admin login (so superadmin@... and admin@... work from the SAME form)
    await seedDefaultAdmin();
    const adminTry = await adminSignIn(email, password);
    if (adminTry.success) {
      setLoading(false);
      showToast("success", `Welcome, ${adminTry.session?.name}! Redirecting to admin console…`);
      handleClose();
      // Route to admin dashboard
      setTimeout(() => {
        window.location.hash = "#admin";
      }, 400);
      return;
    }

    // Fall back to regular user sign-in
    const result = await signInWithPassword({ email, password });
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Sign in failed");
      return;
    }
    if (result.session) {
      setSession(result.session);
      showToast("success", `Welcome back, ${result.session.name}!`);
      handleClose();
    }
  };

  // SEND OTP (phone or email)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const identifier = mode === "phone-otp" ? phone : email.toLowerCase();
    if (!identifier) {
      setError(mode === "phone-otp" ? "Phone is required" : "Email is required");
      setLoading(false);
      return;
    }

    const res = await sendOtp(identifier, mode === "phone-otp" ? "phone" : "email");
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to send OTP");
      return;
    }

    setOtpSent(true);
    setResendIn(30);
    setOtp("");
    if (res.demoOtp) {
      // Demo mode — auto-fill OTP so testing works instantly
      setOtpDebug(res.demoOtp);
      setOtp(res.demoOtp);
      showToast("info", `Demo OTP: ${res.demoOtp} (auto-filled)`);
    } else {
      // Real OTP delivered via email/SMS
      setOtpDebug(null);
      showToast("success", `✅ OTP sent to ${identifier}. Check your ${mode === "phone-otp" ? "phone" : "inbox"}.`);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result =
      mode === "phone-otp"
        ? await signInWithPhoneOTP(phone, otp)
        : await signInWithEmailOTP(email, otp);

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Invalid OTP");
      return;
    }
    if (result.session) {
      setSession(result.session);
      showToast("success", `Welcome, ${result.session.name}!`);
      handleClose();
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }
    const res = await resetPasswordForEmail(email);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Failed to send reset email");
      return;
    }
    setResetSent(true);
    showToast("success", "Password reset email sent. Check your inbox.");
  };

  // GOOGLE
  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();

    // Real OAuth → browser redirects to Google; nothing else to do here
    if (result.redirecting) {
      showToast("info", "Redirecting to Google…");
      return;
    }

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Google sign-in failed");
      return;
    }
    if (result.session) {
      setSession(result.session);
      showToast("success", `Welcome, ${result.session.name}!`);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md pointer-events-auto max-h-[95vh] overflow-y-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />

                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-7 pt-8">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-navy-900 shadow-md">
                      <ChakraSvg className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-navy-900">
                        BharatForm <span className="text-saffron-600">AI</span>
                      </div>
                      <div className="text-[10px] text-navy-500 uppercase tracking-wide font-medium">
                        {t.hero_tagline}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-navy-900">
                    {isSignIn ? t.signin_title : t.signup_title}
                  </h2>
                  <p className="mt-1 text-sm text-navy-500">
                    {isSignIn ? t.signin_subtitle : t.signup_subtitle}
                  </p>

                  {/* Auth method selector for sign in */}
                  {isSignIn && (
                    <div className="mt-5 grid grid-cols-3 gap-1 p-1 bg-navy-50 rounded-lg">
                      {[
                        { code: "email-password" as const, label: "Email", icon: Mail },
                        { code: "email-otp" as const, label: "Email OTP", icon: KeyRound },
                        { code: "phone-otp" as const, label: "Phone OTP", icon: Phone },
                      ].map((m) => (
                        <button
                          key={m.code}
                          type="button"
                          onClick={() => {
                            setMode(m.code);
                            setOtpSent(false);
                            setOtp("");
                            setError(null);
                          }}
                          className={`flex items-center justify-center gap-1 text-[11px] font-semibold py-2 rounded-md transition ${
                            mode === m.code ? "bg-white text-navy-900 shadow-sm" : "text-navy-600"
                          }`}
                        >
                          <m.icon className="h-3 w-3" />
                          {m.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Error banner with intelligent helper feedback based on Supabase codes */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 flex flex-col gap-1.5 text-xs text-red-800"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="font-bold">{error}</span>
                      </div>
                      
                      {/* Google error helper */}
                      {error.toLowerCase().includes("provider is not enabled") && (
                        <div className="mt-1 border-t border-red-200 pt-1.5 text-[10px] text-red-700 leading-relaxed">
                          <strong>💡 Solution:</strong> Go to your <strong>Supabase Dashboard → Authentication → Providers → Google</strong> and turn it <strong>ON</strong>. Then paste your Google Client ID and Secret there.
                        </div>
                      )}

                      {/* Rate limit error helper */}
                      {(error.toLowerCase().includes("rate limit") || error.toLowerCase().includes("exceeded")) && (
                        <div className="mt-1 border-t border-red-200 pt-1.5 text-[10px] text-red-700 leading-relaxed">
                          <strong>💡 Solution:</strong> Supabase restricts verification emails to 3 per hour. Go to <strong>Supabase → Authentication → Providers → Email</strong> and turn <strong>OFF</strong> "Confirm Email" (Email Confirmation). This lets users sign up and log in instantly without checking their email, bypassing rate limits!
                        </div>
                      )}

                      {/* Confirmation required helper */}
                      {error.toLowerCase().includes("confirm your account") && (
                        <div className="mt-1 border-t border-red-200 pt-1.5 text-[10px] text-red-700 leading-relaxed">
                          <strong>💡 Tip:</strong> To avoid checking emails entirely, turn <strong>OFF</strong> "Confirm Email" under <strong>Supabase → Authentication → Providers → Email</strong>.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Demo OTP display */}
                  {otpDebug && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-lg bg-india-50 border border-india-200 px-3 py-2 flex items-start gap-2 text-xs text-india-800"
                    >
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Demo OTP: <span className="font-mono text-base">{otpDebug}</span></div>
                        <div className="text-[10px] mt-0.5 opacity-75">
                          In production this would be sent via SMS/Email. Valid for 5 min.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SIGN UP FORM */}
                  {!isSignIn && (
                    <form onSubmit={handleSignUp} className="mt-5 space-y-3">
                      <FieldInput
                        label={t.signup_name}
                        icon={null}
                        value={name}
                        onChange={setName}
                        placeholder="Aarav Sharma"
                        required
                      />
                      <FieldInput
                        label={t.signup_email}
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@example.com"
                        required
                      />
                      <FieldInput
                        label={t.signup_phone + " (optional)"}
                        icon={Phone}
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+91 98765 43210"
                      />
                      <PasswordInput
                        label={t.signup_password}
                        value={password}
                        onChange={setPassword}
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-saffron-500 hover:bg-saffron-600 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.signup_submit} <ArrowRight className="h-3.5 w-3.5" /></>}
                      </button>
                    </form>
                  )}

                  {/* SIGN IN — email + password */}
                  {isSignIn && mode === "email-password" && (
                    <form onSubmit={handleSignInPassword} className="mt-5 space-y-3">
                      <FieldInput
                        label={t.signin_email}
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@example.com"
                        required
                      />
                      <PasswordInput
                        label={t.signin_password}
                        value={password}
                        onChange={setPassword}
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />

                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-1.5 text-navy-600">
                          <input type="checkbox" className="rounded border-navy-300" defaultChecked />
                          Remember me for 30 days
                        </label>
                        <button type="button" onClick={() => { setMode("forgot-password"); setError(null); setResetSent(false); }} className="text-saffron-700 font-semibold hover:underline">
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 hover:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.signin_submit} <ArrowRight className="h-3.5 w-3.5" /></>}
                      </button>
                    </form>
                  )}

                  {/* FORGOT PASSWORD */}
                  {isSignIn && mode === "forgot-password" && (
                    <form onSubmit={handleForgotPassword} className="mt-5 space-y-3">
                      {resetSent ? (
                        <div className="text-center py-4">
                          <div className="mx-auto h-12 w-12 rounded-full bg-india-50 flex items-center justify-center mb-3">
                            <CheckCircle2 className="h-6 w-6 text-india-600" />
                          </div>
                          <div className="text-sm font-bold text-navy-900 mb-1">Check your email</div>
                          <div className="text-xs text-navy-500 mb-4">We've sent a password reset link to {email}</div>
                          <button
                            type="button"
                            onClick={() => setMode("email-password")}
                            className="text-sm font-bold text-saffron-700 hover:underline"
                          >
                            Back to Sign In
                          </button>
                        </div>
                      ) : (
                        <>
                          <FieldInput
                            label="Enter your email address"
                            icon={Mail}
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="you@example.com"
                            required
                          />
                          <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 hover:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="h-3.5 w-3.5" /></>}
                          </button>
                          <div className="text-center mt-2">
                            <button
                              type="button"
                              onClick={() => setMode("email-password")}
                              className="text-xs font-semibold text-navy-500 hover:underline"
                            >
                              Wait, I remember it
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}

                  {/* SIGN IN — email OTP */}
                  {isSignIn && mode === "email-otp" && (
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="mt-5 space-y-3">
                      <FieldInput
                        label={t.signin_email}
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@example.com"
                        required
                        disabled={otpSent}
                      />
                      {otpSent && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <OTPInput
                            value={otp}
                            onChange={setOtp}
                            resendIn={resendIn}
                            onResend={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                              setOtpDebug(null);
                            }}
                            className="mt-2 text-xs font-semibold text-saffron-700 hover:underline"
                          >
                            ← Change email
                          </button>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || (otpSent && otp.length < 6)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 hover:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? <>Verify OTP <ArrowRight className="h-3.5 w-3.5" /></> : <>Send OTP to Email <ArrowRight className="h-3.5 w-3.5" /></>}
                      </button>
                    </form>
                  )}

                  {/* SIGN IN — phone OTP */}
                  {isSignIn && mode === "phone-otp" && (
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="mt-5 space-y-3">
                      <FieldInput
                        label={t.signin_phone}
                        icon={Phone}
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+91 98765 43210"
                        required
                        disabled={otpSent}
                      />
                      {otpSent && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <OTPInput
                            value={otp}
                            onChange={setOtp}
                            resendIn={resendIn}
                            onResend={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                              setOtpDebug(null);
                            }}
                            className="mt-2 text-xs font-semibold text-saffron-700 hover:underline"
                          >
                            ← Change phone
                          </button>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || (otpSent && otp.length < 6)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 hover:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? <>Verify OTP <ArrowRight className="h-3.5 w-3.5" /></> : <>Send OTP via SMS <ArrowRight className="h-3.5 w-3.5" /></>}
                      </button>
                    </form>
                  )}

                  {/* Divider */}
                  <div className="my-5 flex items-center gap-3">
                    <div className="flex-1 h-px bg-navy-100" />
                    <span className="text-xs text-navy-500 font-medium">{t.signin_or}</span>
                    <div className="flex-1 h-px bg-navy-100" />
                  </div>

                  {/* Google only — GitHub removed */}
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-navy-200 hover:bg-navy-50 text-sm font-semibold text-navy-700 transition disabled:opacity-60"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Switch */}
                  <div className="mt-5 text-center text-sm text-navy-600">
                    {isSignIn ? t.signin_no_account : t.signup_have_account}{" "}
                    <button onClick={handleSwitch} className="font-bold text-saffron-700 hover:underline">
                      {isSignIn ? t.signin_signup : t.signin_signin}
                    </button>
                  </div>

                  {/* Trust */}
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-navy-500">
                    <Shield className="h-3 w-3 text-india-600" />
                    <span>Protected by SHA-256 encryption · DPDP Act 2023</span>
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

function FieldInput({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: {
  label: string;
  icon: any;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:bg-white focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition disabled:opacity-60`}
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy-700 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full pl-9 pr-10 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:bg-white focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function OTPInput({ value, onChange, resendIn, onResend }: { value: string; onChange: (v: string) => void; resendIn?: number; onResend?: () => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy-700 mb-1.5">Enter 6-digit OTP</label>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="123456"
        maxLength={6}
        required
        autoFocus
        className="w-full px-3.5 py-3 bg-navy-50 border-2 border-saffron-300 rounded-lg text-xl text-center text-navy-900 tracking-[0.5em] font-mono placeholder:text-navy-300 focus:outline-none focus:bg-white focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition"
      />
      <div className="mt-1.5 text-[10px] text-navy-500 text-center">
        Valid for 5 minutes · Didn't receive?{" "}
        {resendIn && resendIn > 0 ? (
          <span className="text-navy-400 font-semibold">Resend in {resendIn}s</span>
        ) : (
          <button type="button" onClick={onResend} className="text-saffron-700 font-semibold hover:underline">Resend OTP</button>
        )}
      </div>
    </div>
  );
}

function ChakraSvg({ className }: { className?: string }) {
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
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}
