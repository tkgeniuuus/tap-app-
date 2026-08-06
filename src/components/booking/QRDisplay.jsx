import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Seeded random for deterministic QR grid
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default function QRDisplay({ hash, onClose }) {
  const GRID = 21;
  const rand = useMemo(() => seededRandom(stringToSeed(hash || 'TAP')), [hash]);
  const bits = useMemo(() => Array.from({ length: GRID * GRID }, () => rand() > 0.42), [rand]);

  // Force corner finder patterns
  const isFinderPattern = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= GRID - 7) || (r >= GRID - 7 && c < 7);
  const isFinderEdge = (r, c) =>
    (r === 0 || r === 6) && c < 7 ||
    (c === 0 || c === 6) && r < 7 ||
    (r === 0 || r === 6) && c >= GRID - 7 ||
    (c === GRID - 7 || c === GRID - 1) && r < 7 ||
    (r === GRID - 7 || r === GRID - 1) && c < 7 ||
    (c === 0 || c === 6) && r >= GRID - 7;

  const cellSize = 6.5;
  const totalSize = GRID * cellSize;

  return (
    <div className="flex flex-col items-center py-4">
      <motion.div
        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="text-4xl">✅</span>
      </motion.div>
      <h3 className="text-white font-black text-xl mb-1">Бронь подтверждена!</h3>
      <p className="text-text-muted text-sm mb-5 text-center">
        Покажите QR-код водителю / организатору
      </p>

      {/* QR grid */}
      <motion.div
        className="bg-white p-4 rounded-2xl mb-5"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <svg
          width={totalSize + 16} height={totalSize + 16}
          viewBox={`0 0 ${totalSize + 16} ${totalSize + 16}`}
        >
          <rect width="100%" height="100%" fill="white" rx="8" />
          {bits.map((on, i) => {
            const r = Math.floor(i / GRID);
            const c = i % GRID;
            const fp = isFinderPattern(r, c);
            const fe = isFinderEdge(r, c);
            const color = fp ? (fe ? '#0F141C' : r < 3 && c < 3 ? '#FF5A00' : '#0F141C') : on ? '#0F141C' : 'transparent';
            if (!fp && !on) return null;
            return (
              <rect
                key={i}
                x={c * cellSize + 8}
                y={r * cellSize + 8}
                width={cellSize - 0.8}
                height={cellSize - 0.8}
                fill={color}
                rx={fp ? 0.5 : 1}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Hash code */}
      <div className="bg-card-dark rounded-2xl px-5 py-3 mb-5 w-full text-center border border-white/5">
        <p className="text-text-muted text-[10px] mb-1 uppercase tracking-widest">Код бронирования</p>
        <p className="text-glacial-cyan font-mono font-bold tracking-widest text-sm">
          {hash || '---'}
        </p>
      </div>

      <div className="w-full bg-glacial-cyan/10 border border-glacial-cyan/20 rounded-2xl p-3 mb-5 flex items-center gap-2">
        <span className="text-xl">🔒</span>
        <div>
          <p className="text-glacial-cyan font-semibold text-xs">Средства в эскроу TAP</p>
          <p className="text-text-muted text-[10px]">Разблокируются после подтверждения QR-кода</p>
        </div>
      </div>

      <button onClick={onClose} className="tap-btn-ghost w-full">Закрыть</button>
    </div>
  );
}
