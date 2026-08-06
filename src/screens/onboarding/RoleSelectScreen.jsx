import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';

/* ================================================================
   ALL PARTNER TYPES — grouped by category (all text in English)
================================================================ */
export const PARTNER_TYPE_MAP = {
  driver_4x4: {
    emoji: '🚙', color: '#FF5A00', category: 'transport',
    label: '4×4 / Off-Road',        sub: 'Off-road Driver',
    desc:  'Mountain routes, national parks, off-road. Toyota LC, UAZ, Delica.',
    perks: ['Trip management', 'QR payment scanner', 'Route calendar', 'GPS track sharing'],
  },
  driver_van: {
    emoji: '🚌', color: '#F97316', category: 'transport',
    label: 'Van / Bus',              sub: 'Group Transfer',
    desc:  'Group transfers. Sprinter, Hiace, bus up to 45 seats.',
    perks: ['Group bookings', 'Online payments', 'Route builder', 'Occupancy stats'],
  },
  driver_moto: {
    emoji: '🏍️', color: '#EF4444', category: 'transport',
    label: 'Moto / ATV',             sub: 'Extreme Tours',
    desc:  'Extreme tours, mountain trails. ATVs, enduro bikes, snowmobiles.',
    perks: ['Online briefing', 'Rental + tour', 'Track recording', 'Insurance'],
  },
  driver_water: {
    emoji: '🚤', color: '#0EA5E9', category: 'transport',
    label: 'Water Transport',        sub: 'Boat / Jet-ski',
    desc:  'Alakol, Balkhash — speedboat, yacht, jet-ski, SUP rental.',
    perks: ['Hourly rentals', 'Water routes', 'Equipment rental', 'Weather integration'],
  },
  hotel: {
    emoji: '🏨', color: '#7C3AED', category: 'accommodation',
    label: 'Hotel',                  sub: 'Hotel / Resort',
    desc:  'Full-service accommodation, room management, reception.',
    perks: ['Room management', 'Online booking', 'Dynamic pricing', 'Reviews'],
  },
  hostel: {
    emoji: '🏠', color: '#8B5CF6', category: 'accommodation',
    label: 'Hostel / Guesthouse',    sub: 'Budget Stay',
    desc:  'Budget accommodation, dormitory beds, shared kitchen.',
    perks: ['Bed reservations', 'Occupancy tracking', 'Photo gallery', 'Check-in / Check-out'],
  },
  yurt: {
    emoji: '⛺', color: '#10B981', category: 'accommodation',
    label: 'Yurt Camp',              sub: 'Traditional Stay',
    desc:  'Authentic experience — yurts, national cuisine, steppe / mountains.',
    perks: ['Seasonal schedule', 'Package tours', 'Cultural program', 'Meals included'],
  },
  camping: {
    emoji: '🔥', color: '#F59E0B', category: 'accommodation',
    label: 'Camping / Glamping',     sub: 'Outdoor Stay',
    desc:  'Equipped campsites, cabins, tents, glamping pods.',
    perks: ['Site map', 'Per-night rental', 'Add-on services', 'Equipment'],
  },
  restaurant: {
    emoji: '🍽️', color: '#DC2626', category: 'food',
    label: 'Restaurant / Café',      sub: 'Dining',
    desc:  'Tourist dining, banquets, national cuisine.',
    perks: ['Menu builder', 'Event catering', 'Table booking', 'Delivery'],
  },
  bbq: {
    emoji: '🥩', color: '#B45309', category: 'food',
    label: 'BBQ / Grill',            sub: 'Outdoor Grill',
    desc:  'Nature rest zones, charcoal grill, kumis.',
    perks: ['Zone rental', '"Nature" packages', 'Charcoal delivery', 'Capacity management'],
  },
  tea: {
    emoji: '☕', color: '#92400E', category: 'food',
    label: 'Teahouse / Coffee',      sub: 'Beverages',
    desc:  'Tea, coffee, pastries, tea ceremonies.',
    perks: ['Tea sessions', 'WiFi zone', 'Merch', 'Loyalty program'],
  },
  tourzone: {
    emoji: '🏞️', color: '#059669', category: 'activity',
    label: 'Tour Zone / Park',       sub: 'National Park',
    desc:  'Park entry, routes, excursions, entry fees.',
    perks: ['E-tickets', 'Route map', 'Gate management', 'Tour schedule'],
  },
  guide: {
    emoji: '🎯', color: '#0891B2', category: 'activity',
    label: 'Tour Guide',             sub: 'Certified Guide',
    desc:  'Hiking, horse, and car tours. Certified multilingual guide.',
    perks: ['Tour schedule', 'Online booking', 'Multi-language', 'Guide profile'],
  },
  photo: {
    emoji: '📸', color: '#7C3AED', category: 'activity',
    label: 'Photographer',           sub: 'Travel Photography',
    desc:  'Travel shoots, nature sessions, drone footage.',
    perks: ['Portfolio', 'Online booking', 'Shoot packages', 'Fast delivery'],
  },
  horse: {
    emoji: '🐴', color: '#78350F', category: 'activity',
    label: 'Horse Trekking',         sub: 'Equestrian',
    desc:  'Horse rides, trekking, horse rental.',
    perks: ['Route levels', 'Instruction', 'Gear', 'Horse insurance'],
  },
  water_sport: {
    emoji: '🏄', color: '#0284C7', category: 'activity',
    label: 'Water Sports',           sub: 'Water Activities',
    desc:  'SUP, kite surfing, fishing, diving on Alakol & Balkhash.',
    perks: ['Equipment rental', 'Lessons', 'Lake tours', 'Wind forecast'],
  },
  gear_shop: {
    emoji: '🏪', color: '#1D4ED8', category: 'shop',
    label: 'Gear Shop',              sub: 'Equipment Store',
    desc:  'Selling tourist gear, clothing, footwear.',
    perks: ['Product catalog', 'Online sales', 'QR issue', 'Inventory'],
  },
  rental: {
    emoji: '🔧', color: '#4338CA', category: 'shop',
    label: 'Equipment Rental',       sub: 'Rental Service',
    desc:  'Renting tents, backpacks, sleeping bags, gear.',
    perks: ['Rental management', 'Deposit system', 'QR issue/return', 'Inventory'],
  },
  souvenir: {
    emoji: '🎁', color: '#BE185D', category: 'shop',
    label: 'Souvenir Shop',          sub: 'Gifts & Crafts',
    desc:  'Kazakh products, souvenirs, handmade items.',
    perks: ['Online storefront', 'Delivery', 'QR labels', 'AI recommendations'],
  },
};

const CATEGORIES = [
  { id: 'transport',     emoji: '🚗', label: 'Transport'      },
  { id: 'accommodation', emoji: '🏨', label: 'Accommodation'  },
  { id: 'food',          emoji: '🍽️', label: 'Food & Drinks'  },
  { id: 'activity',      emoji: '🎯', label: 'Activities'     },
  { id: 'shop',          emoji: '🛒', label: 'Shops'          },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

/* ── Step 1: Tourist vs Partner ─────────────────────────────── */
function StepRole({ onSelect }) {
  const choices = [
    {
      id: 'tourist', emoji: '🏕️', color: '#00E5FF',
      title: 'Tourist',   sub: 'Турист · Tourist',
      desc:  'Book trips, housing and gear. Chat with fellow travellers and partners.',
      badge: 'B2C',
    },
    {
      id: 'partner', emoji: '💼', color: '#FF5A00',
      title: 'Partner',   sub: 'Серіктес · Partner',
      desc:  'List your business on TAP. Accept bookings, manage your finances.',
      badge: 'B2B',
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-10 gap-4 overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-white font-black text-2xl">Welcome to TAP 👋</h1>
        <p className="text-text-muted text-sm mt-1">Choose your role to get started</p>
      </div>

      {choices.map((c, idx) => (
        <motion.button key={c.id} onClick={() => onSelect(c.id)}
          className="relative rounded-[28px] p-6 text-left overflow-hidden
            border border-white/5 bg-card-dark flex flex-col gap-3"
          style={{ boxShadow: `0 8px 40px ${c.color}14` }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ background: c.color }} />

          <div className="flex items-center justify-between relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: `${c.color}18` }}>
              {c.emoji}
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full"
              style={{ background: `${c.color}22`, color: c.color }}>
              {c.badge}
            </span>
          </div>

          <div className="relative z-10">
            <p className="text-white font-black text-xl leading-tight">{c.title}</p>
            <p className="text-white/35 text-xs">{c.sub}</p>
          </div>

          <p className="text-text-muted text-sm leading-relaxed relative z-10">{c.desc}</p>

          <div className="flex items-center gap-1 relative z-10" style={{ color: c.color }}>
            <span className="text-xs font-bold">Select</span>
            <ChevronRight size={14} />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/* ── Step 2: Category filter + type grid ────────────────────── */
function StepPartnerType({ onSelect, onBack }) {
  const [activeCategory, setActiveCategory] = useState('transport');
  const types = Object.entries(PARTNER_TYPE_MAP).filter(([, v]) => v.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack}
          className="flex items-center gap-2 text-text-muted mb-3 active:scale-95 transition-transform">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <h2 className="text-white font-black text-xl">Your business type</h2>
        <p className="text-text-muted text-xs mt-0.5">This will configure your personal dashboard</p>
      </div>

      <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide flex-shrink-0">
        {CATEGORIES.map(cat => (
          <motion.button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            whileTap={{ scale: 0.9 }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl
              text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-blazing-orange text-white'
                : 'bg-card-dark text-text-muted border border-white/5'}`}>
            <span>{cat.emoji}</span>
            {cat.label}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} className="grid grid-cols-1 gap-3"
            variants={container} initial="hidden" animate="show">
            {types.map(([typeId, pt]) => (
              <motion.button key={typeId} variants={cardItem} onClick={() => onSelect(typeId)}
                className="bg-card-dark rounded-[22px] p-4 border border-white/5 text-left
                  flex items-start gap-3 active:scale-[0.98] transition-all group"
                style={{ boxShadow: `0 4px 20px ${pt.color}0A` }}
                whileTap={{ scale: 0.97 }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${pt.color}18` }}>
                  {pt.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-bold text-sm">{pt.label}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${pt.color}22`, color: pt.color }}>
                      {pt.sub}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs mb-2 leading-snug">{pt.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {pt.perks.slice(0, 3).map(p => (
                      <span key={p} className="text-[9px] bg-card-light text-text-muted px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                    {pt.perks.length > 3 && (
                      <span className="text-[9px] text-text-muted px-1">+{pt.perks.length - 3}</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-muted flex-shrink-0 mt-0.5
                  group-hover:text-white transition-all" />
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Step 3: Confirm ─────────────────────────────────────────── */
function StepConfirm({ typeId, onConfirm, onBack }) {
  const pt = PARTNER_TYPE_MAP[typeId];
  if (!pt) return null;

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-10 overflow-y-auto">
      <button onClick={onBack}
        className="flex items-center gap-2 text-text-muted mb-4 active:scale-95 transition-transform">
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <motion.div className="rounded-[28px] p-6 mb-5 border"
        style={{ background: `${pt.color}10`, borderColor: `${pt.color}30` }}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: `${pt.color}20` }}>
            {pt.emoji}
          </div>
          <div>
            <p className="text-white font-black text-xl">{pt.label}</p>
            <p className="text-sm" style={{ color: pt.color }}>{pt.sub}</p>
          </div>
        </div>
        <p className="text-text-muted text-sm leading-relaxed mb-4">{pt.desc}</p>
        <div className="border-t pb-4" style={{ borderColor: `${pt.color}25` }} />
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-3">What you get:</p>
        <div className="space-y-2">
          {pt.perks.map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${pt.color}25` }}>
                <Check size={11} style={{ color: pt.color }} />
              </div>
              <span className="text-text-light text-sm">{p}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="bg-card-dark rounded-2xl p-4 mb-5 border border-white/5">
        <p className="text-white font-bold text-sm mb-2">💰 TAP Commission</p>
        <div className="flex justify-between mb-1">
          <span className="text-text-muted text-xs">Per transaction</span>
          <span className="text-glacial-cyan font-black text-sm">10%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted text-xs">You keep</span>
          <span className="text-white font-bold text-sm">90%</span>
        </div>
        <p className="text-text-muted text-[10px] mt-2">
          First 30 days — no commission. Payouts via Kaspi Pay.
        </p>
      </div>

      <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-[28px] font-black text-white text-base
          flex items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, ${pt.color}, ${pt.color}cc)`,
          boxShadow: `0 8px 32px ${pt.color}40`,
        }}>
        {pt.emoji} Start as "{pt.label}"
      </motion.button>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────── */
export default function RoleSelectScreen() {
  const { dispatch } = useApp();
  const [step,   setStep]   = useState('role');
  const [typeId, setTypeId] = useState(null);

  const pickRole = (roleId) => {
    if (roleId === 'tourist') {
      dispatch({ type: 'SET_ONBOARDED' });
      dispatch({ type: 'SET_ROLE', payload: 'tourist' });
    } else {
      setStep('partnerType');
    }
  };

  const pickType = (id) => { setTypeId(id); setStep('confirm'); };

  const confirm = () => {
    dispatch({ type: 'SET_PARTNER_TYPE', payload: typeId });
    dispatch({ type: 'SET_ONBOARDED' });
    dispatch({ type: 'SET_ROLE', payload: 'partner' });
  };

  return (
    <div className="tap-screen flex flex-col overflow-hidden bg-midnight-ink">
      <AnimatePresence mode="wait">
        {step === 'role' && (
          <motion.div key="role" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepRole onSelect={pickRole} />
          </motion.div>
        )}
        {step === 'partnerType' && (
          <motion.div key="type" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepPartnerType onSelect={pickType} onBack={() => setStep('role')} />
          </motion.div>
        )}
        {step === 'confirm' && (
          <motion.div key="confirm" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepConfirm typeId={typeId} onConfirm={confirm} onBack={() => setStep('partnerType')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
