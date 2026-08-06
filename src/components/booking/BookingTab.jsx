import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { Modal, SeatBar } from '../ui';
import { Star, MapPin, Clock, MessageCircle } from 'lucide-react';
import QRDisplay from './QRDisplay';

function TagBadge({ tag }) {
  if (!tag) return null;
  const styles = {
    HOT:     { bg: '#FF5A00', text: '🔥 HOT'    },
    FULL:    { bg: '#6B7280', text: '🚫 FULL'   },
    TOP:     { bg: '#7C3AED', text: '⭐ TOP'    },
    POPULAR: { bg: '#0EA5E9', text: '🌊 POPULAR'},
    NEW:     { bg: '#10B981', text: '✨ NEW'    },
  };
  const s = styles[tag] || { bg: '#8A94A6', text: tag };
  return (
    <span className="text-white text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: s.bg }}>
      {s.text}
    </span>
  );
}

// ─── Chat button (links to partner DM) ────────────────────────
function ChatBtn({ service, onChatWith }) {
  if (!service.partnerChatId || !onChatWith) return null;
  return (
    <motion.button
      onClick={() => onChatWith(service.partnerChatId, 'dms')}
      whileTap={{ scale: 0.92 }}
      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-card-light
        border border-white/5 text-glacial-cyan text-xs font-semibold transition-colors
        hover:bg-glacial-cyan/10"
    >
      <MessageCircle size={13} />
      Написать
    </motion.button>
  );
}

// ─── Transport Card ────────────────────────────────────────────
function TransportCard({ service, onBook, onChatWith }) {
  const { t } = useLang();
  const available = service.totalSeats - service.bookedSeats;
  const full = available <= 0;
  return (
    <motion.div className="bg-card-dark rounded-[28px] p-5 mb-3 border border-white/5" whileTap={{ scale: 0.99 }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{service.emoji}</span>
          <div>
            <p className="text-white font-bold text-sm">{service.vehicle}</p>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-text-muted text-xs">{service.driverRating} · {service.driver}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex justify-end mb-1"><TagBadge tag={service.tag} /></div>
          <p className="text-glacial-cyan font-black text-lg leading-none">{service.pricePerSeat.toLocaleString('ru')} ₸</p>
          <p className="text-text-muted text-[10px]">{t.pricePerSeat}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <MapPin size={11} className="text-glacial-cyan" />
        <span className="text-text-light text-xs font-semibold">{service.from} → {service.to}</span>
        <Clock size={10} className="text-text-muted ml-1" />
        <span className="text-text-muted text-xs">{service.date} · {service.departureTime}</span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-text-muted">{service.bookedSeats}/{service.totalSeats} {t.seatsLeft}</span>
          <span className={`font-bold ${full ? 'text-red-400' : 'text-glacial-cyan'}`}>
            {full ? 'Нет мест' : `${available} свободно`}
          </span>
        </div>
        <SeatBar booked={service.bookedSeats} total={service.totalSeats} />
      </div>
      <div className="flex gap-2">
        <motion.button onClick={() => !full && onBook(service)} disabled={full} whileTap={full ? {} : { scale: 0.97 }}
          className={`flex-1 py-3 rounded-2xl text-sm font-bold ${full ? 'bg-card-light text-text-muted' : 'bg-blazing-orange text-white shadow-orange'}`}>
          {full ? '🚫 Мест нет' : t.bookNow}
        </motion.button>
        <ChatBtn service={service} onChatWith={onChatWith} />
      </div>
    </motion.div>
  );
}

function HousingCard({ service, onBook, onChatWith }) {
  const { t } = useLang();
  return (
    <motion.div className="bg-card-dark rounded-[28px] p-5 mb-3 border border-white/5" whileTap={{ scale: 0.99 }}>
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-2xl bg-card-mid flex items-center justify-center text-3xl flex-shrink-0">{service.emoji}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <p className="text-white font-bold text-sm">{service.name}</p>
                <TagBadge tag={service.tag} />
              </div>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-text-muted text-xs">{service.rating} · {service.host}</span>
              </div>
            </div>
            <div className="text-right ml-2">
              <p className="text-glacial-cyan font-black">{service.price.toLocaleString('ru')} ₸</p>
              <p className="text-text-muted text-[10px]">{t.perNight}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin size={10} className="text-text-muted" />
            <span className="text-text-muted text-xs">{service.location}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {service.amenities?.map(a => (
              <span key={a} className="text-[10px] bg-card-light text-text-light px-2 py-0.5 rounded-full">{a}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <motion.button onClick={() => onBook(service)} whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-2xl bg-blazing-orange text-white font-bold text-sm shadow-orange">
          {t.bookNow}
        </motion.button>
        <ChatBtn service={service} onChatWith={onChatWith} />
      </div>
    </motion.div>
  );
}

function RentalCard({ service, onBook, onChatWith }) {
  const { t } = useLang();
  return (
    <motion.div className="bg-card-dark rounded-[28px] p-5 mb-3 border border-white/5" whileTap={{ scale: 0.99 }}>
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-card-mid flex items-center justify-center text-2xl flex-shrink-0">{service.emoji}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="text-white font-bold text-sm">{service.name}</p>
            <div className="text-right ml-2">
              <div className="flex justify-end mb-1"><TagBadge tag={service.tag} /></div>
              <p className="text-glacial-cyan font-black">{service.price.toLocaleString('ru')} ₸</p>
              <p className="text-text-muted text-[10px]">{t.perDay}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-text-muted text-xs">{service.rating} · {service.owner}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 bg-card-light rounded-xl px-3 py-1.5">
            <span className="text-xs text-blazing-orange font-semibold">🔒 {t.deposit}:</span>
            <span className="text-xs text-text-light">{service.deposit?.toLocaleString('ru')} ₸</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <motion.button onClick={() => onBook(service)} whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-2xl bg-blazing-orange text-white font-bold text-sm shadow-orange">
          {t.bookNow}
        </motion.button>
        <ChatBtn service={service} onChatWith={onChatWith} />
      </div>
    </motion.div>
  );
}

// ─── Booking Modal ─────────────────────────────────────────────
function BookingModal({ service, open, onClose, onChatWith }) {
  const { t } = useLang();
  const { dispatch, showToast } = useApp();
  const [seats,     setSeats]     = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [qrHash,    setQrHash]    = useState('');

  if (!service) return null;
  const available   = (service.totalSeats || 99) - (service.bookedSeats || 0);
  const isTransport = service.type === 'transport';
  const price    = service.pricePerSeat || service.price || 0;
  const subtotal = price * (isTransport ? seats : 1);
  const fee      = Math.round(subtotal * 0.1);
  const total    = subtotal + fee;

  const handleBook = () => {
    const hash = `TAP-${Date.now().toString(36).toUpperCase()}`;
    dispatch({ type: 'BOOK_SERVICE', payload: { serviceId: service.id, seats: isTransport ? seats : 1, totalAmount: total, platformFee: fee, partnerAmount: subtotal } });
    setQrHash(hash);
    setConfirmed(true);
    showToast(t.bookingConfirmed);
  };

  const handleClose = () => { setConfirmed(false); setSeats(1); setQrHash(''); onClose(); };

  const goToChat = () => {
    handleClose();
    if (onChatWith && service.partnerChatId) onChatWith(service.partnerChatId, 'dms');
  };

  return (
    <Modal open={open} onClose={handleClose} title={confirmed ? t.bookingQR : t.bookNow}>
      {!confirmed ? (
        <>
          <div className="flex items-center gap-3 bg-card-dark rounded-2xl p-3 mb-4">
            <span className="text-3xl">{service.emoji}</span>
            <div>
              <p className="text-white font-bold text-sm">{service.name || `${service.from} → ${service.to}`}</p>
              {service.date && <p className="text-text-muted text-xs">{service.date} · {service.departureTime}</p>}
            </div>
          </div>
          {isTransport && (
            <div className="mb-4">
              <p className="text-text-muted text-xs mb-2">{t.yourSeats}</p>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: Math.max(available, 1) }, (_, i) => i + 1).map(n => (
                  <motion.button key={n} onClick={() => setSeats(n)} whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-xl font-bold text-sm ${seats === n ? 'bg-blazing-orange text-white' : 'bg-card-mid text-text-light'}`}>
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          <div className="bg-card-dark rounded-2xl p-4 mb-5">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-3">{t.priceBreakdown}</p>
            {[
              { label: `${isTransport ? seats : 1} × ${price.toLocaleString('ru')} ₸`, val: subtotal },
              { label: t.tapFee, val: fee, accent: true },
            ].map(row => (
              <div key={row.label} className="flex justify-between mb-2">
                <span className="text-text-light text-sm">{row.label}</span>
                <span className={`font-semibold ${row.accent ? 'text-blazing-orange' : 'text-white'}`}>{row.val.toLocaleString('ru')} ₸</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="text-white font-bold">{t.total}</span>
              <span className="text-glacial-cyan font-black text-lg">{total.toLocaleString('ru')} ₸</span>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button onClick={handleBook} whileTap={{ scale: 0.97 }}
              className="flex-1 py-4 rounded-2xl bg-blazing-orange text-white font-black text-sm shadow-orange">
              💳 {t.bookNow}
            </motion.button>
            {service.partnerChatId && (
              <motion.button onClick={goToChat} whileTap={{ scale: 0.97 }}
                className="py-4 px-4 rounded-2xl border border-glacial-cyan/30 text-glacial-cyan font-semibold text-sm flex items-center gap-1.5">
                <MessageCircle size={15} /> Спросить
              </motion.button>
            )}
          </div>
        </>
      ) : (
        <>
          <QRDisplay hash={qrHash} onClose={handleClose} />
          {service.partnerChatId && (
            <motion.button onClick={goToChat} whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl border border-glacial-cyan/20 text-glacial-cyan
                font-semibold text-sm flex items-center justify-center gap-2 mt-3">
              <MessageCircle size={14} /> Написать {service.driver || service.host || 'партнёру'}
            </motion.button>
          )}
        </>
      )}
    </Modal>
  );
}

// ─── Main Booking Tab ──────────────────────────────────────────
export default function BookingTab({ onChatWith }) {
  const { t } = useLang();
  const { state } = useApp();
  const [filter,         setFilter]         = useState('all');
  const [bookingService, setBookingService] = useState(null);

  const filters = [
    { id: 'all',       label: t.all        },
    { id: 'transport', label: t.transport  },
    { id: 'housing',   label: t.housing    },
    { id: 'rental',    label: t.rental     },
  ];

  const filtered = filter === 'all' ? state.services : state.services.filter(s => s.type === filter);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
        {filters.map(f => (
          <motion.button key={f.id} onClick={() => setFilter(f.id)} whileTap={{ scale: 0.92 }}
            className={`filter-chip ${filter === f.id ? 'filter-chip-active' : 'filter-chip-idle'}`}>
            {f.label}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={filter} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="px-4 pt-1">
          {filtered.map(service => {
            const cardProps = { service, onBook: setBookingService, onChatWith };
            if (service.type === 'transport') return <TransportCard key={service.id} {...cardProps} />;
            if (service.type === 'housing')   return <HousingCard   key={service.id} {...cardProps} />;
            if (service.type === 'rental')    return <RentalCard    key={service.id} {...cardProps} />;
            return null;
          })}
        </motion.div>
      </AnimatePresence>
      <BookingModal
        service={bookingService}
        open={!!bookingService}
        onClose={() => setBookingService(null)}
        onChatWith={onChatWith}
      />
    </div>
  );
}
