import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Compass, Map, Shield, Zap, LogOut } from 'lucide-react';

const SLIDES = [
  { icon: <Map size={26} className="text-glacial-cyan" />,     key: 'feat1', color: '#00E5FF' },
  { icon: <Zap size={26} className="text-blazing-orange" />,   key: 'feat2', color: '#FF5A00' },
  { icon: <Shield size={26} className="text-green-400" />,     key: 'feat3', color: '#10B981' },
];

export default function WelcomeScreen({ onNext }) {
  const { t, lang, changeLang, LANGS } = useLang();
  const { dispatch } = useApp();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 3200);
    return () => clearInterval(iv);
  }, []);

  // Hard reset — clears all localStorage and reloads
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="tap-screen flex flex-col bg-midnight-ink overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-80 h-80 rounded-full bg-blazing-orange/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-15%] w-64 h-64 rounded-full bg-glacial-cyan/8 blur-3xl" />
      </div>

      {/* Top bar: lang selector + logout */}
      <div className="flex items-center justify-between px-5 pt-safe pt-5 pb-2 relative z-10">
        {/* Lang pills */}
        <div className="flex gap-1.5">
          {LANGS.map(({ code, label }) => (
            <motion.button key={code} onClick={() => changeLang(code)}
              whileTap={{ scale: 0.88 }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                lang === code
                  ? 'bg-blazing-orange text-white'
                  : 'bg-white/5 text-text-muted hover:bg-white/10'
              }`}>
              {label}
            </motion.button>
          ))}
        </div>

        {/* Small logout / exit button */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.88 }}
          title="Reset & Exit"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5
            text-text-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={12} />
          <span className="text-[10px] font-semibold">Exit</span>
        </motion.button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
        {/* Logo */}
        <motion.div
          className="w-20 h-20 rounded-[28px] bg-blazing-orange flex items-center justify-center mb-8"
          style={{ boxShadow: '0 8px 40px rgba(255,90,0,0.5)' }}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Compass size={40} className="text-white" />
        </motion.div>

        {/* ── NEW SLOGAN ── */}
        <motion.div
          initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}>
          <h1 className="text-5xl font-black text-white tracking-tight leading-[1.1] mb-3">
            TAP into the<br />future of travel.
          </h1>
          <p className="text-text-muted text-base mb-10">
            The Digital Tourism Ecosystem.
          </p>
        </motion.div>

        {/* Feature slide */}
        <div className="rounded-[24px] p-4 mb-6 min-h-[72px] flex items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">
            <motion.div key={slide} className="flex items-center gap-4 w-full"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${SLIDES[slide].color}18` }}>
                {SLIDES[slide].icon}
              </div>
              <p className="text-white font-semibold text-sm leading-snug">{t[SLIDES[slide].key]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-10">
          {SLIDES.map((s, i) => (
            <motion.div key={i} className="h-1 rounded-full"
              animate={{
                width: i === slide ? 24 : 8,
                background: i === slide ? SLIDES[i].color : 'rgba(255,255,255,0.2)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-safe pb-10 relative z-10">
        <motion.button
          onClick={onNext}
          className="w-full py-5 rounded-[32px] bg-blazing-orange text-white font-black text-lg
            flex items-center justify-center gap-3"
          style={{ boxShadow: '0 8px 32px rgba(255,90,0,0.45)' }}
          whileTap={{ scale: 0.97 }}
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {t.getStarted} →
        </motion.button>
        <p className="text-center text-text-muted text-xs mt-4">
          Жетісу · Алматы · Алаколь · Шарын · Алтын-Эмель
        </p>
      </div>
    </div>
  );
}
