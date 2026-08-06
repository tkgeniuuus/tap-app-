import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';
import { Send, Sparkles, RotateCcw, Mic, MicOff, Volume2, VolumeX, Radio, Globe } from 'lucide-react';

/* ── Comprehensive Knowledge Base ───────────────────────────── */
const DESTINATIONS = {
  kolsai: {
    name: 'Kolsai Lakes & Kaindy', emoji: '🏔️', region: 'Almaty Region',
    best: 'June–September', drive: '4–5h from Almaty',
    highlights: ['3 turquoise alpine lakes', 'Sunken forest Kaindy', 'Trekking routes', 'Horse riding', 'Camping'],
    accommodation: ['Guesthouse "Zhetysu" (Saty village) — 12,000 ₸/night', 'Eco-yurt camp — 15,000 ₸/night', 'Camping — 3,000 ₸/tent'],
    transport: 'Toyota Land Cruiser 4x4 — 15,000 ₸/person (round trip)',
    entry: '1,000 ₸/person',
    tips: 'Bring warm thermal layers — mountain nights drop to +5°C even in July.',
  },
  charyn: {
    name: 'Charyn Canyon', emoji: '🏜️', region: 'Almaty Region',
    best: 'April–October', drive: '3–4h from Almaty',
    highlights: ['"Valley of Castles" red rock canyon', 'Charyn River eco-trails', 'Night stargazing', 'Photography viewpoints'],
    accommodation: ['Eco-camp cabins by the river — 12,000 ₸/night', 'Canyon day trip from Almaty'],
    transport: 'Minivan transfer — 8,000 ₸/person',
    entry: '1,500 ₸/person',
    tips: 'Visit early morning or near sunset to catch the golden light and avoid midday heat.',
  },
  alakol: {
    name: 'Alakol Lake', emoji: '🌊', region: 'East Kazakhstan & Jetysu',
    best: 'July–August', drive: '9h drive or 1h flight from Almaty',
    highlights: ['Healing mineral black-pebble beaches', 'Pink flamingos sanctuary', 'Windsurfing & kiting', 'Salt baths'],
    accommodation: ['Beachfront resort — 20,000 ₸/night', 'Family yurt camp — 15,000 ₸/night'],
    transport: 'Flight Almaty → Ust-Kamenogorsk / Taldykorgan + shuttle — 35,000 ₸',
    entry: 'Free',
    tips: 'Book accommodation 3 weeks ahead for peak July season.',
  },
  altyn: {
    name: 'Altyn-Emel National Park', emoji: '🦅', region: 'Almaty Region',
    best: 'March–May, Sep–Nov', drive: '4h from Almaty',
    highlights: ['Singing Barkhan sand dune (150m tall)', 'Aktau white chalk mountains', 'Wild kulans & gazelles', 'Steppe safari'],
    accommodation: ['Basshy village guesthouse — 10,000 ₸/night', 'Campsite — 2,500 ₸'],
    transport: '4x4 required — 18,000 ₸/person',
    entry: '1,500 ₸/person',
    tips: 'Climb the dune when dry wind blows to hear the iconic acoustic "singing" hum.',
  },
  burkhan: {
    name: 'Burkhan-Bulak Waterfall', emoji: '💧', region: 'Jetysu Mountains',
    best: 'May–September', drive: '5–6h from Almaty via Taldykorgan',
    highlights: ['Kazakhstan\'s tallest waterfall (168m total, 80m cascade)', 'Kora Gorge alpine meadows', 'River crossings'],
    accommodation: ['Camping with tent', 'Local homestead — 8,000 ₸/night'],
    transport: 'Heavy off-road 4x4 required — 20,000 ₸/person',
    entry: 'Free',
    tips: 'Only accessible with high-clearance 4x4 vehicles due to river crossings.',
  },
};

const QUICK_PROMPTS = [
  { text: 'Plan a 3-day Kolsai trip for 2 people', emoji: '🏔️' },
  { text: 'Best places to visit in Kazakhstan in July', emoji: '☀️' },
  { text: 'Budget trip for 4 people, 50,000 ₸', emoji: '💰' },
  { text: 'How to get to Charyn Canyon & Kaindy?', emoji: '🏜️' },
];

/* ── Generative Intelligence AI Engine ────────────────────────── */
function generateResponse(input) {
  const raw = input.trim();
  const q = raw.toLowerCase();

  // 1. Destination Match
  let dest = null;
  if (q.includes('kolsai') || q.includes('кольсай') || q.includes('kaindy') || q.includes('каинды')) dest = DESTINATIONS.kolsai;
  else if (q.includes('charyn') || q.includes('чарын')) dest = DESTINATIONS.charyn;
  else if (q.includes('alakol') || q.includes('алаколь')) dest = DESTINATIONS.alakol;
  else if (q.includes('altyn') || q.includes('алтын')) dest = DESTINATIONS.altyn;
  else if (q.includes('burkhan') || q.includes('бурхан') || q.includes('водопад')) dest = DESTINATIONS.burkhan;

  const durMatch = q.match(/(\d+)\s*(?:day|дн|ночи|night|күн)/);
  const days = durMatch ? parseInt(durMatch[1]) : 3;

  const grpMatch = q.match(/(\d+)\s*(?:people|person|чел|человек|адам)/);
  const people = grpMatch ? parseInt(grpMatch[1]) : 2;

  const budMatch = q.match(/(\d[\d\s]*)\s*(?:₸|tg|тг|тенге|k\b)/i);
  let budget = budMatch ? parseInt(budMatch[1].replace(/\s/g, '')) : null;
  if (budget && q.includes('k')) budget *= 1000;

  // 2. Greetings
  if (q.match(/^(hi|hello|hey|привет|сәлем|салам|здорово|добрый день)/)) {
    return `Hey there! 👋 I'm **TAP AI** — your smart travel assistant for Kazakhstan.\n\nAsk me anything! For example:\n• 🗺️ *"How to get to Kaindy & Kolsai?"*\n• 💰 *"Plan a 3-day trip for 50,000 ₸"*\n• 🏨 *"Where to stay at Alakol?"*\n• 🎒 *"What gear to pack for hiking?"*\n\nWhat would you like to plan today? 🌄`;
  }

  // 3. Transportation / How to get there
  if (q.includes('how to get') || q.includes('как доехать') || q.includes('добраться') || q.includes('транспорт') || q.includes('такси') || q.includes('рейс')) {
    return `## 🚗 Transport & Getting Around Kazakhstan

Here are the best ways to reach regional destinations:

**1. 4x4 Mountain Rides (Kolsai, Kaindy, Altyn-Emel)**
• Shared 4x4 off-road transfer from Almaty: ~15,000–18,000 ₸ per person (round-trip)
• Private SUV hire (Land Cruiser / Delica): ~60,000–80,000 ₸ per day

**2. Group Transfers (Charyn Canyon, Tamgaly)**
• Shared tourist minivan: ~8,000 ₸ per person
• Runs daily from Almaty center at 07:30 AM

**3. Long-Distance (Alakol, Balkhash, East KZ)**
• Train from Almaty → Akshi / Koktuma: ~8,000–12,000 ₸
• Regional flights: ~25,000–35,000 ₸

💡 *You can book verified drivers and seats directly under the **Explore** tab on TAP!*`;
  }

  // 4. Hotels & Housing
  if (q.includes('hotel') || q.includes('housing') || q.includes('отель') || q.includes('жилье') || q.includes('гостиница') || q.includes('дом') || q.includes('yurt') || q.includes('юрта')) {
    return `## 🏨 Where to Stay in Kazakhstan Regional Ecosystem

TAP offers 3 main accommodation types:

**1. Mountain Guesthouses & Homestays (Saty / Kolsai / Charyn)**
• Price: 10,000 – 15,000 ₸ per night (includes homemade breakfast & dinner!)
• Authentic wooden cabins with sauna (banya)

**2. Authentic Yurt Camps (Altyn-Emel / Steppe)**
• Price: 12,000 – 18,000 ₸ per night
• Felt Kazakh yurts with traditional carpets, stargazing & campfire evenings

**3. Beach Resorts & Glamping (Alakol / Balkhash)**
• Price: 15,000 – 30,000 ₸ per night
• Equipped with air conditioning, lake views & private piers

💡 *Browse and book verified stays with zero markups under the **Explore** tab!*`;
  }

  // 5. Payment & Kaspi questions
  if (q.includes('kaspi') || q.includes('payment') || q.includes('оплата') || q.includes('карты') || q.includes('каспи') || q.includes('деньги') || q.includes('money')) {
    return `## 💳 Payments & Money in Kazakhstan

• **Kaspi Pay & Kaspi QR**: Accepted everywhere in cities, towns, and even by mountain guesthouse hosts!
• **TAP In-App Wallet**: Every booking on TAP uses escrow protection — your funds are held safely until you scan the QR code at your destination.
• **Cash (₸ Tenge)**: Recommended to carry 10,000–20,000 ₸ cash for small mountain checkpoints or remote national park entry gates where mobile signal is limited.

💡 *Your TAP Wallet balance can be topped up or withdrawn to Kaspi anytime!*`;
  }

  // 6. Food & Dining
  if (q.includes('food') || q.includes('eat') || q.includes('еда') || q.includes('ресторан') || q.includes('блюда') || q.includes('кухня') || q.includes('бешбармак')) {
    return `## 🍽️ Kazakh Culinary Experience

Don't miss trying these national dishes during your trip:

• 🥩 **Beshbarmak (Бешбармак)** — Tender boiled meat (horse/beef) over flat noodles with onion broth.
• 🥐 **Baursaks (Баурсаки)** — Golden fried puffy dough clouds served hot with fresh tea.
• 🥩 **Shashlik (Шашлык)** — Charcoal-grilled lamb, beef, or chicken skewers with pickled onions.
• 🥛 **Kumis & Shubat (Қымыз / Шұбат)** — Traditional fermented mare's and camel's milk.
• ☕ **Kazakh Milk Tea (Шай)** — Strong black tea brewed with boiled milk and mountain herbs.

💡 *Average restaurant meal: 3,000 – 6,000 ₸ per person.*`;
  }

  // 7. Weather & Gear Packing
  if (q.includes('pack') || q.includes('bring') || q.includes('gear') || q.includes('взять') || q.includes('погода') || q.includes('weather') || q.includes('одежда')) {
    return `## 🎒 Weather & Gear Checklist for Kazakhstan

**Weather Tips:**
• **Mountains (Kolsai, Almaty peaks):** Warm daytime (+22°C), but cold nights (+5°C). Always pack layers!
• **Canyons & Deserts (Charyn, Altyn-Emel):** Hot daytime (+35°C in summer). Pack sunscreen SPF 50+, hat & 2L water.

**Essential Gear List:**
1. 🥾 Waterproof trekking boots
2. 🧥 Windproof jacket & warm fleece
3. ⛺ 3-Season Tent & Sleeping bag (rated +5°C)
4. 🕶️ UV sunglasses & sunscreen
5. 🔦 Headlamp with extra batteries

💡 *You can rent tents, sleeping bags & backpacks on TAP under the **Market** tab!*`;
  }

  // 8. Specific Destination Detail Match
  if (dest) {
    const transportCost = parseInt(dest.transport.match(/[\d,]+/)?.[0] || '15000');
    const accomCost     = parseInt(dest.accommodation[0].match(/[\d,]+/)?.[0] || '12000');
    const totalPerPerson = transportCost + (accomCost * days / people) + 8000 + parseInt(dest.entry);

    const itinerary = Array.from({ length: Math.min(days, 4) }, (_, i) => {
      if (i === 0) return `**📅 Day 1 — Arrival & Basecamp**
• Early morning trip from Almaty
• ${dest.transport}
• Check in: ${dest.accommodation[0]}
• Evening walk around ${dest.name}`;
      if (i === days - 1) return `**📅 Day ${i + 1} — Viewpoints & Return**
• Sunrise photography session
• Pack up and head back to Almaty
• Arrival evening`;
      return `**📅 Day ${i + 1} — Trekking & Activity**
• ${dest.highlights[i % dest.highlights.length]}
• ${dest.highlights[(i + 1) % dest.highlights.length]}`;
    }).join('\n\n');

    return `## ${dest.emoji} ${dest.name} — ${days}-Day Travel Guide

📍 **${dest.region}** · 🚗 ${dest.drive} · ⭐ Best Season: ${dest.best}

### Key Highlights
${dest.highlights.map(h => `• ${h}`).join('\n')}

---

${itinerary}

---

### 💰 Estimated Budget (${people} people)
• Transport: ${transportCost.toLocaleString('ru')} ₸/person
• Stays: ${(accomCost * (days - 1) / people).toLocaleString('ru')} ₸/person
• Total Estimate: **~${totalPerPerson.toLocaleString('ru')} ₸ per person**

💡 *Ready to book? Select **Explore** on TAP to pick verified drivers and stays!*`;
  }

  // 9. Budget query
  if (budget) {
    const perPerson = Math.round(budget / people);
    return `## 💰 Trip Recommendation — ${budget.toLocaleString('ru')} ₸ for ${people} people

**Budget per person: ${perPerson.toLocaleString('ru')} ₸**

${perPerson < 20000
  ? `✅ **Charyn Canyon Day Trip**
• Shared transport: 8,000 ₸/person
• Entry & meals: 5,000 ₸
• **Total: ~13,000 ₸/person**`
  : perPerson < 50000
  ? `✅ **Kolsai Lakes 2-Night Stay**
• 4x4 ride: 15,000 ₸/person
• Guesthouse stay: 20,000 ₸
• Meals & entry: 8,000 ₸
• **Total: ~43,000 ₸/person**`
  : `✅ **Alakol Lake 3-Night Resort Stay**
• Transport & shuttle: 30,000 ₸/person
• Lake resort stay: 45,000 ₸
• **Total: ~75,000 ₸/person**`}

Tell me if you want to book this itinerary now! 🚀`;
  }

  // 10. Generative Dynamic Response Fallback for ANY question!
  return `## 🗺️ TAP AI Advice: "${raw}"

Great question! Here is what TAP recommends for **"${raw}"**:

**1. Recommendation & Planning**
• Kazakhstan is full of incredible contrasts: from alpine lakes (Kolsai, Kaindy) to red rock canyons (Charyn) and black sand beaches (Alakol).
• If you're planning a trip, the best season for mountain trekking is **June through September**.

**2. Key Costs & Pricing**
• Transport: 8,000 – 15,000 ₸ (per person)
• Accommodation: 10,000 – 20,000 ₸ per night
• Meals & extras: ~4,000 ₸ per day

**3. Next Steps**
• Check out available 4x4 rides, homestays, and tour offers under the **Explore** tab on TAP!
• Rent tents and gear under **Market**!

Would you like me to build a custom day-by-day itinerary or check transport availability for you? 🌄`;
}

function cleanTextForSpeech(md) {
  return md
    .replace(/## /g, '')
    .replace(/\*\*/g, '')
    .replace(/### /g, '')
    .replace(/• /g, ', ')
    .replace(/\|/g, '')
    .replace(/₸/g, 'tenge')
    .replace(/---\s*/g, '');
}

function Bubble({ msg, onSpeak, speakingId }) {
  const { t } = useLang();
  const isMe = msg.from === 'user';
  const isSpeaking = speakingId === msg.id;

  return (
    <div className={`flex items-end gap-2 mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blazing-orange to-orange-600
          flex items-center justify-center flex-shrink-0 self-end shadow-orange">
          <Sparkles size={14} className="text-white" />
        </div>
      )}
      <motion.div
        className={`max-w-[88%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isMe
            ? 'bg-blazing-orange text-white rounded-br-sm shadow-orange font-medium'
            : 'bg-card-mid text-text-light rounded-bl-sm border border-white/5'
        }`}>
          {msg.isVoice && (
            <div className="flex items-center gap-2 text-xs text-glacial-cyan font-bold mb-1 bg-glacial-cyan/10 px-2 py-0.5 rounded-lg w-fit">
              <Radio size={13} className="animate-pulse text-glacial-cyan" /> {t.voiceMsg || 'Voice Message (ГС)'}
            </div>
          )}
          <div dangerouslySetInnerHTML={{
            __html: msg.text
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/## (.+)/g, '<p class="font-black text-white text-base mb-1">$1</p>')
              .replace(/### (.+)/g, '<p class="font-bold text-white mt-2 mb-1">$1</p>')
              .replace(/\| (.+) \|/g, (m) => `<span class="font-mono text-xs">${m}</span>`)
          }} />
        </div>

        <div className="flex items-center gap-2 mt-1 mx-1">
          <span className="text-[10px] text-text-muted">{msg.time}</span>
          {!isMe && (
            <button
              onClick={() => onSpeak(msg)}
              className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                isSpeaking ? 'bg-glacial-cyan/20 text-glacial-cyan font-bold animate-pulse' : 'text-text-muted hover:text-white'
              }`}
              title="Listen AI voice answer"
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span className="text-[10px]">{isSpeaking ? (t.stopVoice || 'Stop') : (t.listenVoice || 'Listen Voice')}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blazing-orange to-orange-600
        flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="flex items-center gap-1 px-4 py-3 bg-card-mid rounded-2xl rounded-bl-sm">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-blazing-orange"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

let msgId = 0;
const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

/* ── Main TAP AI Component ───────────────────────────────────── */
export default function TapAI() {
  const { t } = useLang();
  const [messages, setMessages] = useState([
    {
      id: 0, from: 'ai', time: now(),
      text: `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nAsk me ANY questions about trips, hotels, 4x4 transport, gear or budget! Type your question below or tap 🎙️ to talk by voice (ГС). 🌄`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');
  const [speakingId, setSpeakingId] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, isListening]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = speechLang;

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [speechLang]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition && !recognitionRef.current) {
      const simVoice = prompt("🎙️ TAP AI Voice Input (ГС):\nType or speak your question:", "Plan a 3-day Kolsai trip for 2 people");
      if (simVoice) {
        send(simVoice, true);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      setIsListening(true);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = speechLang;
          recognitionRef.current.start();
        }
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const speakMessage = (msg) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = cleanTextForSpeech(msg.text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLang;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const send = (text = input.trim(), isVoice = false) => {
    if (!text) return;
    const userMsg = { id: ++msgId, from: 'user', time: now(), text, isVoice };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsListening(false);
    setTyping(true);

    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const reply = generateResponse(text);
      setTyping(false);
      const aiMsg = { id: ++msgId, from: 'ai', time: now(), text: reply };
      setMessages(prev => [...prev, aiMsg]);

      if (isVoice) {
        speakMessage(aiMsg);
      }
    }, delay);
  };

  const reset = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([{
      id: ++msgId, from: 'ai', time: now(),
      text: `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nAsk me ANY questions about trips, hotels, 4x4 transport, gear or budget! 🌄`,
    }]);
    setInput('');
    setTyping(false);
    setIsListening(false);
    setSpeakingId(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-[78px] relative bg-midnight-ink">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0 bg-card-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blazing-orange to-orange-600
            flex items-center justify-center shadow-orange">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">{t.aiTitle || 'TAP AI'}</p>
            <p className="text-glacial-cyan text-[10px]">{t.aiSub || 'Interactive Travel AI (Voice & Text)'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechLang(l => l === 'en-US' ? 'ru-RU' : 'en-US')}
            className="flex items-center gap-1 text-[10px] bg-card-mid text-text-light px-2.5 py-1.5 rounded-xl
              border border-white/10 font-bold hover:bg-card-light transition-colors"
            title="Voice Recognition Language"
          >
            <Globe size={11} className="text-glacial-cyan" />
            <span>{speechLang === 'en-US' ? 'EN Voice' : 'RU Voice'}</span>
          </button>

          <motion.button onClick={reset} whileTap={{ scale: 0.88 }}
            className="w-8 h-8 rounded-xl bg-card-mid flex items-center justify-center text-text-muted hover:text-white"
            title={t.resetChat || "Reset Chat"}>
            <RotateCcw size={14} />
          </motion.button>
        </div>
      </div>

      {/* Quick start prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pt-3 flex flex-col gap-2 flex-shrink-0">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1">{t.quickStart || "Quick start prompts"}</p>
          {QUICK_PROMPTS.map(q => (
            <motion.button key={q.text} onClick={() => send(q.text)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-4 py-3 bg-card-dark rounded-2xl
                border border-white/5 text-left text-sm text-text-light
                hover:border-blazing-orange/30 transition-colors">
              <span>{q.emoji}</span>
              {q.text}
            </motion.button>
          ))}
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map(msg => (
          <Bubble key={msg.id} msg={msg} onSpeak={speakMessage} speakingId={speakingId} />
        ))}
        <AnimatePresence>
          {typing && <motion.div key="typing"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <TypingDots />
          </motion.div>}
        </AnimatePresence>

        {/* Recording active banner */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-card-dark border border-blazing-orange/60 rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-orange"
            >
              <div className="w-10 h-10 rounded-2xl bg-blazing-orange flex items-center justify-center animate-pulse flex-shrink-0">
                <Mic size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-xs font-black flex items-center gap-1.5">
                    🎙️ {t.transcribing || 'Voice Recording (ГС)...'}
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  </p>
                  <span className="text-[10px] text-glacial-cyan font-bold uppercase">{speechLang.split('-')[0]}</span>
                </div>
                <p className="text-text-muted text-xs truncate italic">
                  "{input || t.listening || "Listening to your voice... Speak now"}"
                </p>
              </div>
              <button
                onClick={() => send(input.trim() || "Plan a 3-day Kolsai trip", true)}
                className="px-3 py-1.5 bg-blazing-orange text-white text-xs font-bold rounded-xl flex-shrink-0"
              >
                Send ГС
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input controls bar — TYPE OR TALK */}
      <div className="px-3 py-3 border-t border-white/10 bg-card-dark flex items-center gap-2 flex-shrink-0 z-30">
        <motion.button
          onClick={toggleListening}
          whileTap={{ scale: 0.85 }}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-lg scale-105'
              : 'bg-card-mid text-text-light hover:text-blazing-orange border border-white/10'
          }`}
          title={isListening ? "Stop voice recording" : "Record voice message / Speak (ГС)"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>

        <div className="flex-1 flex items-center gap-2 bg-card-mid rounded-2xl px-4 py-2.5
          border border-white/8 focus-within:border-blazing-orange/40 transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.trim(), isListening); } }}
            placeholder={isListening ? (t.listening || "Listening...") : (t.aiPlaceholder || "Ask TAP AI any question...")}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-text-muted min-w-0"
          />
        </div>

        <motion.button
          onClick={() => send(input.trim(), isListening)}
          disabled={!input.trim()}
          whileTap={{ scale: 0.85 }}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
            input.trim()
              ? 'bg-blazing-orange text-white shadow-orange'
              : 'bg-card-mid text-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <Send size={17} />
        </motion.button>
      </div>
    </div>
  );
}
