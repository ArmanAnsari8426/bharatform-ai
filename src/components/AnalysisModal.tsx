import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, FileText, Sparkles, Loader2, CheckCircle2, AlertCircle, AlertTriangle,
  ChevronRight, Image as ImageIcon, FileType, KeyRound, RefreshCw, Download
} from "lucide-react";
import { useApp } from "../lib/context";
import { analyzeForm, type FormAnalysisResult, type FormFieldAnalysis } from "../lib/gemini";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";

type Status = "idle" | "uploading" | "analyzing" | "done" | "error";

export default function AnalysisModal() {
  const { analysisOpen, closeAnalysis, pendingFile, clearPendingFile, hasKey, openApiKey, lang, showToast, session } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<FormAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"fields" | "documents" | "guide" | "mistakes">("fields");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Auto-pickup pending file from context
  useEffect(() => {
    if (analysisOpen && pendingFile && file !== pendingFile) {
      setFile(pendingFile);
      clearPendingFile();
    }
  }, [analysisOpen, pendingFile, file, clearPendingFile]);

  // Create preview URL for image files
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  // Reset when modal closes
  useEffect(() => {
    if (!analysisOpen) {
      setTimeout(() => {
        setFile(null);
        setStatus("idle");
        setResult(null);
        setError(null);
        setProgress(0);
        setActiveTab("fields");
      }, 300);
    }
  }, [analysisOpen]);

  // Fake progress while analyzing
  useEffect(() => {
    if (status === "analyzing") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 92) return p;
          return p + Math.random() * 8;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleFile = (f: File) => {
    const supported = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
    if (!supported.includes(f.type)) {
      setError(`Unsupported file type. Use PDF, JPG, PNG, or WEBP.`);
      showToast("error", "Unsupported file type. Use PDF, JPG, PNG, or WEBP.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File too large. Max 20MB.");
      showToast("error", "File too large. Max 20MB.");
      return;
    }
    setError(null);
    setResult(null);
    setStatus("idle");
    setFile(f);
  };

  const startAnalysis = async () => {
    if (!file) return;

    setStatus("analyzing");
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeForm(file, lang === "hi" ? "hindi" : "english");
      
      // Save analysis record
      const record = {
        user_id: session?.userId,
        user_name: session?.name || "Citizen",
        user_email: session?.email,
        form_name: analysis.form_name,
        form_number: analysis.form_number || "None",
        authority: analysis.authority,
        total_fields: analysis.fields?.length || 0,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const sb = getSupabase();
        if (sb && session?.userId) {
          await sb.from("analyses").insert(record);
        }
      } else {
        const localAnls = JSON.parse(localStorage.getItem("bf-analyses") || "[]");
        localAnls.unshift({ ...record, id: `anl_${Date.now()}` });
        localStorage.setItem("bf-analyses", JSON.stringify(localAnls));
      }

      setProgress(100);
      setResult(analysis);
      setStatus("done");
      showToast("success", `Analyzed ${analysis.fields.length} fields in your ${analysis.form_name}`);
      window.dispatchEvent(new Event("bf-db-updated")); // Trigger real-time dashboard update
    } catch (e: any) {
      setError(e.message || "Analysis failed. Try again.");
      setStatus("error");
      showToast("error", e.message || "Analysis failed");
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setError(null);
    setProgress(0);
  };

  const downloadReport = () => {
    if (!result) return;
    const text = formatReport(result);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.form_name.replace(/\s+/g, "-").toLowerCase()}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", "Analysis report downloaded");
  };

  return (
    <AnimatePresence>
      {analysisOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm"
            onClick={closeAnalysis}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-6xl max-h-[92vh] pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[92vh]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500 z-10" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white shadow-md">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-navy-900">Form Analysis</span>
                        {hasKey ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-india-50 text-india-700 border border-india-200 px-2 py-0.5 rounded">
                            <span className="h-1.5 w-1.5 rounded-full bg-india-500 animate-pulse" />
                            Live AI
                          </span>
                        ) : (
                          <button onClick={openApiKey} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded hover:bg-amber-100">
                            <KeyRound className="h-2.5 w-2.5" />
                            Connect AI
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-navy-500">
                        Real AI · Powered by Gemini 2.5 Flash · Field-by-field breakdown
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {result && (
                      <>
                        <button
                          onClick={downloadReport}
                          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg hover:bg-navy-50 text-sm font-semibold text-navy-700"
                        >
                          <Download className="h-3.5 w-3.5" /> Report
                        </button>
                        <button
                          onClick={reset}
                          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg hover:bg-navy-50 text-sm font-semibold text-navy-700"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> New
                        </button>
                      </>
                    )}
                    <button
                      onClick={closeAnalysis}
                      className="h-9 w-9 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden grid lg:grid-cols-12">
                  {/* Left: Upload + preview */}
                  <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r overflow-y-auto p-5" style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}>
                    <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-3">
                      {file ? "Selected File" : "Upload Form"}
                    </div>

                    {!file ? (
                      <DropZone onFile={handleFile} inputRef={fileInputRef} />
                    ) : (
                      <div>
                        {/* File card */}
                        <div className="rounded-xl bg-white border border-navy-200 p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <div className="h-10 w-10 rounded-lg bg-saffron-50 flex items-center justify-center flex-shrink-0">
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="h-5 w-5 text-saffron-700" />
                              ) : (
                                <FileType className="h-5 w-5 text-saffron-700" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-navy-900 truncate">{file.name}</div>
                              <div className="text-xs text-navy-500">
                                {(file.size / 1024).toFixed(1)} KB · {file.type.split("/")[1]?.toUpperCase()}
                              </div>
                            </div>
                            <button onClick={reset} className="text-navy-400 hover:text-red-600">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                          <div className="rounded-xl border border-navy-200 overflow-hidden mb-3 bg-white">
                            <img src={previewUrl} alt="Form preview" className="w-full h-auto max-h-[300px] object-contain" />
                          </div>
                        )}
                        {file.type === "application/pdf" && (
                          <div className="rounded-xl border border-navy-200 bg-white p-6 mb-3 text-center">
                            <FileType className="h-12 w-12 text-saffron-500 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-navy-900">PDF Document</div>
                            <div className="text-xs text-navy-500">{file.name}</div>
                          </div>
                        )}

                        {/* Action button */}
                        {status === "idle" && (
                          <button
                            onClick={startAnalysis}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-navy-900 hover:bg-navy-800 px-4 py-3 text-sm font-bold text-white transition-colors"
                          >
                            <Sparkles className="h-4 w-4 text-saffron-400" />
                            Analyze with Gemini AI
                          </button>
                        )}

                        {status === "analyzing" && (
                          <div className="rounded-xl border border-saffron-200 bg-saffron-50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Loader2 className="h-4 w-4 text-saffron-700 animate-spin" />
                              <span className="text-sm font-bold text-saffron-900">AI is reading your form…</span>
                            </div>
                            <div className="text-xs text-saffron-800 mb-3">
                              Gemini Vision is detecting every field, extracting requirements, identifying mistakes.
                            </div>
                            <div className="h-1.5 bg-saffron-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-saffron-500 to-saffron-700"
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <div className="text-[10px] text-saffron-700 mt-1.5 text-right font-mono">{Math.floor(progress)}%</div>
                          </div>
                        )}

                        {status === "error" && error && (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 text-xs text-red-900">
                                <div className="font-bold mb-0.5">Analysis failed</div>
                                <div>{error}</div>
                              </div>
                            </div>
                            <button
                              onClick={startAnalysis}
                              className="mt-2 w-full text-xs font-semibold text-red-700 hover:text-red-900 inline-flex items-center justify-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" /> Try again
                            </button>
                          </div>
                        )}

                        {status === "done" && result && (
                          <ResultSidebar result={result} />
                        )}
                      </div>
                    )}

                    {/* Privacy note */}
                    <div className="mt-4 rounded-lg border border-navy-100 bg-white p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Privacy</div>
                      <div className="text-[10px] text-navy-600 leading-relaxed">
                        Your form is sent directly to Google Gemini using your own API key. It is NOT stored on BharatForm servers. Sample forms for testing don't use real data.
                      </div>
                    </div>
                  </div>

                  {/* Right: Results */}
                  <div className="lg:col-span-8 overflow-y-auto">
                    {!file && (
                      <EmptyState onPickSample={(sampleFile) => handleFile(sampleFile)} />
                    )}

                    {file && status === "idle" && (
                      <ReadyToAnalyze onAnalyze={startAnalysis} hasKey={hasKey} onConnectKey={openApiKey} />
                    )}

                    {status === "analyzing" && <AnalyzingState progress={progress} />}

                    {status === "done" && result && (
                      <ResultView result={result} activeTab={activeTab} setActiveTab={setActiveTab} />
                    )}
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

function DropZone({ onFile, inputRef }: { onFile: (f: File) => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
      }}
      className={`block rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
        drag ? "border-saffron-500 bg-saffron-50" : "border-navy-200 hover:border-saffron-400 bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0]);
        }}
      />
      <Upload className="h-10 w-10 text-saffron-500 mx-auto mb-3" />
      <div className="text-sm font-bold text-navy-900">Drop your form here</div>
      <div className="text-xs text-navy-500 mt-1">or click to browse</div>
      <div className="text-[10px] text-navy-500 mt-3">PDF, JPG, PNG, WEBP · Max 20MB</div>
    </label>
  );
}

function EmptyState({ onPickSample }: { onPickSample: (f: File) => void }) {
  const samples = [
    { name: "Passport Form 1-A", emoji: "🛂", desc: "Sample passport application form" },
    { name: "PAN Form 49A", emoji: "💳", desc: "Sample PAN card application" },
    { name: "Aadhaar Enrolment", emoji: "🪪", desc: "Sample Aadhaar enrolment form" },
  ];

  // Generate sample SVG forms as files
  const loadSample = (sample: typeof samples[0]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="white"/>
      <rect x="40" y="40" width="720" height="80" fill="#FF9933" opacity="0.1" stroke="#FF9933" stroke-width="2"/>
      <text x="60" y="80" font-family="Arial" font-size="22" font-weight="bold" fill="#0F172A">${sample.name}</text>
      <text x="60" y="105" font-family="Arial" font-size="12" fill="#64748B">Government of India · Specimen Form</text>
      <g font-family="Arial" font-size="13" fill="#0F172A">
        <text x="60" y="180" font-weight="bold">1. Given Name (दिया गया नाम) *</text>
        <rect x="60" y="190" width="680" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="250" font-weight="bold">2. Surname (उपनाम) *</text>
        <rect x="60" y="260" width="680" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="320" font-weight="bold">3. Date of Birth (जन्म तिथि) * (DD/MM/YYYY)</text>
        <rect x="60" y="330" width="200" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="390" font-weight="bold">4. Place of Birth (जन्म स्थान) *</text>
        <rect x="60" y="400" width="680" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="460" font-weight="bold">5. Father's Name (पिता का नाम) *</text>
        <rect x="60" y="470" width="680" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="530" font-weight="bold">6. Mother's Name (माता का नाम) *</text>
        <rect x="60" y="540" width="680" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="600" font-weight="bold">7. Permanent Address (स्थायी पता) *</text>
        <rect x="60" y="610" width="680" height="60" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="710" font-weight="bold">8. Mobile Number (मोबाइल) *</text>
        <rect x="60" y="720" width="300" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="380" y="710" font-weight="bold">9. Email (ईमेल)</text>
        <rect x="380" y="720" width="360" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="780" font-weight="bold">10. Aadhaar Number (आधार नंबर) *</text>
        <rect x="60" y="790" width="400" height="30" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="60" y="860" font-weight="bold">11. Photo (फोटो) * 35×45mm</text>
        <rect x="60" y="870" width="100" height="100" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4"/>
        <text x="200" y="860" font-weight="bold">12. Signature (हस्ताक्षर) *</text>
        <rect x="200" y="870" width="200" height="60" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4"/>
      </g>
      <text x="60" y="990" font-family="Arial" font-size="10" fill="#64748B">* Required fields. Submit with Aadhaar, Birth Certificate, Address Proof.</text>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    // Convert to PNG via canvas
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 800, 1000);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        if (b) {
          const file = new File([b], `${sample.name}.png`, { type: "image/png" });
          onPickSample(file);
        }
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center mb-4">
        <Sparkles className="h-8 w-8 text-saffron-700" />
      </div>
      <h3 className="text-xl font-bold text-navy-900">Upload any government form</h3>
      <p className="mt-2 text-sm text-navy-600 max-w-md">
        Gemini AI will read every field, explain in plain language, list documents, flag mistakes, and give you a step-by-step guide.
      </p>

      <div className="mt-8 w-full max-w-md">
        <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2">Or try a sample form</div>
        <div className="grid grid-cols-3 gap-2">
          {samples.map((s) => (
            <button
              key={s.name}
              onClick={() => loadSample(s)}
              className="group rounded-xl border border-navy-200 hover:border-saffron-400 hover:bg-saffron-50 p-3 text-left transition-all"
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-xs font-bold text-navy-900 group-hover:text-saffron-800">{s.name}</div>
              <div className="text-[10px] text-navy-500 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReadyToAnalyze({ onAnalyze, hasKey, onConnectKey }: { onAnalyze: () => void; hasKey: boolean; onConnectKey: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-india-100 to-india-200 flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8 text-india-700" />
      </div>
      <h3 className="text-xl font-bold text-navy-900">Ready to analyze</h3>
      <p className="mt-2 text-sm text-navy-600 max-w-md">
        Your form is loaded. Click below to send it to Gemini AI for a complete field-by-field analysis.
      </p>

      {!hasKey && (
        <div className="mt-6 max-w-md w-full rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
          <div className="flex items-start gap-2">
            <KeyRound className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <div className="font-bold mb-1">AI key not detected</div>
              Analysis will still run in fallback mode. Connect Gemini later for deeper OCR.
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={onAnalyze}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-800 px-6 py-3 text-base font-bold text-white shadow-lg transition-colors"
        >
          <Sparkles className="h-5 w-5 text-saffron-400" />
          Analyze Now
          <ChevronRight className="h-4 w-4" />
        </button>
        {!hasKey && (
          <button onClick={onConnectKey} className="inline-flex items-center gap-2 rounded-xl border border-navy-200 px-5 py-3 text-sm font-bold text-navy-700 hover:bg-navy-50">
            <KeyRound className="h-4 w-4" /> Connect AI
          </button>
        )}
      </div>
    </div>
  );
}

function AnalyzingState({ progress }: { progress: number }) {
  const stages = [
    { label: "Uploading to Gemini Vision", done: progress > 10 },
    { label: "Detecting form fields", done: progress > 35 },
    { label: "Extracting required documents", done: progress > 55 },
    { label: "Identifying common mistakes", done: progress > 75 },
    { label: "Building step-by-step guide", done: progress > 90 },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
      <div className="relative h-20 w-20 mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 animate-pulse opacity-20" />
        <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-white shadow-lg">
          <Sparkles className="h-9 w-9 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-navy-900">Bharat AI is analyzing…</h3>
      <p className="mt-2 text-sm text-navy-600">This usually takes 5-15 seconds for a typical form.</p>

      <div className="mt-8 w-full max-w-md space-y-2">
        {stages.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white p-3"
          >
            {s.done ? (
              <CheckCircle2 className="h-4 w-4 text-india-600 flex-shrink-0" />
            ) : (
              <Loader2 className="h-4 w-4 text-saffron-500 animate-spin flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${s.done ? "text-navy-900" : "text-navy-600"}`}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 w-full max-w-md h-1.5 bg-navy-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-saffron-500 via-india-500 to-saffron-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="text-xs text-navy-500 mt-2 font-mono">{Math.floor(progress)}%</div>
    </div>
  );
}

function ResultSidebar({ result }: { result: FormAnalysisResult }) {
  const required = result.fields.filter((f) => f.required).length;
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white border border-navy-100 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Form Identified</div>
        <div className="text-sm font-bold text-navy-900">{result.form_name}</div>
        {result.form_number && <div className="text-xs text-navy-500">{result.form_number}</div>}
        <div className="text-xs text-saffron-700 font-semibold mt-1">{result.authority}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-saffron-50 border border-saffron-200 p-2 text-center">
          <div className="text-xl font-bold text-saffron-700 tabular-nums">{result.fields.length}</div>
          <div className="text-[9px] uppercase font-bold text-saffron-600 tracking-wide">Fields</div>
        </div>
        <div className="rounded-lg bg-india-50 border border-india-200 p-2 text-center">
          <div className="text-xl font-bold text-india-700 tabular-nums">{result.required_documents.length}</div>
          <div className="text-[9px] uppercase font-bold text-india-600 tracking-wide">Docs</div>
        </div>
        <div className="rounded-lg bg-navy-50 border border-navy-200 p-2 text-center">
          <div className="text-xl font-bold text-navy-900 tabular-nums">{required}</div>
          <div className="text-[9px] uppercase font-bold text-navy-600 tracking-wide">Required</div>
        </div>
      </div>

      {result.fee && (
        <div className="rounded-lg bg-white border border-navy-100 p-2 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-navy-500 tracking-wide">Fee</span>
          <span className="text-sm font-bold text-navy-900">{result.fee}</span>
        </div>
      )}
      {result.estimated_time && (
        <div className="rounded-lg bg-white border border-navy-100 p-2 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-navy-500 tracking-wide">Time</span>
          <span className="text-sm font-bold text-navy-900">{result.estimated_time}</span>
        </div>
      )}
    </div>
  );
}

function ResultView({
  result,
  activeTab,
  setActiveTab,
}: {
  result: FormAnalysisResult;
  activeTab: "fields" | "documents" | "guide" | "mistakes";
  setActiveTab: (t: any) => void;
}) {
  return (
    <div>
      <div className="px-6 pt-5 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="text-xs text-saffron-700 font-bold uppercase tracking-wider mb-1">{result.authority}</div>
        <h2 className="text-xl font-bold text-navy-900">{result.form_name}</h2>
        {result.form_number && <div className="text-xs text-navy-500 mt-0.5">{result.form_number}</div>}
        <p className="text-sm text-navy-600 mt-2 leading-relaxed">{result.description}</p>
      </div>

      <div className="flex gap-1 border-b px-6 overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        {[
          { code: "fields", label: "Fields", count: result.fields.length },
          { code: "documents", label: "Documents", count: result.required_documents.length },
          { code: "guide", label: "Step-by-step Guide", count: result.step_by_step.length },
          { code: "mistakes", label: "Mistakes", count: result.common_mistakes.length },
        ].map((tab) => (
          <button
            key={tab.code}
            onClick={() => setActiveTab(tab.code)}
            className={`px-3 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.code
                ? "border-saffron-500 text-navy-900"
                : "border-transparent text-navy-500 hover:text-navy-700"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-600">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === "fields" && (
          <div className="space-y-2">
            {result.fields.map((f) => (
              <FieldCard key={f.field_number} field={f} />
            ))}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-2">
            {result.required_documents.map((d, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white p-3.5">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  d.required ? "bg-india-50" : "bg-navy-50"
                }`}>
                  {d.required ? <CheckCircle2 className="h-4 w-4 text-india-700" /> : <FileText className="h-4 w-4 text-navy-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-navy-900">{d.name}</span>
                    {d.required ? (
                      <span className="text-[10px] font-bold text-red-600 uppercase">Required</span>
                    ) : (
                      <span className="text-[10px] font-bold text-navy-500 uppercase">Conditional</span>
                    )}
                  </div>
                  {d.note && <div className="text-xs text-navy-600 mt-0.5">{d.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "guide" && (
          <ol className="space-y-3">
            {result.step_by_step.map((s, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white p-4">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-900">{s.step}</div>
                  <p className="text-xs text-navy-600 mt-1 leading-relaxed">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {activeTab === "mistakes" && (
          <div className="space-y-2">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-4">
              <div className="text-sm font-bold text-amber-900">⚠️ These mistakes cause most rejections</div>
              <p className="text-xs text-amber-800 mt-1">Avoid these to get your application approved on first try.</p>
            </div>
            {result.common_mistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-white p-4">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-navy-800">{m}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldCard({ field }: { field: FormFieldAnalysis }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border bg-white overflow-hidden ${open ? "border-saffron-300" : "border-navy-100"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-navy-50/50 transition-colors"
      >
        <div className="h-8 w-8 rounded-lg bg-saffron-50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-saffron-700">{field.field_number}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-navy-900 truncate">{field.field_name}</span>
            {field.required && <span className="text-[10px] text-red-500 font-bold">*</span>}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-600 uppercase font-bold">{field.field_type}</span>
          </div>
          {field.field_name_hindi && <div className="text-xs text-navy-500 font-hindi truncate">{field.field_name_hindi}</div>}
        </div>
        <ChevronRight className={`h-4 w-4 text-navy-400 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-navy-100"
          >
            <div className="p-4 bg-gradient-to-br from-saffron-50/30 to-white space-y-3">
              {field.explanation && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 mb-1 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" /> AI Explains
                  </div>
                  <div className="text-sm text-navy-800 leading-relaxed">{field.explanation}</div>
                </div>
              )}
              {field.what_to_write && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-india-700 mb-1">✏️ What to write</div>
                  <div className="text-sm text-navy-800">{field.what_to_write}</div>
                </div>
              )}
              {field.common_mistake && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">⚠️ Common mistake</div>
                  <div className="text-xs text-amber-900">{field.common_mistake}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatReport(r: FormAnalysisResult): string {
  return `# ${r.form_name} — AI Analysis

**Authority:** ${r.authority}
${r.form_number ? `**Form Number:** ${r.form_number}` : ""}

## Description
${r.description}

## Quick Stats
- **Total Fields:** ${r.fields.length}
- **Required Documents:** ${r.required_documents.length}
${r.fee ? `- **Fee:** ${r.fee}` : ""}
${r.estimated_time ? `- **Processing Time:** ${r.estimated_time}` : ""}

## Fields (${r.fields.length})

${r.fields.map(f => `### ${f.field_number}. ${f.field_name}${f.field_name_hindi ? ` (${f.field_name_hindi})` : ""}
- **Required:** ${f.required ? "Yes" : "No"}
- **Type:** ${f.field_type}
- **Explanation:** ${f.explanation}
${f.what_to_write ? `- **What to write:** ${f.what_to_write}` : ""}
${f.common_mistake ? `- **Common mistake:** ${f.common_mistake}` : ""}
`).join("\n")}

## Required Documents (${r.required_documents.length})
${r.required_documents.map(d => `- ${d.required ? "**[REQUIRED]**" : "[Optional]"} ${d.name}${d.note ? ` — ${d.note}` : ""}`).join("\n")}

## Step-by-step Guide (${r.step_by_step.length})
${r.step_by_step.map((s, i) => `${i + 1}. **${s.step}** — ${s.description}`).join("\n")}

## Common Mistakes (${r.common_mistakes.length})
${r.common_mistakes.map(m => `- ${m}`).join("\n")}

---
Generated by BharatForm AI · Powered by Gemini 2.5 Flash
`;
}
