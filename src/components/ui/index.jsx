import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

// ─── Modal / Bottom Sheet ────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-[480px] bg-card-mid border-t border-white/5
              rounded-t-[32px] p-6 pb-8 z-10 max-h-[92vh] overflow-y-auto"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } }}
            exit={{ y: '100%', opacity: 0, transition: { duration: 0.22 } }}
            onClick={e => e.stopPropagation()}
          >
            {/* drag handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
            {title && (
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-card-light
                    text-text-muted hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const BottomSheet = Modal;

// ─── Toast ──────────────────────────────────────────────────
export function Toast({ toast }) {
  const icons = {
    success: <CheckCircle2 size={16} className="text-glacial-cyan flex-shrink-0" />,
    error:   <AlertCircle  size={16} className="text-red-400 flex-shrink-0" />,
    info:    <Info         size={16} className="text-blazing-orange flex-shrink-0" />,
  };
  const borders = {
    success: 'border-glacial-cyan/30',
    error:   'border-red-500/30',
    info:    'border-blazing-orange/30',
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.msg}
          className={`fixed top-6 left-1/2 z-[100] max-w-[340px] w-[88vw]
            bg-card-dark border rounded-2xl px-4 py-3 shadow-glass flex items-center gap-3
            ${borders[toast.type] || borders.success}`}
          style={{ x: '-50%' }}
          initial={{ y: -24, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          {icons[toast.type] || icons.success}
          <p className="text-sm font-semibold text-white">{toast.msg}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Badge pill ──────────────────────────────────────────────
export function Badge({ label, color = '#00E5FF' }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: `${color}22`, color }}
    >
      {label}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────
export function StatCard({ icon, label, value, accent = '#00E5FF', sub }) {
  return (
    <div className="bg-card-dark rounded-[28px] p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-black" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-text-muted">{sub}</p>}
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────
export function Avatar({ emoji, size = 40, ring = false }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-card-mid flex-shrink-0
        ${ring ? 'ring-2 ring-glacial-cyan ring-offset-2 ring-offset-midnight-ink' : ''}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {emoji}
    </div>
  );
}

// ─── Segmented Control ───────────────────────────────────────
export function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex bg-card-dark rounded-2xl p-1 gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-200
            ${value === opt.value ? 'bg-card-light text-white' : 'text-text-muted'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Seat Progress Bar ───────────────────────────────────────
export function SeatBar({ booked, total }) {
  const pct = total > 0 ? (booked / total) * 100 : 0;
  return (
    <div className="h-2 rounded-full bg-card-light overflow-hidden w-full">
      <motion.div
        className="h-full rounded-full bg-glacial-cyan"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────
export function SectionHeader({ title, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-base font-bold text-white">{title}</h3>
      {right}
    </div>
  );
}

// ─── Tab transition wrapper ───────────────────────────────────
export function TabPane({ children, tabKey }) {
  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
