import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../lib/context";

const styles = {
  success: { bg: "bg-india-50", border: "border-india-200", text: "text-india-900", icon: CheckCircle2, iconColor: "text-india-600" },
  error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-900", icon: AlertCircle, iconColor: "text-red-600" },
  info: { bg: "bg-saffron-50", border: "border-saffron-200", text: "text-saffron-900", icon: Info, iconColor: "text-saffron-600" },
};

export default function Toast() {
  const { toast, showToast } = useApp();

  return (
    <div className="fixed top-4 right-4 z-[60] pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto"
          >
            {(() => {
              const s = styles[toast.type];
              const Icon = s.icon;
              return (
                <div className={`flex items-start gap-3 rounded-xl border ${s.bg} ${s.border} px-4 py-3 max-w-sm shadow-xl`}>
                  <Icon className={`h-5 w-5 ${s.iconColor} flex-shrink-0 mt-0.5`} />
                  <div className={`flex-1 text-sm font-medium ${s.text}`}>{toast.message}</div>
                  <button
                    onClick={() => showToast(toast.type, "")}
                    className={`${s.iconColor} hover:opacity-70 flex-shrink-0`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
