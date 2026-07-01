import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Eye, EyeOff, Loader2, CheckCircle2, Shield } from "lucide-react";
import { useApp } from "../lib/context";
import { updatePassword } from "../lib/auth";

export default function UpdatePasswordModal() {
  const { showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase redirects to /#access_token=...&type=recovery
    // Or if our hash router captures it as #reset-password, we check for it.
    const checkHash = () => {
      if (window.location.hash.includes("type=recovery") || window.location.hash.includes("#reset-password")) {
        setOpen(true);
        // Clean hash
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await updatePassword(password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to update password");
      return;
    }

    showToast("success", "Password updated successfully. You can now sign in.");
    setOpen(false);
    setPassword("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-navy-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />
                
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-7 pt-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-saffron-50 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-saffron-600" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-center text-navy-900">Update Password</h2>
                  <p className="mt-1 text-xs text-center text-navy-500 mb-6">
                    Please enter your new secure password
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full pl-9 pr-10 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:bg-white focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || password.length < 6}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-saffron-500 hover:bg-saffron-600 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
