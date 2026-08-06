import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Toast } from '../../components/ui';
import StoriesBar  from '../../components/stories/StoriesBar';
import BookingTab  from '../../components/booking/BookingTab';
import MapTab      from '../../components/map/MapTab';
import ChatTab     from '../../components/chat/ChatTab';
import ProfileTab  from '../../components/profile/ProfileTab';
import MarketTab   from '../../components/market/MarketTab';
import TapAI       from '../../components/ai/TapAI';
import CreateTour  from '../../components/tours/CreateTour';
import { LayoutGrid, Map, MessageCircle, User, ShoppingBag, Sparkles, PlusCircle } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'booking',     Icon: LayoutGrid,   label: 'Explore'  },
  { id: 'market',      Icon: ShoppingBag,  label: 'Market'   },
  { id: 'ai',          Icon: Sparkles,     label: 'TAP AI'   },
  { id: 'create_tour', Icon: PlusCircle,   label: 'My Tour'  },
  { id: 'chat',        Icon: MessageCircle,label: 'Chat'     },
  { id: 'profile',     Icon: User,         label: 'Profile'  },
];

const PAGE_TITLES = {
  booking:     'Explore',
  market:      '🏪 Gear Market',
  ai:          '✨ TAP AI',
  create_tour: '🗺️ Create Tour',
  chat:        'Messages',
  profile:     'My Profile',
};

export default function TouristShell() {
  const { lang, changeLang, LANGS } = useLang();
  const { state, dispatch } = useApp();
  const [activeTab,  setActiveTab]  = useState('booking');
  const [langOpen,   setLangOpen]   = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [navHidden,  setNavHidden]  = useState(false);

  // Handle OPEN_CHAT from BookingTab / AI
  useEffect(() => {
    if (state.pendingChat) {
      setActiveTab('chat');
      setChatTarget(state.pendingChat);
      dispatch({ type: 'CLEAR_PENDING_CHAT' });
    }
  }, [state.pendingChat]);

  const unread    = Object.values(state.chats).flat().reduce((n, c) => n + (c.unread || 0), 0);
  const cartCount = (state.cart || []).reduce((s, i) => s + i.qty, 0);

  const switchTab = (id) => {
    setActiveTab(id);
    if (id !== 'chat') setNavHidden(false);
  };

  return (
    <div className="tap-screen relative overflow-hidden">
      <Toast toast={state.toast} />

      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blazing-orange flex items-center justify-center"
            style={{ boxShadow: '0 2px 12px rgba(255,90,0,0.5)' }}>
            <span className="text-white font-black text-sm">T</span>
          </div>
          <div>
            <span className="text-white font-black text-lg">TAP</span>
            <span className="text-text-muted text-xs ml-1.5">Zhetysu</span>
          </div>
        </div>

        {/* Lang picker */}
        <div className="relative">
          <button onClick={() => setLangOpen(v => !v)}
            className="text-xs bg-card-mid text-text-light px-3 py-1.5 rounded-xl
              border border-white/5 font-semibold hover:bg-card-light transition-colors">
            {LANGS.find(l => l.code === lang)?.label ?? 'ENG'}
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div className="absolute right-0 top-9 bg-card-mid border border-white/10 rounded-2xl
                overflow-hidden z-50 min-w-[80px] shadow-glass"
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}>
                {LANGS.map(({ code, label }) => (
                  <button key={code} onClick={() => { changeLang(code); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                      lang === code ? 'text-blazing-orange' : 'text-text-light hover:bg-card-light'}`}>
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Stories (explore tab only) ─────────── */}
      {activeTab === 'booking' && (
        <div className="flex-shrink-0 border-b border-white/5">
          <StoriesBar />
        </div>
      )}

      {/* ── Page title ────────────────────────── */}
      {!navHidden && (
        <div className="px-4 pt-2 pb-1 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.h2 key={activeTab} className="text-white font-black text-xl"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              {PAGE_TITLES[activeTab]}
            </motion.h2>
          </AnimatePresence>
        </div>
      )}

      {/* ── Main content ──────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}>

            {activeTab === 'booking' && (
              <BookingTab onChatWith={(chatId, cat) =>
                dispatch({ type: 'OPEN_CHAT', payload: { chatId, category: cat || 'dms' } })}
              />
            )}
            {activeTab === 'market'      && <MarketTab />}
            {activeTab === 'ai'          && <TapAI />}
            {activeTab === 'create_tour' && <CreateTour />}
            {activeTab === 'chat'        && (
              <ChatTab
                defaultChatTarget={chatTarget}
                onChatTargetConsumed={() => setChatTarget(null)}
                onRoomOpen={()  => setNavHidden(true)}
                onRoomClose={() => setNavHidden(false)}
              />
            )}
            {activeTab === 'profile' && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Nav ────────────────────────── */}
      <AnimatePresence>
        {!navHidden && (
          <motion.nav className="bottom-nav"
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
            {NAV_ITEMS.map(({ id, Icon, label }) => {
              const active = activeTab === id;
              const badge  = id === 'chat'   && unread    > 0 ? unread
                           : id === 'market' && cartCount > 0 ? cartCount
                           : null;
              const isAI   = id === 'ai';
              return (
                <motion.button key={id} onClick={() => switchTab(id)}
                  className="nav-item relative" whileTap={{ scale: 0.85 }}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    active
                      ? isAI ? '' : 'bg-blazing-orange'
                      : 'bg-transparent'
                  }`}
                  style={active && isAI ? {
                    background: 'linear-gradient(135deg, #FF5A00, #FF8A42)',
                    boxShadow: '0 4px 16px rgba(255,90,0,0.5)',
                  } : active ? {
                    boxShadow: '0 4px 16px rgba(255,90,0,0.4)',
                  } : {}}>
                    <Icon size={18} className={active ? 'text-white' : 'text-text-muted'} />
                  </div>
                  {badge && (
                    <div className="absolute top-0.5 right-1 min-w-[16px] h-4 rounded-full bg-red-500
                      flex items-center justify-center px-0.5">
                      <span className="text-white text-[9px] font-black">{badge > 9 ? '9+' : badge}</span>
                    </div>
                  )}
                  <span className={`text-[9px] font-semibold transition-colors ${
                    active ? 'text-blazing-orange' : 'text-text-muted'}`}>
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
