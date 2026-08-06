import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Mic, MicOff, Volume2, VolumeX, Radio, Check, Globe } from 'lucide-react';

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

/* ── AI Intelligence Engine ───────────────────────────────────── */
function generateResponse(input) {
  const q = input.toLowerCase();

  let dest = null;
  if (q.includes('kolsai') || q.includes('кольсай'))             dest = DESTINATIONS.kolsai;
  else if (q.includes('charyn') || q.includes('чарын'))          dest = DESTINATIONS.charyn;
  else if (q.includes('alakol') || q.includes('алаколь'))        dest = DESTINATIONS.alakol;
  else if (q.includes('altyn') || q.includes('алтын'))           dest = DESTINATIONS.altyn;
  else if (q.includes('burkhan') || q.includes('бурхан'))        dest = DESTINATIONS.burkhan;

  const durMatch = q.match(/(\d+)\s*(?:day|дн|ночи|night)/);
  const days = durMatch ? parseInt(durMatch[1]) : 3;

  const grpMatch = q.match(/(\d+)\s*(?:people|person|чел|человек)/);
  const people = grpMatch ? parseInt(grpMatch[1]) : 2;

  const budMatch = q.match(/(\d[\d\s]*)\s*(?:₸|tg|тг|тенге|k\b)/i);
  let budget = budMatch ? parseInt(budMatch[1].replace(/\s/g, '')) : null;
  if (budget && q.includes('k')) budget *= 1000;

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

Ready to book? I can find available transport and accommodation on TAP right now! 🚀`;
  }

  if (q.match(/^(hi|hello|hey|привет|сәлем)/)) {
    return `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nI can plan trips, estimate budgets, recommend hotels or drivers, and build packing lists. You can **type or talk to me by voice (гс / voice message)** anytime! 🎙️\n\nWhere do you want to go? 🌄`;
  }

  if (q.includes('pack') || q.includes('bring') || q.includes('gear') || q.includes('взять')) {
    return `## 🎒 Essential Packing List for Kazakhstan Mountains

**Clothing**
• Warm jacket (nights can be cold even in summer)
• Rain jacket / poncho
• Hiking boots with ankle support

**Gear**
• Tent + sleeping bag (rated to +5°C minimum)
• 30–40L backpack
• Trekking poles

**Health & Safety**
• Sunscreen SPF 50+
• First aid kit
• Emergency whistle

🛒 You can rent tents, sleeping bags & trekking poles directly from TAP Market!`;
  }

  return `I'm TAP AI, ready to assist your Kazakhstan journey! 🌄\n\nYou can ask me by **typing or speaking by voice (гс / voice)**:\n• *"Plan a 3-day trip to Kolsai for 2 people"*\n• *"Best places to visit in summer"*\n• *"Budget trip for 4 people, 80,000 ₸"*\n\nWhere shall we explore? 🗺️`;
}

/* ── Clean text for Speech Synthesis ──────────────────────────── */
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

/* ── Message bubble ──────────────────────────────────────────── */
function Bubble({ msg, onSpeak, speakingId }) {
  const isMe = msg.from === 'user';
  const isSpeaking = speakingId === msg.id;

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
        }`}>
          {msg.isVoice && (
            <div className="flex items-center gap-2 text-xs text-glacial-cyan font-bold mb-1 bg-glacial-cyan/10 px-2 py-0.5 rounded-lg w-fit">
              <Radio size={13} className="animate-pulse text-glacial-cyan" /> Voice Message (ГС)
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
              title="Listen AI audio answer"
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span className="text-[10px]">{isSpeaking ? 'Stop Voice' : 'Listen Voice'}</span>
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
  const [messages, setMessages] = useState([
    {
      id: 0, from: 'ai', time: now(),
      text: `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nYou can **type OR talk using voice (ГС / voice message)**! Tap the microphone 🎙️ below to speak or type in text. 🌄`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US'); // 'en-US' | 'ru-RU'
  const [speakingId, setSpeakingId] = useState(null);

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, isListening]);

  // Setup Web Speech Recognition if supported
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
      // Fallback: Voice Recording simulation prompt for unsupported environments
      const simVoice = prompt("🎙️ TAP AI Voice Recorder (ГС):\nSpeak or enter your voice message query:", "Plan a 3-day Kolsai trip for 2 people");
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

    const delay = 900 + Math.random() * 800;
    setTimeout(() => {
      const reply = generateResponse(text);
      setTyping(false);
      const aiMsg = { id: ++msgId, from: 'ai', time: now(), text: reply };
      setMessages(prev => [...prev, aiMsg]);

      // If spoken by voice, speak AI response back out loud
      if (isVoice) {
        speakMessage(aiMsg);
      }
    }, delay);
  };

  const reset = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([{
      id: ++msgId, from: 'ai', time: now(),
      text: `Hey! 👋 I'm **TAP AI** — your Kazakhstan travel assistant.\n\nType or speak by voice (гс) to plan your next trip! 🌄`,
    }]);
    setInput('');
    setTyping(false);
    setIsListening(false);
    setSpeakingId(null);
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
            <p className="text-glacial-cyan text-[10px]">Type & Voice AI Assistant (ГС)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speech recognition language toggle */}
          <button
            onClick={() => setSpeechLang(l => l === 'en-US' ? 'ru-RU' : 'en-US')}
            className="flex items-center gap-1 text-[10px] bg-card-mid text-text-light px-2.5 py-1 rounded-xl
              border border-white/10 font-bold hover:bg-card-light transition-colors"
            title="Speech Recognition Language"
          >
            <Globe size={11} className="text-glacial-cyan" />
            <span>{speechLang === 'en-US' ? 'EN Voice' : 'RU Voice'}</span>
          </button>

          <motion.button onClick={reset} whileTap={{ scale: 0.88 }}
            className="w-8 h-8 rounded-xl bg-card-mid flex items-center justify-center text-text-muted hover:text-white">
            <RotateCcw size={14} />
          </motion.button>
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pt-3 flex flex-col gap-2 flex-shrink-0">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1">Quick start prompts</p>
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

        {/* Recording active banner & animated soundwave */}
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
                    🎙️ Voice Recording (ГС)...
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  </p>
                  <span className="text-[10px] text-glacial-cyan font-bold uppercase">{speechLang.split('-')[0]}</span>
                </div>
                <p className="text-text-muted text-xs truncate italic">
                  "{input || "Listening to your voice... Speak now into your mic"}"
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
      <div className="px-3 py-3 border-t border-white/5 bg-card-dark flex items-center gap-2 flex-shrink-0">
        {/* Voice mic button for Voice Message / ГС */}
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

        {/* Text typing field */}
        <div className="flex-1 flex items-center gap-2 bg-card-mid rounded-2xl px-4 py-2.5
          border border-white/8 focus-within:border-blazing-orange/40 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.trim(), isListening); } }}
            placeholder={isListening ? "Listening to voice..." : "Type text or press mic for voice (гс)..."}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-text-muted min-w-0"
          />
        </div>

        {/* Send message button */}
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
