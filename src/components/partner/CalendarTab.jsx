import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DAYS   = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function daysInMonth(y, m)  { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y, m)     { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

export default function CalendarTab() {
  const { t } = useLang();
  const now   = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [busy,  setBusy]  = useState(new Set());

  const days  = daysInMonth(year, month);
  const start = firstDay(year, month);
  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const toggleDay = (d) => {
    const key = `${year}-${month}-${d}`;
    setBusy(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  const busyCount = [...busy].filter(k => k.startsWith(`${year}-${month}`)).length;
  const freeCount = days - busyCount;

  const prevMonth = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const nextMonth = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-2">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: t.free, val: freeCount, color: '#00E5FF' },
          { label: t.busy, val: busyCount, color: '#FF5A00' },
        ].map(s => (
          <div key={s.label} className="bg-card-dark rounded-2xl p-4 text-center border border-white/5">
            <p className="font-black text-3xl" style={{ color: s.color }}>{s.val}</p>
            <p className="text-text-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar card */}
      <div className="bg-card-dark rounded-[28px] p-5 border border-white/5">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <motion.button onClick={prevMonth} whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-card-light flex items-center justify-center text-text-muted">
            <ChevronLeft size={18} />
          </motion.button>
          <h3 className="text-white font-black">{MONTHS[month]} {year}</h3>
          <motion.button onClick={nextMonth} whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-card-light flex items-center justify-center text-text-muted">
            <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-text-muted text-[10px] font-semibold py-1">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: start }, (_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const d = i + 1;
            const key = `${year}-${month}-${d}`;
            const isBusy = busy.has(key);
            const isToday = isCurrentMonth && d === today;
            const isPast  = isCurrentMonth && d < today;
            return (
              <motion.button
                key={d}
                onClick={() => !isPast && toggleDay(d)}
                whileTap={!isPast ? { scale: 0.85 } : {}}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all
                  ${isPast ? 'text-white/15 cursor-not-allowed' : 'cursor-pointer'}
                  ${isBusy ? 'bg-blazing-orange text-white' : ''}
                  ${isToday && !isBusy ? 'ring-2 ring-glacial-cyan text-glacial-cyan bg-glacial-cyan/10' : ''}
                  ${!isBusy && !isToday && !isPast ? 'text-text-light hover:bg-card-light' : ''}
                `}
              >
                {d}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-5 mt-4 pt-4 border-t border-white/5">
          {[
            { color: '#00E5FF', label: 'Сегодня' },
            { color: '#FF5A00', label: t.busy },
            { color: 'rgba(255,255,255,0.1)', label: t.free },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md" style={{ background: l.color }} />
              <span className="text-text-muted text-xs">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-text-muted text-xs text-center mt-4">Нажмите на дату, чтобы отметить занятость</p>
    </div>
  );
}
