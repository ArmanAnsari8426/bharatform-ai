import { motion } from "framer-motion";
import IndiaFlag from "./IndiaFlag";
import IndiaOutline, { STATE_REGIONS } from "./IndiaOutline";

export default function IndiaMap({ className = "" }: { className?: string }) {
  const featured = [
    { code: "DL", city: "Delhi", color: "#FF9933" },
    { code: "MH", city: "Mumbai", color: "#138808" },
    { code: "WB", city: "Kolkata", color: "#FF9933" },
    { code: "TN", city: "Chennai", color: "#138808" },
    { code: "KA", city: "Bengaluru", color: "#FF9933" },
  ];

  return (
    <div className={`relative ${className}`} aria-label="India coverage map">
      <IndiaOutline className="h-full w-full">
        {/* Pulse rings + dots on cities */}
        {featured.map((f, i) => {
          const pos = STATE_REGIONS[f.code];
          if (!pos) return null;
          return (
            <g key={f.code}>
              <circle cx={pos.x} cy={pos.y} r="12" fill={f.color} opacity="0.4">
                <animate attributeName="r" from="12" to="28" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={pos.x} cy={pos.y} r="8" fill={f.color} stroke="white" strokeWidth="2" />
            </g>
          );
        })}
      </IndiaOutline>

      {/* Floating city labels */}
      {featured.map((f, i) => {
        const pos = STATE_REGIONS[f.code];
        if (!pos) return null;
        const left = (pos.x / 1000) * 100;
        const top = (pos.y / 1000) * 100;
        return (
          <motion.div
            key={f.code}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.12, type: "spring", stiffness: 220 }}
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 px-2 py-0.5 text-[9px] font-bold text-navy-800 shadow-sm backdrop-blur whitespace-nowrap">
              {f.city}
            </span>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-2xl border border-white/60 bg-white/95 px-3 py-2 shadow-xl backdrop-blur"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <IndiaFlag className="h-4 w-auto rounded-sm" />
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-saffron-700">28 States · 8 UTs</div>
            <div className="text-[9px] font-semibold text-navy-500">7 languages · 250+ services</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
