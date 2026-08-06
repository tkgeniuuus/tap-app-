import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { Check, X, CheckCircle2, XCircle, Clock } from 'lucide-react';

const STATUS = {
  pending:   { color: '#FF8A00', Icon: Clock,         label: 'Ожидает'    },
  confirmed: { color: '#00E5FF', Icon: CheckCircle2,  label: 'Принят'     },
  rejected:  { color: '#EF4444', Icon: XCircle,       label: 'Отклонён'   },
  completed: { color: '#10B981', Icon: CheckCircle2,  label: 'Завершён'   },
};

function OrderCard({ booking }) {
  const { t } = useLang();
  const { dispatch, showToast } = useApp();
  const s = STATUS[booking.status] || STATUS.pending;

  const accept = () => { dispatch({ type: 'ACCEPT_ORDER', payload: booking.id }); showToast(`✅ ${t.accept}: ${booking.touristName}`); };
  const reject = () => { dispatch({ type: 'REJECT_ORDER', payload: booking.id }); showToast(`❌ Заказ отклонён`, 'error'); };

  return (
    <motion.div
      className="bg-card-dark rounded-[24px] p-4 mb-3 border border-white/5"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-card-light flex items-center justify-center text-xl">
            {booking.touristEmoji}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{booking.touristName}</p>
            <div className="flex items-center gap-1" style={{ color: s.color }}>
              <s.Icon size={11} />
              <span className="text-xs font-semibold">{s.label}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-glacial-cyan font-black">{booking.totalAmount?.toLocaleString('ru')} ₸</p>
          <p className="text-text-muted text-xs">{booking.seats} мест</p>
        </div>
      </div>

      {/* Route pill */}
      <div className="bg-card-light rounded-2xl px-3 py-2 flex items-center gap-2 mb-3">
        <span className="text-sm">📍</span>
        <div className="flex-1">
          <p className="text-white text-xs font-semibold">{booking.from} → {booking.to}</p>
          <p className="text-text-muted text-[10px]">{booking.date}</p>
        </div>
      </div>

      {/* Financial split */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Выручка',       val: booking.totalAmount,   color: 'text-white'        },
          { label: 'Комиссия TAP',  val: booking.platformFee,   color: 'text-blazing-orange' },
          { label: 'Вам (90%)',     val: booking.partnerAmount, color: 'text-glacial-cyan'  },
        ].map(row => (
          <div key={row.label} className="bg-card-light rounded-xl p-2 text-center">
            <p className="text-text-muted text-[9px] mb-0.5">{row.label}</p>
            <p className={`font-bold text-xs ${row.color}`}>{row.val?.toLocaleString('ru')} ₸</p>
          </div>
        ))}
      </div>

      {/* QR hash */}
      <div className="bg-card-light rounded-xl px-3 py-2 mb-3">
        <p className="text-text-muted text-[9px] font-mono truncate">{booking.qrCodeHash}</p>
      </div>

      {/* Actions */}
      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <motion.button onClick={accept} whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 rounded-2xl bg-glacial-cyan text-midnight-ink font-black text-sm flex items-center justify-center gap-1.5">
            <Check size={16} /> {t.accept}
          </motion.button>
          <motion.button onClick={reject} whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 rounded-2xl bg-card-light text-text-muted font-semibold text-sm flex items-center justify-center gap-1.5">
            <X size={16} /> {t.reject}
          </motion.button>
        </div>
      )}
      {booking.status === 'confirmed' && (
        <div className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-glacial-cyan/10 border border-glacial-cyan/20">
          <CheckCircle2 size={15} className="text-glacial-cyan" />
          <span className="text-glacial-cyan font-bold text-sm">Заказ принят</span>
        </div>
      )}
      {booking.status === 'completed' && (
        <div className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-green-500/10 border border-green-500/20">
          <CheckCircle2 size={15} className="text-green-400" />
          <span className="text-green-400 font-bold text-sm">Завершено · Оплата зачислена</span>
        </div>
      )}
    </motion.div>
  );
}

export default function OrdersTab() {
  const { t } = useLang();
  const { state } = useApp();

  const pending   = state.bookings.filter(b => b.status === 'pending');
  const history   = state.bookings.filter(b => b.status !== 'pending');

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4">
      {pending.length > 0 && (
        <>
          <div className="flex items-center gap-2 py-3">
            <div className="w-2 h-2 rounded-full bg-blazing-orange animate-pulse" />
            <p className="text-white font-bold text-sm">Новые запросы ({pending.length})</p>
          </div>
          {pending.map(b => <OrderCard key={b.id} booking={b} />)}
        </>
      )}
      {history.length > 0 && (
        <>
          <p className="text-text-muted font-semibold text-sm py-3">История</p>
          {history.map(b => <OrderCard key={b.id} booking={b} />)}
        </>
      )}
      {state.bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-text-muted">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm">{t.noOrders}</p>
        </div>
      )}
    </div>
  );
}
