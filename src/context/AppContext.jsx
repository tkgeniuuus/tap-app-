import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import {
  MOCK_USER, MOCK_PARTNER_USER, MOCK_SERVICES, MOCK_CAMPS,
  MOCK_STORIES, MOCK_CHATS, MOCK_BOOKINGS,
} from '../data/mockData';

const buildInitial = () => {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('tap_state') || 'null'); } catch { return null; }
  })();
  return {
    onboarded:   !!localStorage.getItem('tap_onboarded'),
    role:        localStorage.getItem('tap_role') || null,
    partnerType: localStorage.getItem('tap_partner_type') || null,
    user:        MOCK_USER,
    partnerUser: MOCK_PARTNER_USER,
    services:    saved?.services   || MOCK_SERVICES,
    camps:       saved?.camps      || MOCK_CAMPS,
    stories:     saved?.stories    || MOCK_STORIES,
    chats:       saved?.chats      || MOCK_CHATS,
    bookings:    saved?.bookings   || MOCK_BOOKINGS,
    myBookings:  saved?.myBookings || [],
    wallet:      saved?.wallet     || MOCK_PARTNER_USER.totalRevenue,
    cart:        saved?.cart       || [],          // market cart
    pendingChat: null,                             // { category, chatId } — открыть чат при переходе
    toast: null,
  };
};

function reducer(state, action) {
  switch (action.type) {

    // ── Onboarding ───────────────────────────────────────────
    case 'SET_ONBOARDED':
      localStorage.setItem('tap_onboarded', '1');
      return { ...state, onboarded: true };

    case 'SET_ROLE':
      localStorage.setItem('tap_role', action.payload);
      return { ...state, role: action.payload };

    case 'SET_PARTNER_TYPE':
      localStorage.setItem('tap_partner_type', action.payload);
      return { ...state, partnerType: action.payload };

    case 'REGISTER_TOURIST':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case 'REGISTER_PARTNER':
      return {
        ...state,
        partnerUser: { ...state.partnerUser, ...action.payload },
      };

    // ── Pending chat navigation ───────────────────────────────
    case 'OPEN_CHAT':
      return { ...state, pendingChat: action.payload };
    case 'CLEAR_PENDING_CHAT':
      return { ...state, pendingChat: null };

    // ── Booking ──────────────────────────────────────────────
    case 'BOOK_SERVICE': {
      const { serviceId, seats, totalAmount, platformFee, partnerAmount } = action.payload;
      const qrCodeHash = `TAP-${Date.now().toString(36).toUpperCase()}`;
      const svc = state.services.find(s => s.id === serviceId);

      const newMyBooking = {
        id: `bk-${Date.now()}`,
        serviceId, seats, totalAmount, platformFee, partnerAmount,
        status: 'confirmed', qrCodeHash,
        from: svc?.from || '', to: svc?.to || svc?.name || '',
        date: new Date().toLocaleDateString('ru-KZ'),
        partnerChatId: svc?.partnerChatId || null,
        partnerName:   svc?.driver || svc?.host || svc?.owner || svc?.name || 'Партнёр',
      };

      const newB2BOrder = {
        id: `b2b-${Date.now()}`,
        touristName: state.user.name, touristEmoji: '👩',
        serviceId, from: svc?.from || '', to: svc?.to || svc?.name || '',
        date: newMyBooking.date, seats, pricePerSeat: svc?.pricePerSeat || svc?.price || 0,
        totalAmount, platformFee, partnerAmount,
        status: 'pending', qrCodeHash,
      };

      const services = state.services.map(s =>
        s.id === serviceId
          ? { ...s, bookedSeats: Math.min((s.bookedSeats || 0) + seats, s.totalSeats || 99) }
          : s
      );

      // Auto-send booking notification into partner DM
      let chats = state.chats;
      if (svc?.partnerChatId) {
        const dms = [...(state.chats.dms || [])];
        const idx = dms.findIndex(c => c.id === svc.partnerChatId);
        const notif = {
          id: `notif-${Date.now()}`, from: 'me',
          text: `Забронировал(а) ${seats} мест — ${svc.from || ''} → ${svc.to || svc.name || ''}. Жду подтверждения!`,
          time: new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
        };
        if (idx !== -1) {
          dms[idx] = { ...dms[idx], messages: [...dms[idx].messages, notif], lastMsg: notif.text, unread: 0 };
        }
        chats = { ...state.chats, dms };
      }

      return {
        ...state, services, chats,
        myBookings: [...state.myBookings, newMyBooking],
        bookings:   [...state.bookings,   newB2BOrder],
      };
    }

    case 'ACCEPT_ORDER': {
      const bookings = state.bookings.map(b =>
        b.id === action.payload ? { ...b, status: 'confirmed' } : b
      );
      return { ...state, bookings };
    }

    case 'REJECT_ORDER': {
      const bookings = state.bookings.map(b =>
        b.id === action.payload ? { ...b, status: 'rejected' } : b
      );
      return { ...state, bookings };
    }

    case 'COMPLETE_BY_QR': {
      const { qrHash } = action.payload;
      const bookings   = state.bookings.map(b =>
        b.qrCodeHash === qrHash ? { ...b, status: 'completed' } : b
      );
      const myBookings = state.myBookings.map(b =>
        b.qrCodeHash === qrHash ? { ...b, status: 'completed' } : b
      );
      const completed  = state.bookings.find(b => b.qrCodeHash === qrHash);
      const wallet     = state.wallet + (completed ? completed.partnerAmount : 15000);
      return { ...state, bookings, myBookings, wallet };
    }

    // ── Chat ─────────────────────────────────────────────────
    case 'SEND_MESSAGE': {
      const { category, chatId, message, time } = action.payload;
      const chatList = [...(state.chats[category] || [])];
      const idx = chatList.findIndex(c => c.id === chatId);
      if (idx === -1) return state;
      const newMsg = {
        id: `msg-${Date.now()}`, from: 'me', text: message,
        time: time || new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
      };
      chatList[idx] = { ...chatList[idx], messages: [...chatList[idx].messages, newMsg], lastMsg: message, time: newMsg.time, unread: 0 };
      return { ...state, chats: { ...state.chats, [category]: chatList } };
    }

    case 'SEND_IMAGE': {
      const { category, chatId, image, time } = action.payload;
      const chatList = [...(state.chats[category] || [])];
      const idx = chatList.findIndex(c => c.id === chatId);
      if (idx === -1) return state;
      const imgMsg = {
        id: `img-${Date.now()}`, from: 'me', text: '', image,
        time: time || new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
      };
      chatList[idx] = { ...chatList[idx], messages: [...chatList[idx].messages, imgMsg], lastMsg: '📷 Фото', time: imgMsg.time, unread: 0 };
      return { ...state, chats: { ...state.chats, [category]: chatList } };
    }

    case 'RECEIVE_MESSAGE': {
      const { category, chatId, message, time } = action.payload;
      const chatList = [...(state.chats[category] || [])];
      const idx = chatList.findIndex(c => c.id === chatId);
      if (idx === -1) return state;
      const autoMsg = {
        id: `auto-${Date.now()}`, from: 'them', text: message,
        time: time || new Date().toLocaleTimeString('ru-KZ', { hour: '2-digit', minute: '2-digit' }),
      };
      chatList[idx] = { ...chatList[idx], messages: [...chatList[idx].messages, autoMsg], lastMsg: message, time: autoMsg.time };
      return { ...state, chats: { ...state.chats, [category]: chatList } };
    }

    // ── Stories ──────────────────────────────────────────────
    case 'ADD_STORY': {
      const newStory = {
        id: `st-${Date.now()}`, userId: 'me', userName: state.user.name,
        userEmoji: '👩', location: action.payload.location || 'Казахстан',
        caption: action.payload.caption || '', timestamp: Date.now(),
        likes: 0, bgColor: action.payload.bgColor || '#1a2a1a',
        emoji: action.payload.emoji || '🌿', live: true,
        image: action.payload.image || null,
      };
      return { ...state, stories: [newStory, ...state.stories] };
    }

    case 'LIKE_STORY': {
      const stories = state.stories.map(s => s.id === action.payload ? { ...s, likes: s.likes + 1 } : s);
      return { ...state, stories };
    }

    // ── Camps ────────────────────────────────────────────────
    case 'JOIN_CAMP': {
      const camps = state.camps.map(c =>
        c.id === action.payload ? { ...c, current: Math.min(c.current + 1, c.max) } : c
      );
      return { ...state, camps };
    }

    // ── Market / Cart ─────────────────────────────────────────
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId);
      const cart = existing
        ? state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { ...action.payload, qty: 1 }];
      return { ...state, cart };
    }

    case 'REMOVE_FROM_CART': {
      const cart = state.cart
        .map(i => i.productId === action.payload ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'CHECKOUT_CART': {
      const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
      return { ...state, cart: [], user: { ...state.user, wallet: state.user.wallet - total } };
    }

    // ── Custom tours ───────────────────────────────────────────
    case 'ADD_CUSTOM_TOUR':
      return { ...state, services: [action.payload, ...state.services] };

    // ── Toast ─────────────────────────────────────────────────
    case 'SHOW_TOAST': return { ...state, toast: action.payload };
    case 'HIDE_TOAST':  return { ...state, toast: null };

    default: return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitial);
  const persistTimer = useRef(null);

  useEffect(() => {
    clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      const { services, camps, stories, chats, bookings, myBookings, wallet, cart } = state;
      try { localStorage.setItem('tap_state', JSON.stringify({ services, camps, stories, chats, bookings, myBookings, wallet, cart })); }
      catch { /* full */ }
    }, 400);
  }, [state]);

  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3500);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const showToast = useCallback((msg, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { msg, type } });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
