import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { Camera, Zap, CheckCircle2, X } from 'lucide-react';

export default function ScannerTab() {
  const { t } = useLang();
  const { state, dispatch, showToast } = useApp();
  const [phase, setPhase]   = useState('idle'); // idle | scanning | success | error
  const [result, setResult] = useState(null);
  const html5Ref = useRef(null);
  const mountRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => html5Ref.current?.stop().catch(() => {}), []);

  const startCamera = async () => {
    setPhase('scanning');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!mountRef.current) return;
      html5Ref.current = new Html5Qrcode('tap-qr-reader');
      await html5Ref.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decoded) => {
          html5Ref.current?.stop().catch(() => {});
          handleSuccess(decoded);
        },
        () => {} // suppress scan errors
      );
    } catch {
      setPhase('error');
    }
  };

  const stopCamera = () => {
    html5Ref.current?.stop().catch(() => {});
    html5Ref.current = null;
    setPhase('idle');
  };

  const handleSuccess = (hash) => {
    dispatch({ type: 'COMPLETE_BY_QR', payload: { qrHash: hash } });
    setResult(hash);
    setPhase('success');
    showToast(t.scanSuccess);
  };

  const simulate = () => {
    stopCamera();
    const confirmed = state.bookings.find(b => b.status === 'confirmed');
    const hash = confirmed?.qrCodeHash || `TAP-SIM-${Date.now().toString(36).toUpperCase()}`;
    setPhase('scanning');
    setTimeout(() => handleSuccess(hash), 1200);
  };

  const reset = () => { setPhase('idle'); setResult(null); };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-2">
      <p className="text-text-muted text-sm mb-4">Сканируйте QR-код туриста для разблокировки оплаты</p>

      <AnimatePresence mode="wait">
        {phase !== 'success' ? (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Viewfinder */}
            <div className="bg-card-dark rounded-[28px] overflow-hidden mb-4 relative">
              {phase === 'scanning' ? (
                <div ref={mountRef}>
                  <div id="tap-qr-reader" className="w-full" style={{ minHeight: 260 }} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 px-4">
                  {/* Animated frame */}
                  <div className="relative w-52 h-52 mb-6">
                    <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                    {/* Corner accents */}
                    {[
                      'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                      'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                      'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                      'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
                    ].map((cls, i) => (
                      <div key={i} className={`absolute w-8 h-8 border-glacial-cyan ${cls}`} />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera size={44} className="text-text-muted/50" />
                    </div>
                    {/* Scan line */}
                    <motion.div
                      className="absolute left-3 right-3 h-px bg-glacial-cyan"
                      style={{ boxShadow: '0 0 8px #00E5FF' }}
                      animate={{ top: ['20%', '75%', '20%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <p className="text-text-muted text-sm text-center">Наведите камеру на QR-код туриста</p>
                </div>
              )}
            </div>

            {phase === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 mb-4 text-red-400 text-sm text-center">
                Камера недоступна. Используйте симуляцию ↓
              </div>
            )}

            <div className="flex flex-col gap-3">
              {phase === 'idle' || phase === 'error' ? (
                <motion.button onClick={startCamera} whileTap={{ scale: 0.97 }}
                  className="tap-btn-primary w-full flex items-center justify-center gap-2">
                  <Camera size={18} /> {t.scanGrant}
                </motion.button>
              ) : (
                <motion.button onClick={stopCamera} whileTap={{ scale: 0.97 }}
                  className="tap-btn-ghost w-full flex items-center justify-center gap-2">
                  <X size={18} /> Остановить камеру
                </motion.button>
              )}
              <motion.button onClick={simulate} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl border border-white/10 text-text-light font-semibold text-sm
                  flex items-center justify-center gap-2 transition-colors hover:bg-card-light">
                <Zap size={18} className="text-blazing-orange" /> {t.simulateScan}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="bg-card-dark rounded-[28px] p-6 flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring' }}
            >
              <CheckCircle2 size={40} className="text-green-400" />
            </motion.div>
            <h3 className="text-white font-black text-xl mb-1">QR подтверждён!</h3>
            <p className="text-text-muted text-sm mb-4 text-center">{t.scanSuccess}</p>
            <div className="bg-card-light rounded-2xl px-4 py-2 mb-5 w-full text-center">
              <p className="text-glacial-cyan font-mono text-xs font-bold">{result}</p>
            </div>
            <div className="bg-glacial-cyan/10 border border-glacial-cyan/20 rounded-2xl p-4 w-full mb-5">
              <p className="text-glacial-cyan font-bold text-center text-sm">💳 90% суммы зачислено на баланс</p>
            </div>
            <button onClick={reset} className="tap-btn-ghost w-full">Сканировать ещё</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
