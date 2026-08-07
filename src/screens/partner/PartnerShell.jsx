import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Toast } from '../../components/ui';
import OrdersTab   from '../../components/partner/OrdersTab';
import ScannerTab  from '../../components/partner/ScannerTab';
import CalendarTab from '../../components/partner/CalendarTab';
import FinanceTab  from '../../components/partner/FinanceTab';
import { ClipboardList, QrCode, CalendarDays, BarChart3, LogOut, Globe } from 'lucide-react';
import { PARTNER_TYPE_MAP } from '../onboarding/RoleSelectScreen';

/* ── Default fallback if partnerType not set yet ─────────────── */
const DEFAULT_TYPE = {
  emoji: '🏢', color: '#FF5A00', label: 'Партнёр', sub: 'Partner',
};

export default function PartnerShell() {
  const { t, lang, changeLang, LANGS } = useLang();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [langOpen, setLangOpen] = useState(false);

  const partner      = state.partnerUser;
  const pendingCount = state.bookings.filter(b => b.status === 'pending').length;

  // Resolve the business type info
  const pType = PARTNER_TYPE_MAP[state.partnerType] || DEFAULT_TYPE;

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const NAV = [
    { id: 'orders',   Icon: ClipboardList, label: t.navOrders,   badge: pendingCount },
    { id: 'scanner',  Icon: QrCode,        label: t.navScanner  },
    { id: 'calendar', Icon: CalendarDays,  label: t.navCalendar },
    { id: 'finance',  Icon: BarChart3,     label: t.navFinance  },
  ];

  const TITLES = {
    orders:   t.incomingOrders,
    scanner:  t.scannerTitle,
    calendar: t.availability,
    finance:  t.financeTitle,
  };

  return (
    <div className="tap-screen relative">
      <Toast toast={state.toast} />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 px-4 pt-safe pt-4 pb-3
        border-b border-white/5 flex-shrink-0">

        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Business type avatar */}
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${pType.color}20`, border: `1.5px solid ${pType.color}30` }}
          >
            {pType.emoji}
          </div>

          {/* Name + type */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{partner.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full truncate"
                style={{ background: `${pType.color}20`, color: pType.color }}>
                {pType.label}
              </span>
              <span className="text-text-muted text-[10px] flex-shrink-0">· TAP Partner</span>
            </div>
          </div>
        </div>

        {/* Right side: Language picker + Wallet + Exit button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Lang picker */}
          <div className="relative">
            <button onClick={() => setLangOpen(v => !v)}
              className="text-[10px] bg-card-mid text-text-light px-2 py-1 rounded-xl
                border border-white/10 font-bold hover:bg-card-light transition-colors">
              {LANGS.find(l => l.code === lang)?.label ?? 'РУС'}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div className="absolute right-0 top-8 bg-card-mid border border-white/10 rounded-2xl
                  overflow-hidden z-50 min-w-[70px] shadow-glass"
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}>
                  {LANGS.map(({ code, label }) => (
                    <button key={code} onClick={() => { changeLang(code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[10px] font-semibold transition-colors ${
                        lang === code ? 'text-blazing-orange font-bold' : 'text-text-light hover:bg-card-light'}`}>
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Exit / Logout button for Partner */}
          <motion.button
            onClick={handleLogout}
            whileTap={{ scale: 0.88 }}
            title="Exit / Logout"
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-card-dark border border-white/10
              text-text-muted hover:text-white hover:border-white/20 transition-colors text-[10px] font-semibold"
          >
            <LogOut size={12} />
            <span>{t.exit || 'Выход'}</span>
          </motion.button>
        </div>
      </div>

      {/* ── Active orders quick-badge ─────────────────────── */}
      {pendingCount > 0 && (
        <motion.div
          className="mx-4 mt-2 flex-shrink-0 flex items-center gap-2 px-4 py-2.5
            rounded-2xl border"
          style={{ background: `${pType.color}12`, borderColor: `${pType.color}30` }}
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: pType.color }} />
          <p className="text-sm font-bold" style={{ color: pType.color }}>
            {pendingCount} {t.newOrdersAlert || 'новых заявок требуют ответа'}
          </p>
        </motion.div>
      )}

      {/* ── Page Title ──────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0 flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.h2 key={activeTab} className="text-white font-black text-xl"
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}>
            {TITLES[activeTab]}
          </motion.h2>
        </AnimatePresence>

        {/* TAP Wallet Display */}
        <div className="text-right">
          <span className="text-glacial-cyan font-black text-sm">{state.wallet.toLocaleString('ru')} ₸</span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          className="flex-1 overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}>
          {activeTab === 'orders'   && <OrdersTab />}
          {activeTab === 'scanner'  && <ScannerTab />}
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'finance'  && <FinanceTab />}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Nav ──────────────────────────────────────── */}
      <nav className="bottom-nav">
        {NAV.map(({ id, Icon, label, badge }) => {
          const active = activeTab === id;
          return (
            <motion.button key={id} onClick={() => setActiveTab(id)}
              className="nav-item relative" whileTap={{ scale: 0.88 }}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                active ? '' : 'bg-transparent'
              }`}
              style={active ? { background: pType.color, boxShadow: `0 4px 16px ${pType.color}50` } : {}}>
                <Icon size={20} className={active ? 'text-white' : 'text-text-muted'} />
              </div>
              {badge > 0 && (
                <div className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-red-500
                  flex items-center justify-center">
                  <span className="text-white text-[9px] font-black">{badge}</span>
                </div>
              )}
              <span className={`text-[10px] font-semibold transition-colors ${
                active ? '' : 'text-text-muted'
              }`} style={active ? { color: pType.color } : {}}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
