import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, KeyRound, ExternalLink, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Sparkles, Shield } from "lucide-react";
import { useApp } from "../lib/context";
import { getApiKey, setApiKey, clearApiKey, generateContent } from "../lib/gemini";

export default function ApiKeyModal() {
  const { apiKeyOpen, closeApiKey, refreshKey, showToast } = useApp();
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (apiKeyOpen) {
      const existing = getApiKey();
      if (existing) {
        setKey(existing);
        setHasExisting(true);
      } else {
        setKey("");
        setHasExisting(false);
      }
      setTestResult(null);
    }
  }, [apiKeyOpen]);

  const handleSave = async () => {
    if (!key.trim()) {
      setTestResult({ ok: false, msg: "Please enter an API key" });
      return;
    }
    setTesting(true);
    setTestResult(null);

    // Save first, then test
    setApiKey(key.trim());

    try {
      const result = await generateContent(
        [{ role: "user", parts: [{ text: "Reply with exactly: OK" }] }],
        { model: "flash", maxTokens: 10, temperature: 0 }
      );
      if (result && result.length > 0) {
        setTestResult({ ok: true, msg: "API key verified successfully!" });
        refreshKey();
        showToast("success", "Gemini AI connected! All features now use real AI.");
        setTimeout(() => closeApiKey(), 1200);
      } else {
        setTestResult({ ok: false, msg: "Got empty response. Check your key." });
      }
    } catch (e: any) {
      setTestResult({ ok: false, msg: e.message || "Invalid API key" });
      clearApiKey();
      refreshKey();
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setKey("");
    setHasExisting(false);
    setTestResult(null);
    refreshKey();
    showToast("info", "API key removed. Features will use demo mode.");
  };

  return (
    <AnimatePresence>
      {apiKeyOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm"
            onClick={closeApiKey}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />

                <button
                  onClick={closeApiKey}
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-7 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white shadow-md">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-navy-900">Connect Gemini AI</div>
                      <div className="text-xs text-navy-500">Power your Bharat AI with Google's latest AI model</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-saffron-50 border border-saffron-200 p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-saffron-700 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-saffron-900">
                        <div className="font-bold mb-1">Get your free API key in 60 seconds</div>
                        <ol className="space-y-1 list-decimal list-inside text-saffron-800">
                          <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-saffron-900 inline-flex items-center gap-0.5">aistudio.google.com/apikey <ExternalLink className="h-2.5 w-2.5" /></a></li>
                          <li>Sign in with your Google account</li>
                          <li>Click "Create API Key" → Copy</li>
                          <li>Paste below — free tier: 1500 requests/day</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">
                      Gemini API Key
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                      <input
                        type={show ? "text" : "password"}
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-full pl-9 pr-10 py-2.5 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:bg-white focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                      >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Test result */}
                  <AnimatePresence>
                    {testResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-3 rounded-lg border px-3 py-2 flex items-start gap-2 text-xs ${
                          testResult.ok
                            ? "bg-india-50 border-india-200 text-india-800"
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}
                      >
                        {testResult.ok ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                        <span>{testResult.msg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-5 flex gap-2">
                    {hasExisting && (
                      <button
                        onClick={handleClear}
                        className="px-3 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 text-sm font-semibold text-red-700 transition"
                      >
                        Remove
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={testing || !key.trim()}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-navy-900 hover:bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                    >
                      {testing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Testing connection…
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-saffron-400" />
                          {hasExisting ? "Update & Verify" : "Connect Gemini AI"}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-5 rounded-lg bg-navy-50 border border-navy-100 p-3">
                    <div className="flex items-start gap-2 text-xs text-navy-700">
                      <Shield className="h-4 w-4 text-india-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-navy-900 mb-0.5">Your key is safe</div>
                        Stored locally in your browser only. Never sent to BharatForm servers. Cleared on sign out.
                      </div>
                    </div>
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
