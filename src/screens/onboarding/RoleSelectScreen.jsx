import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';

/* ================================================================
   ALL PARTNER TYPES — grouped by category
   Each type has: id, emoji, color, label, sub (EN/KK), desc, perks
================================================================ */
export const PARTNER_TYPE_MAP = {
  // ── TRANSPORT ────────────────────────────────────────────────
  driver_4x4: {
    emoji: '🚙', color: '#FF5A00', category: 'transport',
    label: '4×4 / Внедорожник',   sub: 'Off-road Driver',
    desc:  'Горные маршруты, нацпарки, бездорожье. Toyota LC, UAZ, Delica.',
    perks: ['Управление поездками', 'QR-сканер оплаты', 'Маршрутный календарь', 'GPS трек-шеринг'],
  },
  driver_van: {
    emoji: '🚌', color: '#F97316', category: 'transport',
    label: 'Минивэн / Автобус',   sub: 'Van / Bus',
    desc:  'Групповые трансферы. Sprinter, Hiace, автобус до 45 мест.',
    perks: ['Групповые брони', 'Онлайн-оплата', 'Маршруты', 'Статистика заполняемости'],
  },
  driver_moto: {
    emoji: '🏍️', color: '#EF4444', category: 'transport',
    label: 'Мото / Квадроцикл',   sub: 'Moto / ATV',
    desc:  'Экстрим-туры, горные тропы. Квадроциклы, эндуро, снегоходы.',
    perks: ['Инструктаж онлайн', 'Прокат + тур', 'Трек-запись', 'Страховка'],
  },
  driver_water: {
    emoji: '🚤', color: '#0EA5E9', category: 'transport',
    label: 'Водный транспорт',     sub: 'Water Transport',
    desc:  'Алаколь, Балхаш — катер, яхта, гидроцикл, SUP-прокат.',
    perks: ['Аренда по часам', 'Маршруты на воде', 'Аренда оборудования', 'Погода-интеграция'],
  },

  // ── ACCOMMODATION ─────────────────────────────────────────────
  hotel: {
    emoji: '🏨', color: '#7C3AED', category: 'accommodation',
    label: 'Гостиница / Отель',    sub: 'Hotel',
    desc:  'Стационарное размещение, номерной фонд, ресепшн.',
    perks: ['Управление номерами', 'Online-бронирование', 'Динамическое ценообразование', 'Отзывы'],
  },
  hostel: {
    emoji: '🏠', color: '#8B5CF6', category: 'accommodation',
    label: 'Хостел / Гостевой дом', sub: 'Hostel / Guesthouse',
    desc:  'Бюджетное размещение, спальные места, общая кухня.',
    perks: ['Бронь спальных мест', 'Заполняемость', 'Фотогалерея', 'Чек-ин / Чек-аут'],
  },
  yurt: {
    emoji: '⛺', color: '#10B981', category: 'accommodation',
    label: 'Юрточный лагерь',      sub: 'Yurt Camp',
    desc:  'Аутентичный отдых — юрты, национальная кухня, степь / горы.',
    perks: ['Сезонное расписание', 'Пакетные туры', 'Культурная программа', 'Питание'],
  },
  camping: {
    emoji: '🔥', color: '#F59E0B', category: 'accommodation',
    label: 'Кемпинг / Glamping',   sub: 'Camping / Glamping',
    desc:  'Оборудованные стоянки, домики, шатры, глэмпинг.',
    perks: ['Карта мест на сайте', 'Посуточная аренда', 'Доп. услуги', 'Инвентарь'],
  },

  // ── FOOD & DRINK ──────────────────────────────────────────────
  restaurant: {
    emoji: '🍽️', color: '#DC2626', category: 'food',
    label: 'Ресторан / Кафе',      sub: 'Restaurant / Café',
    desc:  'Туристическое питание, банкеты, национальная кухня.',
    perks: ['Меню-конструктор', 'Банкет под заказ', 'Онлайн-столик', 'Доставка'],
  },
  bbq: {
    emoji: '🥩', color: '#B45309', category: 'food',
    label: 'Шашлычная / Мангал',   sub: 'BBQ / Grill',
    desc:  'Зоны отдыха у природы, мясо на углях, кумыс.',
    perks: ['Аренда зоны', 'Пакет "Природа"', 'Доставка углей/дров', 'Вмещаемость'],
  },
  tea: {
    emoji: '☕', color: '#92400E', category: 'food',
    label: 'Чайхана / Кофейня',    sub: 'Teahouse / Coffee',
    desc:  'Чай, кофе, выпечка, чайные церемонии.',
    perks: ['Сессии чая', 'Вайфай-зона', 'Мерч', 'Лояльность'],
  },

  // ── ACTIVITIES ────────────────────────────────────────────────
  tourzone: {
    emoji: '🏞️', color: '#059669', category: 'activity',
    label: 'Тур-зона / Нацпарк',   sub: 'Tour Zone / Park',
    desc:  'Вход в тур-зону, маршруты, экскурсии, сборы.',
    perks: ['Электронные билеты', 'Карта маршрутов', 'Управление входом', 'Экскурс-расписание'],
  },
  guide: {
    emoji: '🎯', color: '#0891B2', category: 'activity',
    label: 'Туристический гид',    sub: 'Tour Guide',
    desc:  'Пешие, конные, автомобильные туры. Сертифицированный гид.',
    perks: ['Расписание туров', 'Онлайн-запись', 'Мультиязычность', 'Профиль гида'],
  },
  photo: {
    emoji: '📸', color: '#7C3AED', category: 'activity',
    label: 'Фотограф / Видеограф', sub: 'Photographer',
    desc:  'Тревел-съёмка, фотосессии на природе, аэросъёмка.',
    perks: ['Портфолио', 'Онлайн-запись', 'Пакеты съёмки', 'Быстрая доставка фото'],
  },
  horse: {
    emoji: '🐴', color: '#78350F', category: 'activity',
    label: 'Конный туризм',        sub: 'Horse Trekking',
    desc:  'Конные прогулки, треккинг, аренда лошадей.',
    perks: ['Уровни маршрутов', 'Инструктаж', 'Снаряжение', 'Страховка лошади'],
  },
  water_sport: {
    emoji: '🏄', color: '#0284C7', category: 'activity',
    label: 'Водные активности',    sub: 'Water Sports',
    desc:  'SUP, кайтинг, рыбалка, ныряние на Алаколе и Балхаше.',
    perks: ['Прокат оборудования', 'Обучение', 'Тур по озёрам', 'Прогноз ветра'],
  },

  // ── SHOPS ─────────────────────────────────────────────────────
  gear_shop: {
    emoji: '🏪', color: '#1D4ED8', category: 'shop',
    label: 'Магазин снаряжения',   sub: 'Gear Shop',
    desc:  'Продажа туристического оборудования, одежды, обуви.',
    perks: ['Каталог товаров', 'Онлайн-продажа', 'QR-выдача', 'Инвентаризация'],
  },
  rental: {
    emoji: '🔧', color: '#4338CA', category: 'shop',
    label: 'Прокат оборудования',  sub: 'Rental',
    desc:  'Аренда палаток, рюкзаков, спальников, снаряжения.',
    perks: ['Управление прокатом', 'Залоговая система', 'QR-выдача/приёмка', 'Инвентарь'],
  },
  souvenir: {
    emoji: '🎁', color: '#BE185D', category: 'shop',
    label: 'Сувенирная лавка',     sub: 'Souvenir Shop',
    desc:  'Казахская продукция, сувениры, hand-made изделия.',
    perks: ['Витрина онлайн', 'Доставка', 'QR-метки', 'Рекомендации ИИ'],
  },
};

const CATEGORIES = [
  { id: 'transport',     emoji: '🚗', label: 'Транспорт'    },
  { id: 'accommodation', emoji: '🏨', label: 'Размещение'   },
  { id: 'food',          emoji: '🍽️', label: 'Еда и напитки'},
  { id: 'activity',      emoji: '🎯', label: 'Активности'   },
  { id: 'shop',          emoji: '🛒', label: 'Магазины'     },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};
const item = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

/* ── Step 1: Tourist vs Partner ─────────────────────────────── */
function StepRole({ onSelect }) {
  const choices = [
    {
      id: 'tourist', emoji: '🏕️', color: '#00E5FF',
      title: 'Турист',   titleKK: 'Турист · Tourist',
      desc: 'Бронируй поездки, жильё и снаряжение. Общайся с туристами и партнёрами.',
      badge: 'B2C',
    },
    {
      id: 'partner', emoji: '💼', color: '#FF5A00',
      title: 'Партнёр',  titleKK: 'Серіктес · Partner',
      desc: 'Размести своё дело в TAP. Принимай заказы, управляй финансами.',
      badge: 'B2B',
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-10 gap-4 overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-white font-black text-2xl">Добро пожаловать в TAP 👋</h1>
        <p className="text-text-muted text-sm mt-1">Выберите роль, чтобы начать</p>
      </div>
      {choices.map(c => (
        <motion.button key={c.id} onClick={() => onSelect(c.id)}
          className="relative rounded-[28px] p-6 text-left overflow-hidden border border-white/5
            bg-card-dark flex flex-col gap-3"
          style={{ boxShadow: `0 8px 40px ${c.color}14` }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: choices.indexOf(c) * 0.1 }}
        >
          {/* Glow */}
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
            <p className="text-white/35 text-xs">{c.titleKK}</p>
          </div>

          <p className="text-text-muted text-sm leading-relaxed relative z-10">{c.desc}</p>

          <div className="flex items-center gap-1 relative z-10" style={{ color: c.color }}>
            <span className="text-xs font-bold">Выбрать</span>
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

  const types = Object.entries(PARTNER_TYPE_MAP)
    .filter(([, v]) => v.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-text-muted mb-3 active:scale-95 transition-transform">
          <ArrowLeft size={18} />
          <span className="text-sm">Назад</span>
        </button>
        <h2 className="text-white font-black text-xl">Тип вашего бизнеса</h2>
        <p className="text-text-muted text-xs mt-0.5">Это настроит личный кабинет под ваши задачи</p>
      </div>

      {/* Category tabs */}
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

      {/* Type cards grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory}
            className="grid grid-cols-1 gap-3"
            variants={container} initial="hidden" animate="show">
            {types.map(([typeId, pt]) => (
              <motion.button key={typeId} variants={item} onClick={() => onSelect(typeId)}
                className="bg-card-dark rounded-[22px] p-4 border border-white/5 text-left
                  flex items-start gap-3 active:scale-[0.98] transition-all group"
                style={{ boxShadow: `0 4px 20px ${pt.color}0A` }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${pt.color}18` }}>
                  {pt.emoji}
                </div>

                {/* Content */}
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
                      <span key={p} className="text-[9px] bg-card-light text-text-muted px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                    {pt.perks.length > 3 && (
                      <span className="text-[9px] text-text-muted px-1">+{pt.perks.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight size={18} className="text-text-muted flex-shrink-0 mt-0.5
                  group-hover:translate-x-0.5 group-hover:text-white transition-all" />
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
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted mb-4 active:scale-95 transition-transform">
        <ArrowLeft size={18} />
        <span className="text-sm">Назад</span>
      </button>

      {/* Big type card */}
      <motion.div
        className="rounded-[28px] p-6 mb-5 border border-white/5"
        style={{ background: `${pt.color}10`, borderColor: `${pt.color}30` }}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      >
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
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-3">
          Что вы получаете:
        </p>
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

      {/* TAP commission info */}
      <div className="bg-card-dark rounded-2xl p-4 mb-5 border border-white/5">
        <p className="text-white font-bold text-sm mb-2">💰 Комиссия TAP</p>
        <div className="flex justify-between mb-1">
          <span className="text-text-muted text-xs">С каждой транзакции</span>
          <span className="text-glacial-cyan font-black text-sm">10%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted text-xs">Вам</span>
          <span className="text-white font-bold text-sm">90%</span>
        </div>
        <p className="text-text-muted text-[10px] mt-2">
          Первые 30 дней — без комиссии. Выплаты через Kaspi Pay.
        </p>
      </div>

      <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-[28px] font-black text-white text-base
          flex items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, ${pt.color}, ${pt.color}cc)`,
          boxShadow: `0 8px 32px ${pt.color}40`,
        }}>
        {pt.emoji} Начать как «{pt.label}»
      </motion.button>
    </div>
  );
}

/* ── Root RoleSelectScreen ───────────────────────────────────── */
export default function RoleSelectScreen() {
  const { dispatch } = useApp();
  const [step,     setStep]     = useState('role');          // role | partnerType | confirm
  const [typeId,   setTypeId]   = useState(null);

  const pickRole = (roleId) => {
    if (roleId === 'tourist') {
      dispatch({ type: 'SET_ONBOARDED' });
      dispatch({ type: 'SET_ROLE', payload: 'tourist' });
    } else {
      setStep('partnerType');
    }
  };

  const pickType = (id) => {
    setTypeId(id);
    setStep('confirm');
  };

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
