import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Toast } from '../../components/ui';
import OrdersTab   from '../../components/partner/OrdersTab';
import ScannerTab  from '../../components/partner/ScannerTab';
import CalendarTab from '../../components/partner/CalendarTab';
import FinanceTab  from '../../components/partner/FinanceTab';
import { ClipboardList, QrCode, CalendarDays, BarChart3 } from 'lucide-react';
import { PARTNER_TYPE_MAP } from '../onboarding/RoleSelectScreen';

/* ── Default fallback if partnerType not set yet ─────────────── */
const DEFAULT_TYPE = {
  emoji: '🏢', color: '#FF5A00', label: 'Партнёр', sub: 'Partner',
};

export default function PartnerShell() {
  const { t } = useLang();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('orders');

  const partner      = state.partnerUser;
  const pendingCount = state.bookings.filter(b => b.status === 'pending').length;

  // Resolve the business type info
  const pType = PARTNER_TYPE_MAP[state.partnerType] || DEFAULT_TYPE;

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
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3
        border-b border-white/5 flex-shrink-0">

        {/* Business type avatar — color matches chosen type */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${pType.color}20`, border: `1.5px solid ${pType.color}30` }}
        >
          {pType.emoji}
        </div>

        {/* Name + type */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{partner.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `${pType.color}20`, color: pType.color }}>
              {pType.label}
            </span>
            <span className="text-text-muted text-[10px]">· TAP Partner</span>
          </div>
        </div>

        {/* Wallet */}
        <div className="text-right flex-shrink-0">
          <p className="text-glacial-cyan font-black text-sm">{state.wallet.toLocaleString('ru')} ₸</p>
          <p className="text-text-muted text-[10px]">TAP Wallet</p>
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
            {pendingCount} новых {pendingCount === 1 ? 'заявка' : 'заявки'} — требуют ответа
          </p>
        </motion.div>
      )}

      {/* ── Page Title ──────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.h2 key={activeTab} className="text-white font-black text-xl"
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}>
            {TITLES[activeTab]}
          </motion.h2>
        </AnimatePresence>
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
