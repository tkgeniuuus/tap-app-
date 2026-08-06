import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

function BarChart({ bookings }) {
  const items = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').slice(-8);
  const maxVal = Math.max(...items.map(b => b.partnerAmount || 0), 1);
  if (!items.length) return (
    <div className="h-24 flex items-center justify-center text-text-muted text-sm">
      Нет завершённых поездок
    </div>
  );
  return (
    <div className="flex items-end gap-2 h-20 px-2">
      {items.map((b, i) => (
        <motion.div
          key={b.id}
          className="flex-1 rounded-t-lg"
          style={{ background: 'linear-gradient(to top, #FF5A00, #FF8A42)' }}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(((b.partnerAmount || 0) / maxVal) * 64, 4)}px` }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
          title={`${b.partnerAmount?.toLocaleString('ru')} ₸`}
        />
      ))}
    </div>
  );
}

export default function FinanceTab() {
  const { t } = useLang();
  const { state, showToast } = useApp();
  const [withdrawing, setWithdrawing] = useState(false);

  const completed = state.bookings.filter(b => b.status === 'completed' || b.status === 'confirmed');
  const totalRevenue = completed.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const tapFee       = Math.round(totalRevenue * 0.1);
  const netPayout    = totalRevenue - tapFee;

  const withdraw = () => {
    if (netPayout === 0) return showToast('Нет средств для вывода', 'info');
    setWithdrawing(true);
    setTimeout(() => { setWithdrawing(false); showToast(t.withdrawSuccess); }, 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-2">
      {/* Wallet hero */}
      <div className="bg-card-dark rounded-[28px] p-5 mb-4 border border-white/5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blazing-orange/8 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-1 relative z-10">
          <p className="text-text-muted text-sm">Общий баланс (TAP Wallet)</p>
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
            <TrendingUp size={12} /> +12%
          </div>
        </div>
        <p className="text-white font-black text-4xl relative z-10 mb-4">
          {state.wallet.toLocaleString('ru')} <span className="text-2xl text-text-muted">₸</span>
        </p>
        <div className="grid grid-cols-2 gap-2 relative z-10">
          {[
            { label: 'Поездок', val: state.partnerUser.completedRides + completed.length },
            { label: 'Рейтинг',  val: `⭐ ${state.partnerUser.rating}` },
          ].map(s => (
            <div key={s.label} className="bg-card-light rounded-2xl p-3 text-center">
              <p className="text-text-muted text-[10px]">{s.label}</p>
              <p className="text-white font-black text-lg">{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: t.totalRevenue, val: `${totalRevenue.toLocaleString('ru')} ₸`, color: '#00E5FF', icon: '💰' },
          { label: t.tapCommission, val: `${tapFee.toLocaleString('ru')} ₸`,      color: '#FF5A00', icon: '💸' },
        ].map(k => (
          <div key={k.label} className="bg-card-dark rounded-[24px] p-4 border border-white/5">
            <span className="text-xl">{k.icon}</span>
            <p className="text-text-muted text-[10px] mt-1 uppercase tracking-wide">{k.label}</p>
            <p className="font-black text-xl mt-0.5" style={{ color: k.color }}>{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-card-dark rounded-[24px] p-4 mb-4 border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm mb-0.5">{t.netPayout}</p>
          <p className="text-glacial-cyan font-black text-2xl">{netPayout.toLocaleString('ru')} ₸</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-glacial-cyan/15 flex items-center justify-center">
          <ArrowUpRight size={22} className="text-glacial-cyan" />
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-card-dark rounded-[24px] p-4 mb-4 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-bold text-sm">Динамика выручки</p>
          <span className="text-text-muted text-xs">Поездки</span>
        </div>
        <BarChart bookings={state.bookings} />
      </div>

      {/* Transaction list */}
      <div className="bg-card-dark rounded-[24px] p-4 mb-4 border border-white/5">
        <p className="text-white font-bold text-sm mb-3">История транзакций</p>
        {completed.map(b => (
          <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center text-sm">✅</div>
              <div>
                <p className="text-white text-xs font-semibold">{b.touristName}</p>
                <p className="text-text-muted text-[10px]">{b.from} → {b.to}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-glacial-cyan font-bold text-sm">+{b.partnerAmount?.toLocaleString('ru')} ₸</p>
              <p className="text-text-muted text-[10px]">{b.date}</p>
            </div>
          </div>
        ))}
        {completed.length === 0 && (
          <p className="text-text-muted text-sm text-center py-4">Нет транзакций</p>
        )}
      </div>

      {/* Withdraw button */}
      <motion.button
        onClick={withdraw}
        disabled={withdrawing}
        className={`w-full py-4 rounded-[28px] font-black text-white text-base flex items-center justify-center gap-3
          transition-all ${withdrawing ? 'opacity-60' : ''}`}
        style={{ background: 'linear-gradient(135deg, #FF5A00, #FF8A42)', boxShadow: '0 8px 32px rgba(255,90,0,0.4)' }}
        whileTap={{ scale: 0.97 }}
      >
        {withdrawing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Обработка...
          </>
        ) : t.withdraw}
      </motion.button>
    </div>
  );
}
