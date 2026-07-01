import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Cloud,
  Droplets,
} from "lucide-react";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const hindiMonths = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];
const hindiDays = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isToday(year: number, month: number, day: number) {
  const t = new Date();
  return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
}

function getVikramSamvat(date: Date): number {
  // Approximate Vikram Samvat calculation
  return date.getFullYear() + 57;
}

function getHindiDay(date: Date): string {
  return hindiDays[date.getDay()];
}

function getHindiMonth(date: Date): string {
  return hindiMonths[date.getMonth()];
}

function getWeatherEmoji(hour: number): { icon: any; label: string } {
  if (hour >= 6 && hour < 9) return { icon: Sun, label: "Morning" };
  if (hour >= 9 && hour < 12) return { icon: Sun, label: "Sunny" };
  if (hour >= 12 && hour < 15) return { icon: Cloud, label: "Partly Cloudy" };
  if (hour >= 15 && hour < 18) return { icon: Sun, label: "Afternoon" };
  if (hour >= 18 && hour < 21) return { icon: Cloud, label: "Evening" };
  return { icon: Droplets, label: "Night" };
}

export default function CalendarWidget() {
  const [now, setNow] = useState(new Date());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  }, [now.getFullYear(), now.getMonth()]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const hindiDate = `${getHindiDay(now)}, ${now.getDate()} ${getHindiMonth(now)} ${now.getFullYear()}`;
  const vikramSamvat = getVikramSamvat(now);
  const weather = getWeatherEmoji(now.getHours());
  const WeatherIcon = weather.icon;

  return (
    <>
      {/* Floating Calendar Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-6 z-[100] h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          open ? "bg-india-600 text-white" : "bg-white border border-navy-200 text-navy-800 hover:bg-india-600 hover:text-white hover:border-india-600"
        }`}
        aria-label="Calendar"
      >
        {open ? (
          <div className="text-xs font-black tabular-nums">{now.getDate()}</div>
        ) : (
          <CalendarIcon className="h-6 w-6" />
        )}
      </button>

      {/* Calendar Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="fixed bottom-44 right-6 z-[99] w-80 rounded-3xl border border-white/10 bg-navy-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header with date and time */}
            <div className="p-5 bg-gradient-to-br from-saffron-600 via-saffron-500 to-india-600 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-wider">Live Calendar</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono font-bold tabular-nums">{timeStr}</span>
                </div>
              </div>

              <div className="text-3xl font-black mb-1">{now.getDate()}</div>
              <div className="text-sm font-semibold opacity-90">{dateStr}</div>
              <div className="mt-2 text-xs opacity-70 font-hindi">{hindiDate}</div>

              <div className="mt-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider opacity-80">
                <span>Vikram Samvat: {vikramSamvat}</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="flex items-center gap-1"><WeatherIcon className="h-3 w-3" /> {weather.label}</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <div className="text-sm font-bold text-white">{monthNames[viewMonth]} {viewYear}</div>
                  <div className="text-[10px] text-navy-400 font-hindi">{hindiMonths[viewMonth]} {vikramSamvat}</div>
                </div>
                <button onClick={nextMonth} className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {hindiDays.map((d, i) => (
                  <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-saffron-400">
                    {d}
                    <div className="text-navy-500 text-[8px]">{dayNames[i]}</div>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {emptyCells.map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {calendarDays.map((day) => {
                  const today = isToday(viewYear, viewMonth, day);
                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                        today
                          ? "bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/30 scale-110"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="tabular-nums">{day}</span>
                      {today && <div className="h-1 w-1 rounded-full bg-white mt-0.5" />}
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); }}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[10px] font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-saffron-500 px-3 py-2 text-[10px] font-bold text-white hover:bg-saffron-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Footer with Indian holidays placeholder */}
            <div className="px-4 pb-4">
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-saffron-300 mb-1">Upcoming</div>
                <div className="text-xs text-navy-200">
                  🇮 Republic Day · 26 January
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
