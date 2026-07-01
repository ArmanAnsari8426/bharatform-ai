import { useState } from "react";
import { TrendingUp, AlertCircle, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import PulseModal, { PULSE_UPDATES } from "./PulseModal";

const typeStyles = {
  new: { icon: CheckCircle2, bg: "bg-india-50", text: "text-india-700", border: "border-india-200", label: "NEW" },
  deadline: { icon: AlertCircle, bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "DEADLINE" },
  update: { icon: TrendingUp, bg: "bg-saffron-50", text: "text-saffron-700", border: "border-saffron-200", label: "UPDATE" },
};

export default function GovernmentPulse() {
  const [open, setOpen] = useState(false);
  const items = PULSE_UPDATES.slice(0, 12);

  return (
    <>
      <section className="py-12 relative overflow-hidden" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-india-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-india-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-soft)" }}>
                  Government Pulse
                </span>
              </div>
              <div className="hidden sm:block h-4 w-px" style={{ background: "var(--border)" }} />
              <span className="hidden sm:inline text-xs" style={{ color: "var(--text-muted)" }}>
                Latest schemes, deadlines & policy updates from across India
              </span>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:underline"
            >
              View all {PULSE_UPDATES.length} <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="relative ticker-wrap">
          <div className="flex gap-3 animate-marquee" style={{ width: "fit-content" }}>
            {[...items, ...items].map((u, i) => {
              const style = typeStyles[u.type as keyof typeof typeStyles];
              const Icon = style.icon;
              return (
                <button
                  key={i}
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2.5 rounded-full border px-4 py-2 flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <span className={`inline-flex items-center gap-1 rounded-full ${style.bg} ${style.text} ${style.border} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                    <Icon className="h-2.5 w-2.5" />
                    {style.label}
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--text)" }}>
                    {u.title}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    <Clock className="h-2.5 w-2.5" />
                    {u.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <PulseModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
