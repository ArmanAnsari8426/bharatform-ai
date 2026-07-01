import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, MapPin, Activity, Search, ArrowUpRight, Zap, Radio } from "lucide-react";
import { STATES, intensityColor, intensityOpacity, type StateInfo } from "../lib/states";
import IndiaOutline, { STATE_REGIONS } from "./IndiaOutline";
import IndiaFlag from "./IndiaFlag";

const LIVE_EVENTS = [
  { city: "Mumbai", state: "Maharashtra", action: "Passport form analyzed" },
  { city: "Delhi", state: "Delhi", action: "Scholarship matched" },
  { city: "Bengaluru", state: "Karnataka", action: "Aadhaar update checked" },
  { city: "Patna", state: "Bihar", action: "Income certificate prepared" },
  { city: "Chennai", state: "Tamil Nadu", action: "Driving license guide opened" },
  { city: "Hyderabad", state: "Telangana", action: "Ration card verified" },
  { city: "Kolkata", state: "West Bengal", action: "PAN correction analyzed" },
  { city: "Jaipur", state: "Rajasthan", action: "PM Awas scheme checked" },
  { city: "Lucknow", state: "Uttar Pradesh", action: "Voter ID form uploaded" },
  { city: "Bhopal", state: "Madhya Pradesh", action: "Caste certificate verified" },
  { city: "Ahmedabad", state: "Gujarat", action: "Ayushman card checked" },
  { city: "Pune", state: "Maharashtra", action: "E-Shram card analyzed" },
];

export default function IndiaHeatMap() {
  const [hovered, setHovered] = useState<StateInfo | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "state" | "ut">("all");
  const [liveIndex, setLiveIndex] = useState(0);
  const [appCount, setAppCount] = useState(127482);

  // Live counter + ticker rotation
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setLiveIndex((i) => (i + 1) % LIVE_EVENTS.length);
    }, 2500);
    const countInterval = setInterval(() => {
      setAppCount((c) => c + Math.floor(Math.random() * 5 + 1));
    }, 1800);
    return () => {
      clearInterval(tickerInterval);
      clearInterval(countInterval);
    };
  }, []);

  const filtered = useMemo(() => {
    return STATES
      .filter((s) => (filter === "all" ? true : s.type === filter))
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.nameHi.includes(search))
      .sort((a, b) => b.applications - a.applications);
  }, [search, filter]);

  const totalSchemes = STATES.reduce((sum, s) => sum + s.schemes, 0);
  const currentEvent = LIVE_EVENTS[liveIndex];

  return (
    <section id="heatmap" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-700 mb-5"
          >
            <Radio className="h-3 w-3 animate-pulse" />
            LIVE INDIA HEAT MAP · 28 STATES + 8 UTs
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Where India is applying.{" "}
            <span className="text-saffron-600">Live state-by-state.</span>
          </motion.h2>
          <p className="mt-3 text-base" style={{ color: "var(--text-soft)" }}>
            Real-time analysis of government service applications across every Indian state & UT.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Heat Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl border shadow-2xl overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-india-500" />

              <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IndiaFlag className="h-5 w-auto rounded-sm shadow-sm" />
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                        India Coverage Heat Map
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          LIVE
                        </span>
                      </div>
                      <div className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                        {appCount.toLocaleString("en-IN")} applications · auto-refreshing
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                    <span style={{ color: "var(--text-muted)" }}>Low</span>
                    <div className="h-2 w-24 rounded-full" style={{
                      background: "linear-gradient(to right, #FEF3C7, #FCD34D, #FB923C, #F97316, #DC2626, #B91C1C)"
                    }} />
                    <span style={{ color: "var(--text-muted)" }}>High</span>
                  </div>
                </div>
              </div>

              {/* The REAL India map */}
              <div className="relative bg-gradient-to-br from-saffron-50/40 via-white to-india-50/40" style={{ aspectRatio: "1/1" }}>
                <IndiaOutline className="absolute inset-0 w-full h-full">
                  {/* Heat circles per state */}
                  {STATES.map((s) => {
                    const pos = STATE_REGIONS[s.code];
                    if (!pos) return null;
                    const r = pos.r ?? 14;
                    const color = intensityColor(s.intensity);
                    const opacity = intensityOpacity(s.intensity);
                    const isHovered = hovered?.code === s.code;
                    return (
                      <g
                        key={s.code}
                        className="cursor-pointer"
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {s.intensity > 75 && (
                          <circle cx={pos.x} cy={pos.y} r={r} fill={color} opacity="0.4">
                            <animate attributeName="r" from={r} to={r * 1.8} dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isHovered ? r * 1.15 : r}
                          fill={color}
                          opacity={opacity}
                          stroke={isHovered ? "#0F172A" : "white"}
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          style={{ transition: "all 0.2s ease", cursor: "pointer" }}
                        />
                        {r >= 24 && (
                          <text
                            x={pos.x}
                            y={pos.y + 6}
                            textAnchor="middle"
                            fontSize="18"
                            fontWeight="900"
                            fill="white"
                            stroke="rgba(0,0,0,0.4)"
                            strokeWidth="0.6"
                            style={{ pointerEvents: "none" }}
                          >
                            {s.code}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </IndiaOutline>

                {/* Live activity ticker overlay */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentEvent.city + liveIndex}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-4 left-4 rounded-2xl border border-india-200 bg-white/95 backdrop-blur shadow-xl p-3 max-w-[260px]"
                  >
                    <div className="flex items-start gap-2">
                      <div className="relative flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-india-500 to-india-700 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-india-700">Just now</div>
                        <div className="text-xs font-bold text-navy-900 truncate">{currentEvent.action}</div>
                        <div className="text-[10px] text-navy-500 mt-0.5">
                          <MapPin className="inline h-2.5 w-2.5" /> {currentEvent.city}, {currentEvent.state}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Hovered state tooltip */}
                {hovered && (
                  <motion.div
                    key={hovered.code}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs rounded-2xl border bg-white shadow-2xl p-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 border border-saffron-200 px-1.5 py-0.5 rounded">{hovered.type === "ut" ? "UT" : "STATE"}</span>
                          <span className="text-xs font-bold text-navy-500">{hovered.code}</span>
                        </div>
                        <div className="text-base font-bold text-navy-900">{hovered.name}</div>
                        <div className="text-xs font-hindi text-navy-500">{hovered.nameHi}</div>
                        <div className="text-[10px] text-navy-400 mt-0.5">Capital: {hovered.capital}</div>
                      </div>
                      <div className="h-10 w-10 rounded-full" style={{
                        background: intensityColor(hovered.intensity),
                        opacity: intensityOpacity(hovered.intensity),
                        boxShadow: `0 0 20px ${intensityColor(hovered.intensity)}40`
                      }} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-navy-50 p-2">
                        <div className="text-[9px] uppercase font-bold text-navy-500">Apps</div>
                        <div className="text-sm font-bold text-navy-900 tabular-nums">{hovered.applications.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="rounded-lg bg-india-50 p-2">
                        <div className="text-[9px] uppercase font-bold text-india-600">Schemes</div>
                        <div className="text-sm font-bold text-india-700 tabular-nums">{hovered.schemes}</div>
                      </div>
                      <div className="rounded-lg bg-saffron-50 p-2">
                        <div className="text-[9px] uppercase font-bold text-saffron-700">Heat</div>
                        <div className="text-sm font-bold text-saffron-700 tabular-nums">{hovered.intensity}%</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Compass / North indicator */}
                <div className="absolute bottom-3 right-3 rounded-full border border-navy-200 bg-white/80 backdrop-blur p-2 shadow-md">
                  <div className="text-[10px] font-bold text-navy-700 text-center">N</div>
                  <svg viewBox="0 0 20 20" className="h-6 w-6 mt-0.5">
                    <path d="M10 2 L13 12 L10 10 L7 12 Z" fill="#DC2626" />
                    <path d="M10 18 L7 8 L10 10 L13 8 Z" fill="#0F172A" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* State list panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border shadow-xl overflow-hidden h-full flex flex-col" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>States</div>
                    <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>28</div>
                  </div>
                  <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>UTs</div>
                    <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>8</div>
                  </div>
                  <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Schemes</div>
                    <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>{totalSchemes}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search state…"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-saffron-400"
                      style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
                    />
                  </div>
                  <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
                    {(["all", "state", "ut"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-2.5 py-2 text-[10px] font-bold uppercase ${
                          filter === f ? "bg-saffron-500 text-white" : ""
                        }`}
                        style={filter !== f ? { color: "var(--text-soft)" } : {}}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[480px]">
                {filtered.slice(0, 24).map((s, i) => (
                  <motion.div
                    key={s.code}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex items-center gap-3 px-5 py-2.5 border-b cursor-pointer hover:bg-saffron-50/30 transition-colors"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="text-[10px] font-bold text-navy-400 w-6 tabular-nums">#{i + 1}</div>
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{
                      background: intensityColor(s.intensity),
                      opacity: intensityOpacity(s.intensity),
                    }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                      <div className="text-[10px] truncate font-hindi" style={{ color: "var(--text-muted)" }}>{s.nameHi}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold tabular-nums" style={{ color: "var(--text)" }}>
                        {s.applications.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[9px] flex items-center gap-0.5 justify-end" style={{ color: "var(--text-muted)" }}>
                        <TrendingUp className="h-2 w-2" /> {s.intensity}% heat
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3" /> Showing {Math.min(24, filtered.length)} of {filtered.length}
                </span>
                <a href="#admin" className="font-semibold text-saffron-700 hover:underline inline-flex items-center gap-0.5">
                  Full data <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
