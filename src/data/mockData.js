export const GPS = {
  almaty:      { lat: 43.2565, lng: 76.9284 },
  kolsai:      { lat: 42.9847, lng: 78.3242 },
  charyn:      { lat: 43.3512, lng: 79.0778 },
  alakol:      { lat: 46.1558, lng: 81.7619 },
  altynEmel:   { lat: 44.0000, lng: 78.7500 },
  burkhanBulak:{ lat: 45.0350, lng: 79.1683 },
  taldykorgan: { lat: 45.0168, lng: 78.3703 },
};

export const MOCK_USER = {
  id: 'user-001', name: 'Айдана Серікқызы', avatar: null,
  rating: 4.9, tripsCount: 23,
  badges: [
    { id: 'b1', icon: '🏔️', label: 'Охотник за водопадами', color: '#00E5FF' },
    { id: 'b2', icon: '🦅', label: 'Орёл Жетысу',          color: '#FF5A00' },
    { id: 'b3', icon: '⛺', label: 'Мастер кэмпинга',       color: '#7C3AED' },
    { id: 'b4', icon: '🌿', label: 'Эко-путешественник',    color: '#10B981' },
  ],
  wallet: 45000,
};

export const MOCK_PARTNER_USER = {
  id: 'partner-001', name: 'Серік Маратов',
  vehicle: 'Toyota Land Cruiser 200', plate: '777 ALA 01',
  rating: 4.8, totalRevenue: 385000, completedRides: 47,
};

// ─── Services ────────────────────────────────────────────────
export const MOCK_SERVICES = [
  {
    id: 's1', type: 'transport', partnerId: 'p-driver-1',
    driver: 'Нурлан А.', driverRating: 4.9, partnerChatId: 'dm-nurlan',
    vehicle: 'Toyota Land Cruiser 200',
    from: 'Алматы', to: 'Кольсай',
    fromCoords: GPS.almaty, toCoords: GPS.kolsai,
    departureTime: '07:00', date: '30 июл',
    totalSeats: 6, bookedSeats: 4, pricePerSeat: 15000,
    emoji: '🚙', tag: 'HOT',
    description: '4x4, полный привод, опытный водитель. Остановка у Бартогая.',
  },
  {
    id: 's2', type: 'transport', partnerId: 'p-driver-2',
    driver: 'Бауыржан К.', driverRating: 4.7, partnerChatId: 'dm-baurjan',
    vehicle: 'Delica 4x4 D5',
    from: 'Алматы', to: 'Чарын',
    fromCoords: GPS.almaty, toCoords: GPS.charyn,
    departureTime: '06:30', date: '31 июл',
    totalSeats: 8, bookedSeats: 3, pricePerSeat: 9000,
    emoji: '🚌', tag: null,
    description: 'Комфортная Делика, кондиционер, Wi-Fi. Экскурсия по каньону.',
  },
  {
    id: 's3', type: 'transport', partnerId: 'p-driver-3',
    driver: 'Аслан М.', driverRating: 5.0, partnerChatId: 'dm-aslan',
    vehicle: 'UAZ Патриот',
    from: 'Алматы', to: 'Алаколь',
    fromCoords: GPS.almaty, toCoords: GPS.alakol,
    departureTime: '05:00', date: '29 июл',
    totalSeats: 5, bookedSeats: 5, pricePerSeat: 18000,
    emoji: '🛻', tag: 'FULL',
    description: 'Озеро Алаколь, бальнеологические источники.',
  },
  {
    id: 's4', type: 'housing', partnerId: 'p-hotel-1',
    name: 'Гостевой дом «Жетісу»',
    host: 'Гүлмира А.', rating: 4.8, partnerChatId: 'dm-gulmira',
    location: 'Кольсай, 1 км от озера', coords: GPS.kolsai,
    price: 12000, emoji: '🏡', tag: 'TOP',
    amenities: ['Баня', 'Мангал', 'Wi-Fi', 'Парковка'],
    description: 'Уютные деревянные домики у реки. Завтрак включён.',
  },
  {
    id: 's5', type: 'housing', partnerId: 'p-hotel-2',
    name: 'Юрточный лагерь «Ала-Тоо»',
    host: 'Ерлан Б.', rating: 4.6, partnerChatId: 'dm-erlan',
    location: 'Чарын, у каньона', coords: GPS.charyn,
    price: 8500, emoji: '⛺', tag: null,
    amenities: ['Питание 3×', 'Лошади', 'Гид'],
    description: 'Аутентичные юрты, национальная кухня.',
  },
  {
    id: 's6', type: 'rental', partnerId: 'p-shop-1',
    name: 'Палатка MSR Hubba Hubba 3',
    owner: 'Тимур Д.', rating: 4.9, partnerChatId: 'dm-timur',
    price: 2500, emoji: '⛺', tag: 'POPULAR', deposit: 15000,
    description: 'Лёгкая 3-местная палатка. Состояние отличное.',
  },
  {
    id: 's7', type: 'rental', partnerId: 'p-shop-1',
    name: 'SUP-борд 11\'6"',
    owner: 'Дана С.', rating: 4.7, partnerChatId: 'dm-dana',
    price: 4000, emoji: '🏄', tag: null, deposit: 30000,
    description: 'Надувной SUP с веслом и насосом. Идеально для Алаколя.',
  },
  {
    id: 's8', type: 'rental', partnerId: 'p-shop-2',
    name: 'Квадроцикл CF Moto 450S',
    owner: 'Марат К.', rating: 4.5, partnerChatId: 'dm-marat',
    price: 15000, emoji: '🏍️', tag: 'NEW', deposit: 100000,
    description: 'Мощный квадроцикл для горных маршрутов.',
  },
];

// ─── Camps ───────────────────────────────────────────────────
export const MOCK_CAMPS = [
  { id: 'c1', name: 'Кольсай: Ночной лагерь', lat: GPS.kolsai.lat, lng: GPS.kolsai.lng, current: 18, max: 20, departure: '08:00, 30 июл', emoji: '🔥', description: 'Групповой выезд к Кольсайским озёрам.', organizer: 'Нурлан А.', price: 15000 },
  { id: 'c2', name: 'Чарын: Рассветная фотосессия', lat: GPS.charyn.lat, lng: GPS.charyn.lng, current: 9, max: 15, departure: '05:30, 31 июл', emoji: '📸', description: 'Фото-тур на рассвете. Профессиональный гид.', organizer: 'Аслан Ф.', price: 12000 },
  { id: 'c3', name: 'Алаколь: Эко-лагерь', lat: GPS.alakol.lat, lng: GPS.alakol.lng, current: 12, max: 25, departure: '06:00, 2 авг', emoji: '🌊', description: 'Экологический лагерь у озера. 5 дней, 4 ночи.', organizer: 'Гүлмира М.', price: 45000 },
  { id: 'c4', name: 'Алтын-Эмель: Поющий бархан', lat: GPS.altynEmel.lat, lng: GPS.altynEmel.lng, current: 7, max: 20, departure: '09:00, 3 авг', emoji: '🏜️', description: 'Национальный парк, поющий бархан, сайгаки.', organizer: 'TAP HQ', price: 20000 },
];

export const MOCK_POI = [
  { id: 'p1', name: 'Алматы',         lat: GPS.almaty.lat,       lng: GPS.almaty.lng,       type: 'city' },
  { id: 'p2', name: 'Талдыкорган',    lat: GPS.taldykorgan.lat,  lng: GPS.taldykorgan.lng,  type: 'city' },
  { id: 'p3', name: 'Алтын-Эмель',   lat: GPS.altynEmel.lat,    lng: GPS.altynEmel.lng,    type: 'park' },
  { id: 'p4', name: 'Бурхан-Булак',  lat: GPS.burkhanBulak.lat, lng: GPS.burkhanBulak.lng, type: 'park' },
  { id: 'p5', name: 'Кольсай',        lat: GPS.kolsai.lat,       lng: GPS.kolsai.lng,       type: 'stay' },
  { id: 'p6', name: 'Чарын',          lat: GPS.charyn.lat,       lng: GPS.charyn.lng,       type: 'stay' },
];

// ─── Stories ─────────────────────────────────────────────────
export const MOCK_STORIES = [
  { id: 'st1', userId: 'u2', userName: 'Дина М.',    userEmoji: '👩‍🦱', location: 'Кольсай',      caption: 'Рассвет над первым озером 🌅',  timestamp: Date.now() - 3600000,  likes: 24, bgColor: '#1a3a5c', emoji: '🏔️', live: true  },
  { id: 'st2', userId: 'u3', userName: 'Арман Б.',   userEmoji: '🧔',   location: 'Чарын',        caption: 'Каньон в лучах заката 🌄',       timestamp: Date.now() - 7200000,  likes: 41, bgColor: '#3d1a00', emoji: '🦅', live: true  },
  { id: 'st3', userId: 'u4', userName: 'Мадина С.',  userEmoji: '👩',   location: 'Алаколь',      caption: 'Вода цвета бирюзы! 🏄‍♀️',         timestamp: Date.now() - 10800000, likes: 67, bgColor: '#003d4d', emoji: '🌊', live: false },
  { id: 'st4', userId: 'u5', userName: 'Нурлан Т.',  userEmoji: '🧑',   location: 'Алтын-Эмель', caption: 'Поющий бархан зовёт 🏜️',         timestamp: Date.now() - 14400000, likes: 33, bgColor: '#2d1a00', emoji: '🏜️', live: false },
  { id: 'st5', userId: 'u6', userName: 'Сара Ж.',    userEmoji: '👩‍🦰', location: 'Бурхан-Булак', caption: 'Этот водопад стоит 6 часов! 💦', timestamp: Date.now() - 18000000, likes: 89, bgColor: '#003d1a', emoji: '💦', live: true  },
];

// ─── Chats — с реальными DM к каждому партнёру ───────────────
export const MOCK_CHATS = {
  dms: [
    {
      id: 'dm-nurlan', name: 'Нурлан А. 🚙 Водитель', emoji: '🚗',
      lastMsg: 'Буду в 6:55 у ЦУМа', time: '08:12', unread: 2,
      partnerType: 'driver',
      autoReplies: [
        'Добро пожаловать! Всё по плану 👍',
        'Место встречи — ЦУМ Алматы, 06:50',
        'Не забудьте тёплые вещи — ночью до +8°C',
        'В горах связь может пропадать — скачайте Maps.me',
        'GPS-трек маршрута отправлю накануне',
        'Есть вопросы по маршруту? 🏔️',
      ],
      messages: [
        { id: 'm1', from: 'them', text: 'Здравствуйте! Жду вас 30 июля в 07:00', time: '20:30' },
        { id: 'm2', from: 'me',   text: 'Отлично, буду вовремя!',                  time: '20:35' },
        { id: 'm3', from: 'them', text: 'Буду в 6:55 у ЦУМа',                     time: '08:12' },
      ],
    },
    {
      id: 'dm-gulmira', name: 'Гүлмира А. 🏡 Хозяйка', emoji: '🏡',
      lastMsg: 'Ваш номер готов, заезд с 14:00', time: '10:45', unread: 0,
      partnerType: 'hotel',
      autoReplies: [
        'Завтрак подадим в 8:00 😊',
        'Баня будет готова к вечеру.',
        'Можем встретить на дороге — скажите заранее',
        'У нас есть мангал и дрова 🔥',
        'Wi-Fi пароль: Kolsai2026',
        'Ранний выезд возможен — предупредите накануне',
      ],
      messages: [
        { id: 'm1', from: 'them', text: 'Добро пожаловать в «Жетісу»!',      time: '10:00' },
        { id: 'm2', from: 'me',   text: 'Спасибо, выезжаем в 07:00',         time: '10:20' },
        { id: 'm3', from: 'them', text: 'Ваш номер готов, заезд с 14:00',     time: '10:45' },
      ],
    },
    {
      id: 'dm-baurjan', name: 'Бауыржан К. 🚌 Водитель', emoji: '🚌',
      lastMsg: 'Маршрут по Чарыну согласован', time: '15:20', unread: 1,
      partnerType: 'driver',
      autoReplies: [
        'Выезжаем из Алматы в 06:30, задержек нет',
        'Вход в Чарынский каньон — 500₸ с человека',
        'Обед организуем у реки 🌊',
        'Возвращение около 20:00 в Алматы',
        'В Делике есть розетки для зарядки',
      ],
      messages: [
        { id: 'm1', from: 'them', text: 'Здравствуйте! Маршрут по Чарыну согласован', time: '15:20' },
      ],
    },
    {
      id: 'dm-timur', name: 'Тимур Д. 🏕️ Прокат', emoji: '🏕️',
      lastMsg: 'Палатка готова к выдаче', time: '11:00', unread: 0,
      partnerType: 'shop',
      autoReplies: [
        'Палатка в отличном состоянии, все колышки на месте',
        'Залог возвращаем в день сдачи',
        'Адрес выдачи: ул. Абая 10, Алматы',
        'Работаем с 9:00 до 20:00',
        'Есть коврики и спальники — пишите если нужно',
      ],
      messages: [
        { id: 'm1', from: 'them', text: 'Палатка готова к выдаче! Когда приедете?', time: '11:00' },
      ],
    },
    {
      id: 'dm-erlan', name: 'Ерлан Б. 🏞️ Тур-зона', emoji: '🏞️',
      lastMsg: 'Юрты готовы, ждём вас!', time: '09:30', unread: 0,
      partnerType: 'tourzone',
      autoReplies: [
        'Юрты вмещают до 6 человек каждая',
        'Национальная кухня: бешбармак, куырдак, баурсаки 🍲',
        'Лошади доступны с 8:00 до 18:00',
        'Гид по каньону — 3000₸ за группу',
        'Душ и туалет есть на территории',
      ],
      messages: [
        { id: 'm1', from: 'them', text: 'Юрты готовы, ждём вас!', time: '09:30' },
      ],
    },
  ],
  trips: [
    {
      id: 'trip-kolsai', name: 'Кольсай — 30 июл 🏔️', emoji: '🚙',
      lastMsg: 'Нурлан: Не забудьте паспорта!', time: '07:55', unread: 5, members: 6,
      autoReplies: [
        'Отличная идея! 🙌',
        'Кто берёт трекинговые палки?',
        'Я возьму запасной газовый баллон',
        'Заряжайте powerbank — в горах связь плохая',
        'Встречаемся у ЦУМа в 06:50!',
        '🏔️ Поехали!!!',
        'Нурлан говорит — дорога займёт 4 часа',
        'Кто берёт аптечку?',
      ],
      messages: [
        { id: 'm1', from: 'Нурлан',  text: 'Группа создана! Выезд в 07:00 от ЦУМа', time: '07:00' },
        { id: 'm2', from: 'Дина',    text: 'Записалась! 🙌',                          time: '07:10' },
        { id: 'm3', from: 'Арман',   text: 'Тоже еду, хорошо подготовился',           time: '07:30' },
        { id: 'm4', from: 'Нурлан',  text: 'Не забудьте паспорта!',                   time: '07:55' },
      ],
    },
    {
      id: 'trip-charyn', name: 'Чарын — 31 июл 🦅', emoji: '🚌',
      lastMsg: 'Мадина: Я готова на рассвет!', time: '22:10', unread: 2, members: 8,
      autoReplies: [
        'Рассвет в 05:45 — успеем!',
        'Кто берёт штатив для фото?',
        'Вход в каньон — оплачиваем на месте',
        'После каньона купание в реке 🏊',
        'Возврат в Алматы около 20:00',
      ],
      messages: [
        { id: 'm1', from: 'Бауыржан', text: 'Чарын-чат создан! Выезд 06:30', time: '21:00' },
        { id: 'm2', from: 'Мадина',   text: 'Я готова на рассвет!',           time: '22:10' },
      ],
    },
  ],
  groups: [
    {
      id: 'gr-general', name: '📢 TAP Жетысу — Общий', emoji: '🌿',
      lastMsg: 'Мадина: Алаколь просто огонь!!!', time: 'вчера', unread: 12, members: 234,
      autoReplies: [
        'Кто-нибудь ездил на Бурхан-Булак в июле?',
        'Дорога до Алаколя — 7 часов. Стоит!',
        'TAP — лучший способ путешествовать по Казахстану 🇰🇿',
        'Новые маршруты добавлены в приложение!',
        'Кто едет на Чарын на следующей неделе?',
        'Алтын-Эмель закрыт для посещения в понедельник — ремонт дороги',
        'У кого есть рекомендации по Кольсайским озёрам?',
        'Поющий бархан в Алтын-Эмель — обязательно к посещению!',
      ],
      messages: [
        { id: 'm1', from: 'TAP',    text: 'Добро пожаловать в экосистему TAP! 🎉',  time: 'вчера' },
        { id: 'm2', from: 'Мадина', text: 'Алаколь просто огонь!!!',                 time: 'вчера' },
        { id: 'm3', from: 'Бауыр',  text: 'Кто едет на Чарын в эти выходные?',      time: 'вчера' },
      ],
    },
    {
      id: 'gr-photo', name: '📸 Фотографы Казахстана', emoji: '📷',
      lastMsg: 'Тимур: Новые фото с Кольсая', time: 'Сб', unread: 0, members: 89,
      autoReplies: [
        'Лучший свет на рассвете — 05:30 🌅',
        'Поляризационный фильтр обязателен у Алаколя',
        'Какой объектив брали на Чарын?',
        'Золотой час у Кольсая — просто магия ✨',
        'Делитесь координатами интересных мест!',
      ],
      messages: [
        { id: 'm1', from: 'Тимур',  text: 'Новые фото с Кольсая 📸', time: 'Сб' },
        { id: 'm2', from: 'Айгерим',text: 'Вау, какой закат!',        time: 'Сб' },
      ],
    },
    {
      id: 'gr-ecocamp', name: '🌿 Эко-туристы Казахстана', emoji: '🌿',
      lastMsg: 'Не оставляйте мусор в горах!', time: 'Пт', unread: 3, members: 512,
      autoReplies: [
        'Принцип: Leave No Trace — унеси всё с собой 🌱',
        'Биоразлагаемые средства гигиены — must have',
        'Кто участвует в уборке Кольсая 5 августа?',
        'Список eco-friendly снаряжения скинуть?',
        'Мы оставляем природу такой же чистой 💚',
      ],
      messages: [
        { id: 'm1', from: 'Алия', text: 'Не оставляйте мусор в горах!', time: 'Пт' },
      ],
    },
  ],
};

// ─── Bookings ────────────────────────────────────────────────
export const MOCK_BOOKINGS = [
  {
    id: 'bk1', touristName: 'Айдана С.', touristEmoji: '👩',
    serviceId: 's1', from: 'Алматы', to: 'Кольсай',
    date: '30 июл, 07:00', seats: 2, pricePerSeat: 15000,
    totalAmount: 33000, platformFee: 3000, partnerAmount: 30000,
    status: 'pending', qrCodeHash: 'TAP-BK1-KOLSAI-2026',
  },
  {
    id: 'bk2', touristName: 'Марат А.', touristEmoji: '🧑',
    serviceId: 's1', from: 'Алматы', to: 'Кольсай',
    date: '30 июл, 07:00', seats: 1, pricePerSeat: 15000,
    totalAmount: 16500, platformFee: 1500, partnerAmount: 15000,
    status: 'confirmed', qrCodeHash: 'TAP-BK2-KOLSAI-2026',
  },
];

// ─── Market Products ─────────────────────────────────────────
export const MOCK_MARKET = [
  // Палатки
  { id: 'mk1',  category: 'Палатки',   name: 'MSR Hubba Hubba NX 3',   brand: 'MSR',      price: 185000, emoji: '⛺', rating: 4.9, inStock: 3,  badge: 'TOP',     weight: '1.72 кг', description: 'Ультралёгкая 3-местная палатка 4-season. Идеал для Кольсая.' },
  { id: 'mk2',  category: 'Палатки',   name: 'Big Agnes Copper Spur 2', brand: 'Big Agnes', price: 210000, emoji: '⛺', rating: 4.8, inStock: 2,  badge: 'NEW',     weight: '1.08 кг', description: 'Сверхлёгкая двухместная для треккинга.' },
  { id: 'mk3',  category: 'Палатки',   name: 'Quechua MH100 2',        brand: 'Quechua',  price: 35000,  emoji: '⛺', rating: 4.3, inStock: 12, badge: null,      weight: '2.1 кг',  description: 'Бюджетная двухместная. Отличный выбор для начинающих.' },
  // Рюкзаки
  { id: 'mk4',  category: 'Рюкзаки',   name: 'Osprey Atmos AG 65',     brand: 'Osprey',   price: 145000, emoji: '🎒', rating: 4.9, inStock: 5,  badge: 'TOP',     weight: '2.1 кг',  description: 'Эргономичная система AntiGravity. Для многодневных походов.' },
  { id: 'mk5',  category: 'Рюкзаки',   name: 'Deuter Aircontact 55+10',brand: 'Deuter',   price: 98000,  emoji: '🎒', rating: 4.7, inStock: 8,  badge: null,      weight: '2.3 кг',  description: 'Немецкое качество. Вентилируемая спинка.' },
  { id: 'mk6',  category: 'Рюкзаки',   name: 'Gregory Baltoro 75',     brand: 'Gregory',  price: 178000, emoji: '🎒', rating: 4.8, inStock: 2,  badge: null,      weight: '2.35 кг', description: 'Для экспедиций. Максимальный комфорт нагрузки.' },
  // Спальники
  { id: 'mk7',  category: 'Спальники', name: 'Marmot Helium 15',        brand: 'Marmot',   price: 145000, emoji: '🛌', rating: 4.8, inStock: 4,  badge: 'POPULAR', weight: '567 г',   description: 'Пуховый до -9°C. Сверхлёгкий для треккинга.' },
  { id: 'mk8',  category: 'Спальники', name: 'Sea to Summit Spark SP I', brand: 'Sea2Summit',price:165000, emoji: '🛌', rating: 4.7, inStock: 3,  badge: null,      weight: '295 г',   description: 'Самый лёгкий пуховый спальник 15°C.' },
  { id: 'mk9',  category: 'Спальники', name: 'Quechua Trek 500 10°',    brand: 'Quechua',  price: 28000,  emoji: '🛌', rating: 4.2, inStock: 15, badge: null,      weight: '800 г',   description: 'Бюджетный синтетический. Для летних походов.' },
  // Обувь
  { id: 'mk10', category: 'Обувь',     name: 'Salomon X Ultra 4 GTX',  brand: 'Salomon',  price: 125000, emoji: '👟', rating: 4.9, inStock: 6,  badge: 'TOP',     weight: '670 г',   description: 'Лучшие треккинговые ботинки. Gore-Tex.' },
  { id: 'mk11', category: 'Обувь',     name: 'Scarpa Kinesis Pro GTX',  brand: 'Scarpa',   price: 145000, emoji: '👟', rating: 4.8, inStock: 3,  badge: null,      weight: '780 г',   description: 'Итальянские ботинки. Для сложных маршрутов.' },
  { id: 'mk12', category: 'Обувь',     name: 'Merrell Moab 3 GTX',     brand: 'Merrell',  price: 75000,  emoji: '👟', rating: 4.6, inStock: 10, badge: null,      weight: '540 г',   description: 'Универсальные и надёжные. Отличный выбор.' },
  // Навигация
  { id: 'mk13', category: 'Навигация', name: 'Garmin inReach Mini 2',   brand: 'Garmin',   price: 380000, emoji: '📡', rating: 5.0, inStock: 2,  badge: 'TOP',     weight: '100 г',   description: 'Спутниковый мессенджер + SOS. Must have в горах.' },
  { id: 'mk14', category: 'Навигация', name: 'Garmin eTrex 32x',        brand: 'Garmin',   price: 85000,  emoji: '🗺️', rating: 4.7, inStock: 5,  badge: null,      weight: '142 г',   description: 'GPS/GLONASS навигатор. Карты Казахстана.' },
  // Горелки
  { id: 'mk15', category: 'Горелки',   name: 'MSR Windburner Solo',     brand: 'MSR',      price: 62000,  emoji: '🔥', rating: 4.9, inStock: 8,  badge: 'POPULAR', weight: '353 г',   description: 'Ветрозащитная система. Закипает за 4.5 мин.' },
  { id: 'mk16', category: 'Горелки',   name: 'Jetboil Flash',           brand: 'Jetboil',  price: 54000,  emoji: '🔥', rating: 4.8, inStock: 6,  badge: null,      weight: '371 г',   description: 'Закипает за 100 секунд. Идеал для треккинга.' },
  // Одежда
  { id: 'mk17', category: 'Одежда',    name: 'Patagonia Nano Puff',     brand: 'Patagonia',price: 135000, emoji: '🧥', rating: 4.9, inStock: 4,  badge: 'TOP',     weight: '312 г',   description: 'Тонкий пуховик. PrimaLoft® утеплитель.' },
  { id: 'mk18', category: 'Одежда',    name: 'Arc\'teryx Beta AR Jacket',brand: 'Arc\'teryx',price:245000, emoji: '🧥', rating: 5.0, inStock: 2,  badge: 'NEW',     weight: '485 г',   description: 'Лучшая мембранная куртка. Gore-Tex Pro.' },
  { id: 'mk19', category: 'Одежда',    name: 'Icebreaker 200 Oasis LS', brand: 'Icebreaker',price: 65000, emoji: '👕', rating: 4.7, inStock: 12, badge: null,      weight: '175 г',   description: 'Мериносовая шерсть. Базовый слой.' },
];
