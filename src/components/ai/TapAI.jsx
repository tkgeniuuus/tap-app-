import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, MapPin, Clock, Wallet } from 'lucide-react';

/* ── Knowledge base ──────────────────────────────────────────── */
const DESTINATIONS = {
  kolsai: {
    name: 'Kolsai Lakes', emoji: '🏔️', region: 'Almaty Region',
    best: 'June–September', drive: '4–5h from Almaty',
    highlights: ['3 turquoise alpine lakes', 'Trekking routes', 'Horse riding', 'Camping'],
    accommodation: ['Guesthouse "Zhetysu" — 12,000 ₸/night', 'Camping — 3,000 ₸/tent'],
    transport: 'Toyota Land Cruiser 4x4 — 15,000 ₸/person',
    entry: '1,000 ₸/person',
    tips: 'Bring warm clothes — nights can drop to +5°C even in summer.',
  },
  charyn: {
    name: 'Charyn Canyon', emoji: '🏜️', region: 'Almaty Region',
    best: 'April–October', drive: '3–4h from Almaty',
    highlights: ['"Valley of Castles" canyon', 'Charyn River rafting', 'Night stargazing', 'Photography spots'],
    accommodation: ['Eco-camp by the river — 8,000 ₸/night', 'Day trip only possible'],
    transport: 'Minivan group transfer — 8,000 ₸/person',
    entry: '1,500 ₸/person',
    tips: 'Go early morning to avoid midday heat (up to +40°C in summer).',
  },
  alakol: {
    name: 'Alakol Lake', emoji: '🌊', region: 'East Kazakhstan',
    best: 'July–August', drive: '9h from Almaty / 1h by plane',
    highlights: ['Pink flamingos', 'Mineral water beaches', 'Windsurfing & kiting', 'Healing salt water'],
    accommodation: ['Beach resort — 20,000 ₸/night', 'Yurt camp — 15,000 ₸/night'],
    transport: 'Flight Almaty→Ust-Kamenogorsk + transfer — 35,000 ₸',
    entry: 'Free',
    tips: 'Book accommodation 2–3 weeks in advance in peak July–August season.',
  },
  altyn: {
    name: 'Altyn-Emel', emoji: '🦅', region: 'Almaty Region',
    best: 'March–May, Sep–Nov', drive: '4h from Almaty',
    highlights: ['Singing Barkhan sand dune', 'Wild onagers & gazelles', 'Aktau white mountains', 'Steppe safari'],
    accommodation: ['Park guesthouse — 10,000 ₸/night', 'Tent camping — 2,000 ₸'],
    transport: '4x4 required — from 18,000 ₸/person',
    entry: '1,500 ₸/person',
    tips: 'The dune "sings" loudest in dry wind — best experienced May or October.',
  },
  burkhan: {
    name: 'Burkhan-Bulak Waterfall', emoji: '💧', region: 'Almaty Region',
    best: 'May–September', drive: '5h from Almaty',
    highlights: ['Kazakhstan\'s tallest waterfall (80m)', 'Alpine meadows', 'River crossing', 'Wildlife'],
    accommodation: ['Camping only — bring tent', 'Village homestay — 7,000 ₸'],
    transport: '4x4 from 16,000 ₸/person',
    entry: 'Free',
    tips: 'Road is rough — only go with experienced 4x4 driver.',
  },
};

const QUICK_PROMPTS = [
  { text: 'Plan a 3-day Kolsai trip for 2 people', emoji: '🏔️' },
  { text: 'Best places to visit in Kazakhstan in July', emoji: '☀️' },
  { text: 'Budget trip for 4 people, 50,000 ₸', emoji: '💰' },
  { text: 'Charyn Canyon day trip from Almaty', emoji: '🏜️' },
];

/* ── AI Engine ───────────────────────────────────────────────── */
function generateResponse(input) {
  const q = input.toLowerCase();

  // ── Detect destination
  let dest = null;
  if (q.includes('kolsai') || q.includes('кольсай'))             dest = DESTINATIONS.kolsai;
  else if (q.includes('charyn') || q.includes('чарын'))          dest = DESTINATIONS.charyn;
  else if (q.includes('alakol') || q.includes('алаколь'))        dest = DESTINATIONS.alakol;
  else if (q.includes('altyn') || q.includes('алтын'))           dest = DESTINATIONS.altyn;
  else if (q.includes('burkhan') || q.includes('бурхан'))        dest = DESTINATIONS.burkhan;

  // ── Detect duration
  const durMatch = q.match(/(\d+)\s*(?:day|дн|ночи|night)/);
  const days = durMatch ? parseInt(durMatch[1]) : 3;

  // ── Detect group size
  const grpMatch = q.match(/(\d+)\s*(?:people|person|чел|человек)/);
  const people = grpMatch ? parseInt(grpMatch[1]) : 2;

  // ── Detect budget
  const budMatch = q.match(/(\d[\d\s]*)\s*(?:₸|tg|тг|тенге|k\b)/i);
  let budget = budMatch ? parseInt(budMatch[1].replace(/\s/g, '')) : null;
  if (budget && q.includes('k')) budget *= 1000;

  // ── "Best places" / general query
  if (!dest && (q.includes('best') || q.includes('where') || q.includes('recommend') || q.includes('лучш'))) {
    return `## 🇰🇿 Top Destinations in Kazakhstan

Here are the must-visit spots TAP recommends:

**🏔️ Kolsai Lakes** — 3 turquoise alpine lakes, 4–5h from Almaty. Best: June–Sep.
**🏜️ Charyn Canyon** — "Grand Canyon of Central Asia", 3h drive. Best: April–Oct.
**🌊 Alakol Lake** — Pink flamingos, healing salt water, windsurfing. Best: July–Aug.
**🦅 Altyn-Emel** — Singing sand dune & wild animals. Best: Spring / Autumn.
**💧 Burkhan-Bulak** — Kazakhstan's tallest waterfall (80m). Best: May–Sep.

Tell me which one interests you and I'll plan the full trip! 🗺️`;
  }

  // ── Budget-only query
  if (!dest && budget) {
    const perPerson = Math.round(budget / people);
    return `## 💰 Budget Trip Plan — ${budget.toLocaleString('ru')} ₸ for ${people} people

**Per person budget: ${perPerson.toLocaleString('ru')} ₸**

${perPerson < 20000
  ? `✅ **Charyn Canyon day trip** — perfect for tight budgets!
• Shared minivan: 8,000 ₸/person
• Entry fee: 1,500 ₸/person
• Lunch pack: 2,000 ₸/person
• **Total: ~11,500 ₸/person** ✅`
  : perPerson < 50000
  ? `✅ **Kolsai Lakes — 2 nights** — great value!
• 4x4 transport: 15,000 ₸/person
• Guesthouse (2 nights): 24,000 ₸
• Meals & entry: 8,000 ₸
• **Total: ~38,500 ₸/person** ✅`
  : `✅ **Alakol Lake — 3 nights** — premium experience!
• Flight + transfer: 35,000 ₸/person
• Beach resort (3 nights): 60,000 ₸
• Meals & activities: 15,000 ₸
• **Total: ~80,000 ₸/person** ✅`}

Want me to build a full day-by-day itinerary? Just say which destination! 🎯`;
  }

  // ── Full trip plan for a specific destination
  if (dest) {
    const transportCost = parseInt(dest.transport.match(/[\d,]+/)?.[0] || '15000');
    const accomCost     = parseInt(dest.accommodation[0].match(/[\d,]+/)?.[0] || '12000');
    const totalPerPerson = transportCost + (accomCost * days / people) + 8000 + parseInt(dest.entry);

    const itinerary = Array.from({ length: Math.min(days, 4) }, (_, i) => {
      if (i === 0) return `**📅 Day 1 — Travel Day**
• Early morning departure from Almaty
• ${dest.transport}
• Arrive & check in: ${dest.accommodation[0]}
• Afternoon: First exploration of ${dest.name}
• Evening: Campfire / local dinner`;
      if (i === days - 1) return `**📅 Day ${i + 1} — Departure**
• Morning walk & breakfast
• Photo session at the best viewpoint
• Pack up and head back to Almaty
• Arrive Almaty ~evening`;
      return `**📅 Day ${i + 1} — Explore**
• ${dest.highlights[i % dest.highlights.length]}
• ${dest.highlights[(i + 1) % dest.highlights.length]}
• Local meal & rest`;
    }).join('\n\n');

    return `## ${dest.emoji} ${dest.name} — ${days}-Day Trip for ${people} ${people === 1 ? 'person' : 'people'}

📍 **${dest.region}** · 🚗 ${dest.drive} · ⭐ Best season: ${dest.best}

### Highlights
${dest.highlights.map(h => `• ${h}`).join('\n')}

---

${itinerary}

---

### 💰 Budget Estimate (per person)
| Item | Cost |
|---|---|
| Transport (round-trip) | ${transportCost.toLocaleString('ru')} ₸ |
| Accommodation (${days - 1} nights) | ${(accomCost * (days - 1) / people).toLocaleString('ru')} ₸ |
| Meals & extras | 8,000 ₸ |
| Entry fee | ${dest.entry} |
| **Total per person** | **~${totalPerPerson.toLocaleString('ru')} ₸** |

### 💡 Pro Tips
${dest.tips}

### 🛒 Pack from TAP Market
• Sleeping bag, tent, trekking poles — available to rent!

Ready to book? I can find available transport and accommodation on TAP right now! 🚀`;
  }

  // ── Greeting
  if (q.match(/^(hi|hello|hey|привет|сәлем)/)) {
    return `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.

I can help you:
• 🗺️ **Plan any trip** — just tell me where & when
• 💰 **Find options for your budget**
• 📦 **Build a packing list**
• 🏨 **Compare accommodation & transport**

Where do you want to go? 🌄`;
  }

  // ── Packing list
  if (q.includes('pack') || q.includes('bring') || q.includes('gear') || q.includes('взять')) {
    return `## 🎒 Essential Packing List for Kazakhstan Mountains

**Clothing**
• Warm jacket (nights can be cold even in summer)
• Rain jacket / poncho
• Hiking boots with ankle support
• Thermal base layer
• Hat, gloves (above 2000m)

**Gear**
• Tent + sleeping bag (rated to +5°C minimum)
• 30–40L backpack
• Trekking poles
• Headlamp + extra batteries
• Water filter or purification tablets

**Health & Safety**
• Sunscreen SPF 50+
• Altitude sickness pills (Acetazolamide)
• First aid kit
• Emergency whistle

**Documents**
• ID / Passport
• TAP QR code (your bookings)
• Emergency contacts saved offline

🛒 You can rent tents, sleeping bags & trekking poles directly from TAP Market!`;
  }

  // ── Default fallback
  return `I'm here to help plan your Kazakhstan adventure! 🌄

Try asking me:
• *"Plan a 3-day trip to Kolsai for 2 people"*
• *"Best places to visit in summer"*
• *"Budget trip for 4 people, 80,000 ₸"*
• *"What to pack for mountains?"*

Where would you like to go? 🗺️`;
}

/* ── Message bubble ──────────────────────────────────────────── */
function Bubble({ msg }) {
  const isMe = msg.from === 'user';
  return (
    <div className={`flex items-end gap-2 mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blazing-orange to-orange-600
          flex items-center justify-center flex-shrink-0 self-end">
          <Sparkles size={14} className="text-white" />
        </div>
      )}
      <motion.div
        className={`max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isMe
            ? 'bg-blazing-orange text-white rounded-br-sm'
            : 'bg-card-mid text-text-light rounded-bl-sm'
        }`}
          dangerouslySetInnerHTML={{ __html: msg.text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/## (.+)/g, '<p class="font-black text-white text-base mb-1">$1</p>')
            .replace(/### (.+)/g, '<p class="font-bold text-white mt-2 mb-1">$1</p>')
            .replace(/\| (.+) \|/g, (m) => `<span class="font-mono text-xs">${m}</span>`)
          }}
        />
        <span className="text-[10px] text-text-muted mt-1 mx-1">{msg.time}</span>
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
  const [messages, setMessages] = useState([
    {
      id: 0, from: 'ai', time: now(),
      text: `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nTell me where you want to go and I'll plan the perfect trip — routes, budget, accommodation, packing list, everything. 🌄\n\nWhere are we headed?`,
    },
  ]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text = input.trim()) => {
    if (!text) return;
    const userMsg = { id: ++msgId, from: 'user', time: now(), text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 900 + Math.random() * 800;
    setTimeout(() => {
      const reply = generateResponse(text);
      setTyping(false);
      setMessages(prev => [...prev, { id: ++msgId, from: 'ai', time: now(), text: reply }]);
    }, delay);
  };

  const reset = () => {
    setMessages([{
      id: ++msgId, from: 'ai', time: now(),
      text: `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nTell me where you want to go and I'll plan the perfect trip! 🌄`,
    }]);
    setInput('');
    setTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blazing-orange to-orange-600
            flex items-center justify-center" style={{ boxShadow: '0 4px 16px rgba(255,90,0,0.4)' }}>
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">TAP AI</p>
            <p className="text-glacial-cyan text-[10px]">Kazakhstan Travel Assistant</p>
          </div>
        </div>
        <motion.button onClick={reset} whileTap={{ scale: 0.88 }}
          className="w-8 h-8 rounded-xl bg-card-mid flex items-center justify-center text-text-muted">
          <RotateCcw size={14} />
        </motion.button>
      </div>

      {/* Quick prompts (show only at start) */}
      {messages.length <= 1 && (
        <div className="px-4 pt-3 flex flex-col gap-2 flex-shrink-0">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1">Quick start</p>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        <AnimatePresence>
          {typing && <motion.div key="typing"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <TypingDots />
          </motion.div>}
        </AnimatePresence>
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/5 bg-card-dark flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 bg-card-mid rounded-2xl px-4 py-3
          border border-white/8 focus-within:border-blazing-orange/40 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything about travel in Kazakhstan..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-text-muted"
          />
        </div>
        <motion.button onClick={() => send()} disabled={!input.trim()} whileTap={{ scale: 0.85 }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
            input.trim() ? 'bg-blazing-orange text-white' : 'bg-card-mid text-text-muted'
          }`}>
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}
