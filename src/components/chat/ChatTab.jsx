import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { SegmentedControl } from '../ui';
import { Send, ArrowLeft, Image, Smile, X } from 'lucide-react';

const EMOJI_QUICK = ['😊','🔥','👍','❤️','😂','🏔️','🌊','✅','💪','🎉','🙏','⛺'];

// ─── Typing dots ──────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-card-mid rounded-2xl rounded-bl-sm w-fit">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-text-muted"
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────
function Bubble({ msg, chatEmoji }) {
  const isMe    = msg.from === 'me';
  const isGroup = !isMe && msg.from !== 'them';

  return (
    <div className={`flex items-end gap-2 mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-card-light flex items-center justify-center
          text-base flex-shrink-0 self-end">
          {chatEmoji}
        </div>
      )}
      <motion.div
        className={`max-w-[78%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {isGroup && (
          <span className="text-[11px] text-text-muted font-medium ml-1">{msg.from}</span>
        )}
        {msg.image && (
          <div className={`rounded-2xl overflow-hidden max-w-[200px] ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
            <img src={msg.image} alt="photo" className="w-full object-cover max-h-48" />
          </div>
        )}
        {msg.text ? (
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-snug
            ${isMe
              ? 'bg-blazing-orange text-white rounded-br-sm'
              : 'bg-card-mid text-text-light rounded-bl-sm'}`}>
            {msg.text}
          </div>
        ) : null}
        <span className="text-[10px] text-text-muted mx-1">{msg.time}</span>
      </motion.div>
      {isMe && (
        <div className="w-8 h-8 rounded-full bg-blazing-orange flex items-center justify-center
          text-xs font-black text-white flex-shrink-0 self-end">
          Я
        </div>
      )}
    </div>
  );
}

// ─── Chat Room ────────────────────────────────────────────────
function ChatRoom({ chat, category, onBack }) {
  const { t }    = useLang();
  const { state, dispatch } = useApp();
  const [input,     setInput]     = useState('');
  const [typing,    setTyping]    = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const typingTimer = useRef(null);

  // Live chat from state so auto-replies update in real time
  const liveChat = (state.chats[category] || []).find(c => c.id === chat.id) || chat;
  const messages = liveChat.messages || [];
  const autoReplies = liveChat.autoReplies || [];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typing]);

  const fireAutoReply = useCallback(() => {
    if (!autoReplies.length) return;
    const text  = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    const delay = 1500 + Math.random() * 1200;

    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          category,
          chatId: chat.id,
          message: text,
          time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
        },
      });
    }, delay);
  }, [autoReplies, category, chat.id, dispatch]);

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const sendText = () => {
    const text = input.trim();
    if (!text) return;
    dispatch({
      type: 'SEND_MESSAGE',
      payload: {
        category, chatId: chat.id, message: text,
        time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
      },
    });
    setInput('');
    setShowEmoji(false);
    fireAutoReply();
  };

  const sendImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch({
        type: 'SEND_IMAGE',
        payload: {
          category, chatId: chat.id, image: ev.target.result,
          time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
        },
      });
      fireAutoReply();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-card-mid flex items-center justify-center
            text-text-muted active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-xl">{liveChat.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{liveChat.name}</p>
          <AnimatePresence mode="wait">
            {typing ? (
              <motion.p key="typing" className="text-glacial-cyan text-xs"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                печатает...
              </motion.p>
            ) : (
              <motion.p key="status" className="text-text-muted text-xs"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {liveChat.members ? `${liveChat.members} участников` : 'в сети'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((msg, i) => (
          <Bubble key={msg.id || i} msg={msg} chatEmoji={liveChat.emoji} />
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div className="flex items-end gap-2 mb-3"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="w-8 h-8 rounded-full bg-card-light flex items-center justify-center text-base flex-shrink-0">
                {liveChat.emoji}
              </div>
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Emoji quick-pick */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            className="flex gap-2.5 px-4 py-3 border-t border-white/5 bg-card-dark overflow-x-auto scrollbar-hide flex-shrink-0"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 56, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {EMOJI_QUICK.map(em => (
              <button key={em}
                onClick={() => setInput(v => v + em)}
                className="text-2xl flex-shrink-0 active:scale-75 transition-transform">
                {em}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar — always at bottom */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-white/5 bg-card-dark flex-shrink-0">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={sendImage} />

        {/* Photo */}
        <motion.button whileTap={{ scale: 0.85 }}
          onClick={() => fileRef.current?.click()}
          className="w-9 h-9 rounded-xl bg-card-mid flex items-center justify-center text-text-muted flex-shrink-0">
          <Image size={16} />
        </motion.button>

        {/* Text field */}
        <div className="flex-1 flex items-center gap-2 bg-card-mid rounded-2xl px-3 py-2.5
          border border-white/8 focus-within:border-glacial-cyan/50 transition-colors min-w-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); }
            }}
            placeholder={t.typeMessage || 'Сообщение...'}
            className="flex-1 bg-transparent text-white text-sm outline-none
              placeholder-text-muted min-w-0 w-full"
          />
          <button onClick={() => setShowEmoji(v => !v)}
            className="text-text-muted hover:text-blazing-orange transition-colors flex-shrink-0">
            <Smile size={16} />
          </button>
        </div>

        {/* Send */}
        <motion.button
          onClick={sendText}
          disabled={!input.trim()}
          whileTap={{ scale: 0.85 }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            input.trim()
              ? 'bg-blazing-orange text-white shadow-orange'
              : 'bg-card-mid text-text-muted'
          }`}
        >
          <Send size={15} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Chat list item ───────────────────────────────────────────
function ChatListItem({ chat, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-4 py-4 border-b border-white/5 last:border-0
        active:bg-card-mid/60 transition-colors text-left"
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-card-mid flex items-center justify-center text-2xl">
          {chat.emoji}
        </div>
        {chat.unread > 0 && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-blazing-orange
              flex items-center justify-center px-1"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
          >
            <span className="text-white text-[9px] font-black">{chat.unread > 9 ? '9+' : chat.unread}</span>
          </motion.div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-white font-semibold text-sm truncate">{chat.name}</p>
          <span className="text-text-muted text-xs flex-shrink-0">{chat.time}</span>
        </div>
        <p className="text-text-muted text-xs truncate mt-0.5">{chat.lastMsg}</p>
        {chat.members && (
          <p className="text-text-muted text-[10px] mt-0.5">👥 {chat.members} участников</p>
        )}
      </div>
    </motion.button>
  );
}

// ─── Main ChatTab ─────────────────────────────────────────────
export default function ChatTab({ defaultChatTarget, onChatTargetConsumed, onRoomOpen, onRoomClose }) {
  const { t }    = useLang();
  const { state } = useApp();
  const [subTab,     setSubTab]     = useState('dms');
  const [activeChat, setActiveChat] = useState(null);
  const [activeCtg,  setActiveCtg]  = useState(null);

  // Deep-link: auto-open a chat when tapped from BookingTab
  useEffect(() => {
    if (!defaultChatTarget) return;
    const { chatId, category = 'dms' } = defaultChatTarget;
    const found = (state.chats[category] || []).find(c => c.id === chatId);
    if (found) {
      setSubTab(category);
      setActiveChat(found);
      setActiveCtg(category);
      onRoomOpen?.();
    }
    onChatTargetConsumed?.();
  }, [defaultChatTarget]);

  const openRoom = (chat, cat) => {
    setActiveChat(chat);
    setActiveCtg(cat);
    onRoomOpen?.();
  };

  const closeRoom = () => {
    setActiveChat(null);
    setActiveCtg(null);
    onRoomClose?.();
  };

  const tabs = [
    { value: 'dms',    label: t.dms       },
    { value: 'trips',  label: t.tripChats },
    { value: 'groups', label: t.groups    },
  ];

  const chats = state.chats[subTab] || [];

  // ── Chat room view ──
  if (activeChat) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatRoom chat={activeChat} category={activeCtg} onBack={closeRoom} />
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-2 pb-3 flex-shrink-0">
        <SegmentedControl options={tabs} value={subTab} onChange={setSubTab} />
      </div>
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div key={subTab}
            initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.15 }}>
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-text-muted gap-3">
                <span className="text-4xl">💬</span>
                <p className="text-sm">Нет чатов</p>
              </div>
            ) : chats.map(chat => (
              <ChatListItem key={chat.id} chat={chat} onClick={() => openRoom(chat, subTab)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
