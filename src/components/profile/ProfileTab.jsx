import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { Modal } from '../ui';
import { ShieldAlert, Navigation, Clock, CheckCircle2, LogOut } from 'lucide-react';

const SIM_COORDS = { lat: 43.2380, lng: 79.1234, elev: 1842 };

export default function ProfileTab() {
  const { t } = useLang();
  const { state, dispatch, showToast } = useApp();
  const [sosOpen, setSosOpen] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const user = state.user;
  const myBookings = state.myBookings || [];

  const sendSOS = () => {
    setSosSending(true);
    setTimeout(() => {
      setSosSending(false);
      setSosSent(true);
    }, 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
      {/* Profile card */}
      <div className="bg-card-dark rounded-[28px] p-5 mb-4 border border-white/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blazing-orange flex items-center justify-center text-3xl">
            {user.avatar || '👩'}
          </div>
          <div>
            <p className="text-white font-black text-lg">{user.name}</p>
            <p className="text-text-muted text-sm">{user.tripsCount} {t.tripsCompleted}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-yellow-400">★</span>
              <span className="text-white font-bold text-sm">{user.rating}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-2">{t.badges}</p>
        <div className="flex flex-wrap gap-1.5">
          {user.badges.map(b => (
            <motion.div
              key={b.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: `${b.color}20`, color: b.color }}
              whileHover={{ scale: 1.05 }}
            >
              {b.icon} {b.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wallet */}
      <div className="bg-card-dark rounded-[28px] p-5 mb-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-muted text-xs">{t.myBalance}</p>
            <p className="text-glacial-cyan font-black text-2xl mt-0.5">
              {user.wallet.toLocaleString('ru')} ₸
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-glacial-cyan/10 flex items-center justify-center text-2xl">
            💳
          </div>
        </div>
      </div>

      {/* My Bookings */}
      {myBookings.length > 0 && (
        <div className="mb-4">
          <p className="text-white font-bold text-base mb-3">{t.myBookings}</p>
          {myBookings.map(bk => (
            <div key={bk.id} className="bg-card-dark rounded-2xl p-4 mb-2 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{bk.from} → {bk.to}</p>
                <p className="text-text-muted text-xs">{bk.date} · {bk.seats} мест</p>
              </div>
              <div className="text-right">
                <p className="text-glacial-cyan font-bold text-sm">{bk.totalAmount?.toLocaleString('ru')} ₸</p>
                <div className={`text-[10px] font-bold ${bk.status === 'completed' ? 'text-green-400' : 'text-blazing-orange'}`}>
                  {bk.status === 'completed' ? '✅ Завершено' : '⏳ Подтверждено'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <div className="flex justify-end mb-3">
        <motion.button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-dark
            border border-white/5 text-text-muted hover:text-white hover:border-white/20
            transition-colors text-xs font-semibold"
        >
          <LogOut size={13} />
          Exit
        </motion.button>
      </div>

      {/* SOS Button */}
      <motion.button
        onClick={() => setSosOpen(true)}
        className="w-full py-5 rounded-[28px] bg-red-600 text-white font-black text-lg
          flex items-center justify-center gap-3"
        style={{ boxShadow: '0 8px 32px rgba(255,34,34,0.4)' }}
        whileTap={{ scale: 0.97 }}
        animate={{ boxShadow: ['0 8px 32px rgba(255,34,34,0.4)', '0 8px 48px rgba(255,34,34,0.7)', '0 8px 32px rgba(255,34,34,0.4)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ShieldAlert size={26} />
        SOS ЭКСТРЕННАЯ СВЯЗЬ 112
      </motion.button>

      {/* SOS Modal */}
      <Modal open={sosOpen} onClose={() => { setSosOpen(false); setSosSent(false); setSosSending(false); }} title="🚨 Экстренный вызов">
        {!sosSent ? (
          <>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
              <p className="text-red-400 text-sm leading-relaxed">
                {t.sosDesc}
              </p>
            </div>
            <div className="bg-card-dark rounded-2xl p-4 mb-4">
              <p className="text-text-muted text-xs mb-2 uppercase tracking-wide">GPS-координаты (симуляция)</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-card-light rounded-xl p-2 text-center">
                  <p className="text-text-muted text-[10px]">Широта</p>
                  <p className="text-white font-mono font-bold text-xs">{SIM_COORDS.lat.toFixed(4)}</p>
                </div>
                <div className="bg-card-light rounded-xl p-2 text-center">
                  <p className="text-text-muted text-[10px]">Долгота</p>
                  <p className="text-white font-mono font-bold text-xs">{SIM_COORDS.lng.toFixed(4)}</p>
                </div>
                <div className="bg-card-light rounded-xl p-2 text-center">
                  <p className="text-text-muted text-[10px]">Высота</p>
                  <p className="text-white font-mono font-bold text-xs">{SIM_COORDS.elev}м</p>
                </div>
              </div>
            </div>
            <a
              href={`sms:112?body=SOS TAP Kazakhstan. Lat:${SIM_COORDS.lat} Lng:${SIM_COORDS.lng} Alt:${SIM_COORDS.elev}m`}
              onClick={sendSOS}
              className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-base
                flex items-center justify-center gap-2 mb-3 active:scale-97 transition-all"
              style={{ display: 'flex', textDecoration: 'none' }}
            >
              {sosSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                '📱 Отправить SOS в 112 (SMS)'
              )}
            </a>
            <button onClick={() => setSosOpen(false)} className="tap-btn-ghost w-full">
              {t.cancel}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center py-6">
            <motion.div
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
            >
              <CheckCircle2 size={36} className="text-green-400" />
            </motion.div>
            <h3 className="text-white font-black text-xl mb-2">SOS отправлен!</h3>
            <p className="text-text-muted text-sm text-center mb-6">
              Ваши координаты переданы в службу 112. Оставайтесь на месте.
            </p>
            <button onClick={() => { setSosOpen(false); setSosSent(false); }} className="tap-btn-primary w-full">
              Понятно
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
