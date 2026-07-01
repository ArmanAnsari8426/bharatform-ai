import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Monitor,
  Minus,
  Plus,
  RotateCcw,
  Type,
  Maximize2,
  Minimize2,
  Palette,
  ChevronDown,
  X,
} from "lucide-react";

type AccSettings = {
  highContrast: boolean;
  fontSize: number;
  textSpacing: number;
  lineHeight: number;
  hideImages: boolean;
  bigCursor: boolean;
  grayscale: boolean;
  dyslexiaFont: boolean;
};

const DEFAULT_SETTINGS: AccSettings = {
  highContrast: false,
  fontSize: 16,
  textSpacing: 0,
  lineHeight: 1.6,
  hideImages: false,
  bigCursor: false,
  grayscale: false,
  dyslexiaFont: false,
};

function loadSettings(): AccSettings {
  try {
    const saved = localStorage.getItem("bf-accessibility");
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function applySettings(s: AccSettings) {
  const root = document.documentElement;

  if (s.highContrast) {
    root.dataset.theme = "dark";
    root.style.setProperty("--bg", "#000000");
    root.style.setProperty("--surface", "#000000");
    root.style.setProperty("--text", "#FFFF00");
    root.style.setProperty("--text-soft", "#FFFFFF");
    root.style.setProperty("--border", "#FFFF00");
  } else {
    root.style.removeProperty("--bg");
    root.style.removeProperty("--surface");
    root.style.removeProperty("--text");
    root.style.removeProperty("--text-soft");
    root.style.removeProperty("--border");
  }

  root.style.fontSize = `${s.fontSize}px`;
  root.style.letterSpacing = `${s.textSpacing}px`;
  root.style.lineHeight = `${s.lineHeight}`;

  if (s.hideImages) {
    root.classList.add("hide-images");
  } else {
    root.classList.remove("hide-images");
  }

  if (s.bigCursor) {
    root.classList.add("big-cursor");
  } else {
    root.classList.remove("big-cursor");
  }

  if (s.grayscale) {
    root.classList.add("grayscale");
  } else {
    root.classList.remove("grayscale");
  }

  if (s.dyslexiaFont) {
    root.style.fontFamily = "'OpenDyslexic', 'Comic Sans MS', sans-serif";
  } else {
    root.style.fontFamily = "";
  }

  localStorage.setItem("bf-accessibility", JSON.stringify(s));
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const update = (key: keyof AccSettings, value: any) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      applySettings(next);
      return next;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-[100] h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          open ? "bg-saffron-600 text-white" : "bg-navy-900 text-white hover:bg-saffron-600"
        }`}
        aria-label="Accessibility Tools"
      >
        {open ? <X className="h-6 w-6" /> : <Accessibility className="h-6 w-6" />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[99] w-80 rounded-3xl border border-white/10 bg-navy-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-saffron-600/20 to-india-600/20">
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-saffron-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Accessibility Tools</h3>
              </div>
              <p className="text-[10px] text-navy-400 mt-1">Customize your browsing experience</p>
            </div>

            <div className="p-4 space-y-5 max-h-[500px] overflow-y-auto">
              {/* Contrast */}
              <Section title="Contrast" icon={Palette}>
                <ToggleRow
                  label="High Contrast"
                  desc="Boost text visibility with yellow on black"
                  value={settings.highContrast}
                  onChange={(v) => update("highContrast", v)}
                />
                <ToggleRow
                  label="Grayscale"
                  desc="Remove all colors for sensitive eyes"
                  value={settings.grayscale}
                  onChange={(v) => update("grayscale", v)}
                />
              </Section>

              {/* Text Size */}
              <Section title="Text Size" icon={Type}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => update("fontSize", Math.max(10, settings.fontSize - 2))}
                    className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-black text-white tabular-nums">{settings.fontSize}px</div>
                    <div className="text-[9px] text-navy-400">Current size</div>
                  </div>
                  <button
                    onClick={() => update("fontSize", Math.min(28, settings.fontSize + 2))}
                    className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => update("fontSize", 16)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-saffron-400 hover:text-saffron-300"
                >
                  <RotateCcw className="h-3 w-3" /> Reset text size
                </button>
              </Section>

              {/* Text Spacing */}
              <Section title="Text Spacing" icon={Maximize2}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => update("textSpacing", Math.max(0, settings.textSpacing - 0.5))}
                    className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-black text-white tabular-nums">{settings.textSpacing}px</div>
                    <div className="text-[9px] text-navy-400">Letter spacing</div>
                  </div>
                  <button
                    onClick={() => update("textSpacing", settings.textSpacing + 0.5)}
                    className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3">
                  <label className="text-[10px] font-bold text-navy-400 mb-1 block">Line Height</label>
                  <input
                    type="range"
                    min="1.2"
                    max="3"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) => update("lineHeight", parseFloat(e.target.value))}
                    className="w-full accent-saffron-500"
                  />
                  <div className="text-[9px] text-navy-400 text-center mt-1">{settings.lineHeight}x</div>
                </div>
              </Section>

              {/* Display */}
              <Section title="Display" icon={Monitor}>
                <ToggleRow
                  label="Hide Images"
                  desc="Remove all images from the page"
                  value={settings.hideImages}
                  onChange={(v) => update("hideImages", v)}
                />
                <ToggleRow
                  label="Big Cursor"
                  desc="Make the mouse cursor larger"
                  value={settings.bigCursor}
                  onChange={(v) => update("bigCursor", v)}
                />
                <ToggleRow
                  label="Dyslexia-friendly Font"
                  desc="Use OpenDyslexic font for better readability"
                  value={settings.dyslexiaFont}
                  onChange={(v) => update("dyslexiaFont", v)}
                />
              </Section>

              {/* Reset All */}
              <button
                onClick={() => {
                  setSettings(DEFAULT_SETTINGS);
                  applySettings(DEFAULT_SETTINGS);
                }}
                className="w-full rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors"
              >
                Reset All Accessibility Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-saffron-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <div className="text-xs font-bold text-white">{label}</div>
        <div className="text-[10px] text-navy-400">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 rounded-full transition-colors ${value ? "bg-saffron-500" : "bg-white/10"}`}
        role="switch"
        aria-checked={value}
      >
        <div
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
