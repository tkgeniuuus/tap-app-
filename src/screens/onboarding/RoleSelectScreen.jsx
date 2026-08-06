import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, ChevronRight, Check, User, AtSign, Phone, MapPin,
  Building2, FileText, CreditCard, ShieldCheck, Sparkles, Car, Hotel, ShoppingBag, Utensils, Compass
} from 'lucide-react';

/* ================================================================
   ALL PARTNER TYPES — grouped by category
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

/* ── UI Input Field Helper ──────────────────────────────────── */
function FormInputField({ icon: Icon, label, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div className="mb-4">
      <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-blazing-orange">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-card-dark border border-white/10 rounded-2xl py-3.5 text-white text-sm
            outline-none focus:border-blazing-orange transition-colors placeholder-text-muted/60 ${
              Icon ? 'pl-11 pr-4' : 'px-4'
            }`}
        />
      </div>
    </div>
  );
}

/* ── Step 1: Tourist vs Partner ─────────────────────────────── */
function StepRole({ onSelect }) {
  const choices = [
    {
      id: 'tourist', emoji: '🏕️', color: '#00E5FF',
      title: 'Tourist Registration',   sub: 'B2C · Traveler Account',
      desc:  'Create your traveler profile. Book tours, housing, gear & chat with guides.',
      badge: 'B2C',
    },
    {
      id: 'partner', emoji: '💼', color: '#FF5A00',
      title: 'Partner Business Registration',   sub: 'B2B · Merchant Account',
      desc:  'Register your business (Driver, Hotel, Shop, Guide, Restaurant) on TAP.',
      badge: 'B2B',
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-10 gap-4 overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-white font-black text-2xl">Welcome to TAP 👋</h1>
        <p className="text-text-muted text-sm mt-1">Select account type to start registration</p>
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
            <span className="text-xs font-bold">Register as {c.id === 'tourist' ? 'Tourist' : 'Business'}</span>
            <ChevronRight size={14} />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/* ── Step 2-A: Tourist Registration Form ───────────────────── */
function StepTouristForm({ onComplete, onBack }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Almaty');
  const [avatarEmoji, setAvatarEmoji] = useState('🏕️');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({
      name: name.trim(),
      username: username.startsWith('@') ? username.trim() : `@${username.trim() || 'traveler'}`,
      phone: phone.trim() || '+7 (707) 123-4567',
      city: city.trim() || 'Almaty, Kazakhstan',
      avatar: avatarEmoji,
    });
  };

  const EMOJI_CHOICES = ['🏕️', '🏔️', '🌊', '🦅', '🚵', '🏄', '🧭', '⭐'];

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-10 overflow-y-auto">
      <button onClick={onBack}
        className="flex items-center gap-2 text-text-muted mb-4 active:scale-95 transition-transform">
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <div className="mb-6">
        <h2 className="text-white font-black text-2xl">Tourist Registration 🏕️</h2>
        <p className="text-text-muted text-xs mt-1">Enter your details to create your travel account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        <div>
          {/* Avatar Emoji Selector */}
          <div className="mb-5">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              Choose Profile Icon
            </label>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              {EMOJI_CHOICES.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setAvatarEmoji(em)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                    avatarEmoji === em
                      ? 'bg-glacial-cyan/20 border-2 border-glacial-cyan text-white scale-110'
                      : 'bg-card-dark border border-white/10 opacity-70'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <FormInputField
            icon={User}
            label="Full Name (Имя и Фамилия)"
            placeholder="e.g. Arman Kazbekov"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <FormInputField
            icon={AtSign}
            label="Username (Никнейм)"
            placeholder="e.g. arman_traveler"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <FormInputField
            icon={Phone}
            label="Phone Number (Номер телефона)"
            placeholder="+7 (7XX) XXX-XX-XX"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <FormInputField
            icon={MapPin}
            label="City / Country (Город)"
            placeholder="e.g. Almaty, Kazakhstan"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </div>

        <motion.button
          type="submit"
          disabled={!name.trim()}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-4 rounded-[28px] font-black text-white text-base mt-6
            flex items-center justify-center gap-2 transition-all ${
              name.trim()
                ? 'bg-glacial-cyan text-midnight-ink shadow-cyan'
                : 'bg-card-dark text-text-muted cursor-not-allowed opacity-50'
            }`}
        >
          <Sparkles size={18} /> Complete Registration
        </motion.button>
      </form>
    </div>
  );
}

/* ── Step 2-B: Category filter + type grid ────────────────────── */
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
        <h2 className="text-white font-black text-xl">Select Business Category</h2>
        <p className="text-text-muted text-xs mt-0.5">What type of tourism service do you provide?</p>
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

/* ── Step 3-B: Partner Business Registration Form ────────────── */
function StepPartnerForm({ typeId, onComplete, onBack }) {
  const pt = PARTNER_TYPE_MAP[typeId] || { label: 'Business', emoji: '🏢', color: '#FF5A00' };

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [bin, setBin] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim()) return;
    onComplete({
      name: businessName.trim(),
      ownerName: ownerName.trim(),
      bin: bin.trim() || '980412300581',
      phone: phone.trim() || '+7 (701) 987-6543',
      address: address.trim() || 'Almaty Region, Zhetysu',
      details: details.trim(),
      typeId,
    });
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-10 overflow-y-auto">
      <button onClick={onBack}
        className="flex items-center gap-2 text-text-muted mb-4 active:scale-95 transition-transform">
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${pt.color}20` }}>
          {pt.emoji}
        </div>
        <div>
          <h2 className="text-white font-black text-xl">Register {pt.label}</h2>
          <p className="text-text-muted text-xs">Complete your B2B merchant verification profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        <div>
          <FormInputField
            icon={Building2}
            label="Business / Brand Name (Название бизнеса)"
            placeholder='e.g. "Zhetysu Off-Road 4x4" or "Kolsai Hotel"'
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            required
          />

          <FormInputField
            icon={User}
            label="Owner Full Name (ФИО Владельца)"
            placeholder="e.g. Nurlan Serikov"
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
            required
          />

          <FormInputField
            icon={FileText}
            label="BIN / IIN (БИН / ИИН Компании или ИП)"
            placeholder="12-digit Tax ID (e.g. 980412300581)"
            value={bin}
            onChange={e => setBin(e.target.value)}
          />

          <FormInputField
            icon={Phone}
            label="Kaspi WhatsApp / Contact Phone"
            placeholder="+7 (7XX) XXX-XX-XX"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <FormInputField
            icon={MapPin}
            label="Business Location / Address"
            placeholder="e.g. Saty village, Kolsai Road 14"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />

          <FormInputField
            icon={ShieldCheck}
            label="Vehicle / Property Details (Plate / Rooms)"
            placeholder='e.g. "Toyota Land Cruiser LC200, Plate 777 AAA 02"'
            value={details}
            onChange={e => setDetails(e.target.value)}
          />
        </div>

        <motion.button
          type="submit"
          disabled={!businessName.trim() || !ownerName.trim()}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-4 rounded-[28px] font-black text-white text-base mt-6
            flex items-center justify-center gap-2 transition-all ${
              businessName.trim() && ownerName.trim()
                ? 'bg-blazing-orange shadow-orange'
                : 'bg-card-dark text-text-muted cursor-not-allowed opacity-50'
            }`}
        >
          Continue to B2B Agreement →
        </motion.button>
      </form>
    </div>
  );
}

/* ── Step 4-B: Partner Confirmation ──────────────────────────── */
function StepConfirm({ typeId, partnerData, onConfirm, onBack }) {
  const pt = PARTNER_TYPE_MAP[typeId] || { label: 'Business', emoji: '🏢', color: '#FF5A00', perks: [] };

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
            <p className="text-white font-black text-xl">{partnerData?.name || pt.label}</p>
            <p className="text-sm" style={{ color: pt.color }}>Owner: {partnerData?.ownerName || 'Merchant'}</p>
          </div>
        </div>

        <div className="bg-card-dark/60 rounded-2xl p-3 mb-4 border border-white/5 space-y-1 text-xs">
          <p className="text-text-muted"><strong className="text-white">BIN/IIN:</strong> {partnerData?.bin || '980412300581'}</p>
          <p className="text-text-muted"><strong className="text-white">Phone:</strong> {partnerData?.phone || '+7 (701) 987-6543'}</p>
          <p className="text-text-muted"><strong className="text-white">Address:</strong> {partnerData?.address || 'Zhetysu, Almaty'}</p>
        </div>

        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-3">Merchant Dashboard Features:</p>
        <div className="space-y-2">
          {pt.perks?.map(p => (
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
        <p className="text-white font-bold text-sm mb-2">💰 TAP Merchant Terms</p>
        <div className="flex justify-between mb-1">
          <span className="text-text-muted text-xs">TAP Service Fee</span>
          <span className="text-glacial-cyan font-black text-sm">10%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted text-xs">Merchant Net Payout</span>
          <span className="text-white font-bold text-sm">90%</span>
        </div>
        <p className="text-text-muted text-[10px] mt-2">
          First 30 days 0% commission trial. Direct Kaspi Pay automated settlements.
        </p>
      </div>

      <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-[28px] font-black text-white text-base
          flex items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, ${pt.color}, ${pt.color}cc)`,
          boxShadow: `0 8px 32px ${pt.color}40`,
        }}>
        {pt.emoji} Launch "{partnerData?.name || pt.label}" Account
      </motion.button>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────── */
export default function RoleSelectScreen() {
  const { dispatch } = useApp();
  const [step, setStep] = useState('role'); // 'role' | 'touristForm' | 'partnerType' | 'partnerForm' | 'confirm'
  const [typeId, setTypeId] = useState(null);
  const [partnerFormData, setPartnerFormData] = useState(null);

  const handleRoleChoice = (roleId) => {
    if (roleId === 'tourist') {
      setStep('touristForm');
    } else {
      setStep('partnerType');
    }
  };

  const handleTouristSubmit = (touristData) => {
    dispatch({ type: 'REGISTER_TOURIST', payload: touristData });
    dispatch({ type: 'SET_ONBOARDED' });
    dispatch({ type: 'SET_ROLE', payload: 'tourist' });
  };

  const handlePartnerTypePick = (id) => {
    setTypeId(id);
    setStep('partnerForm');
  };

  const handlePartnerFormSubmit = (data) => {
    setPartnerFormData(data);
    setStep('confirm');
  };

  const confirmPartnerRegistration = () => {
    dispatch({
      type: 'REGISTER_PARTNER',
      payload: {
        ...partnerFormData,
        vehicle: partnerFormData.details || 'Commercial Unit',
        plate: partnerFormData.bin ? `BIN-${partnerFormData.bin.slice(-4)}` : 'KZ-777-02',
      },
    });
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
            <StepRole onSelect={handleRoleChoice} />
          </motion.div>
        )}

        {step === 'touristForm' && (
          <motion.div key="touristForm" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepTouristForm onComplete={handleTouristSubmit} onBack={() => setStep('role')} />
          </motion.div>
        )}

        {step === 'partnerType' && (
          <motion.div key="type" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepPartnerType onSelect={handlePartnerTypePick} onBack={() => setStep('role')} />
          </motion.div>
        )}

        {step === 'partnerForm' && (
          <motion.div key="partnerForm" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepPartnerForm typeId={typeId} onComplete={handlePartnerFormSubmit} onBack={() => setStep('partnerType')} />
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <StepConfirm typeId={typeId} partnerData={partnerFormData} onConfirm={confirmPartnerRegistration} onBack={() => setStep('partnerForm')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
