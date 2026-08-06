import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MOCK_MARKET } from '../../data/mockData';
import { ShoppingCart, Star, Plus, Minus, X, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['Все', 'Палатки', 'Рюкзаки', 'Спальники', 'Обувь', 'Навигация', 'Горелки', 'Одежда'];

const BADGE_STYLES = {
  TOP:     { bg: '#7C3AED22', color: '#A78BFA', label: '⭐ TOP'    },
  NEW:     { bg: '#10B98122', color: '#34D399', label: '✨ NEW'    },
  POPULAR: { bg: '#0EA5E922', color: '#38BDF8', label: '🔥 ХИТ'   },
};

// ─── Animated number ──────────────────────────────────────────
function Price({ value }) {
  return <span>{value.toLocaleString('ru')} ₸</span>;
}

// ─── Cart Sheet ───────────────────────────────────────────────
function CartSheet({ open, onClose }) {
  const { state, dispatch, showToast } = useApp();
  const cart  = state.cart || [];
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = () => {
    if (state.user.wallet < total) {
      showToast('❌ Недостаточно средств на балансе', 'error'); return;
    }
    dispatch({ type: 'CHECKOUT_CART' });
    showToast('✅ Заказ оформлен! Снаряжение готовится к выдаче.');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div className="absolute inset-0 bg-black/70" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="relative w-full max-w-[480px] bg-card-mid rounded-t-[32px] pb-8 z-10 max-h-[85vh] flex flex-col"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-4 flex-shrink-0" />
        <div className="flex items-center justify-between px-5 mb-4 flex-shrink-0">
          <h2 className="text-white font-black text-lg">🛒 Корзина</h2>
          <button onClick={onClose}><X size={20} className="text-text-muted" /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center pb-10 text-text-muted">
            <span className="text-5xl mb-3">🛒</span>
            <p className="text-sm">Корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {cart.map(item => (
                <div key={item.productId} className="flex items-center gap-3 py-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-card-dark flex items-center justify-center text-2xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-glacial-cyan text-xs font-bold"><Price value={item.price} /></p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button whileTap={{ scale: 0.85 }}
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId })}
                      className="w-7 h-7 rounded-lg bg-card-dark flex items-center justify-center">
                      <Minus size={12} className="text-text-muted" />
                    </motion.button>
                    <span className="text-white font-bold w-4 text-center">{item.qty}</span>
                    <motion.button whileTap={{ scale: 0.85 }}
                      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                      className="w-7 h-7 rounded-lg bg-card-dark flex items-center justify-center">
                      <Plus size={12} className="text-text-muted" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="px-5 pt-4 flex-shrink-0">
              <div className="flex justify-between mb-1">
                <span className="text-text-muted text-sm">Товаров: {cart.reduce((s, i) => s + i.qty, 0)} шт.</span>
                <span className="text-white font-black text-lg"><Price value={total} /></span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-text-muted text-xs">Ваш баланс</span>
                <span className={`text-xs font-semibold ${state.user.wallet >= total ? 'text-glacial-cyan' : 'text-red-400'}`}>
                  <Price value={state.user.wallet} />
                </span>
              </div>
              <motion.button
                onClick={checkout}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl bg-blazing-orange text-white font-black text-base shadow-orange"
              >
                ✅ Оформить заказ
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const { state } = useApp();
  const cartItem  = state.cart?.find(i => i.productId === product.id);
  const inCart    = cartItem?.qty > 0;
  const bs        = BADGE_STYLES[product.badge];

  return (
    <motion.div
      className="bg-card-dark rounded-[24px] p-4 border border-white/5 flex flex-col"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Product top */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-14 h-14 rounded-2xl bg-card-light flex items-center justify-center text-3xl flex-shrink-0"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}>
          {product.emoji}
        </div>
        {bs && (
          <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ background: bs.bg, color: bs.color }}>
            {bs.label}
          </span>
        )}
      </div>

      {/* Name + brand */}
      <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wide mb-0.5">{product.brand}</p>
      <p className="text-white font-bold text-sm leading-snug mb-1">{product.name}</p>

      {/* Rating + weight */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-0.5">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-text-muted">{product.rating}</span>
        </div>
        {product.weight && (
          <span className="text-text-muted text-[10px]">· {product.weight}</span>
        )}
        <span className={`text-[10px] font-semibold ml-auto ${product.inStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {product.inStock > 0 ? `${product.inStock} в наличии` : 'Нет'}
        </span>
      </div>

      {/* Price */}
      <p className="text-glacial-cyan font-black text-xl mb-3">
        <Price value={product.price} />
      </p>

      {/* Add to cart */}
      <motion.button
        onClick={() => onAdd(product)}
        disabled={product.inStock === 0}
        whileTap={{ scale: 0.93 }}
        className={`w-full py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all
          ${inCart
            ? 'bg-glacial-cyan/15 text-glacial-cyan border border-glacial-cyan/30'
            : product.inStock === 0
              ? 'bg-card-light text-text-muted cursor-not-allowed'
              : 'bg-blazing-orange text-white shadow-orange'}`}
      >
        {inCart ? (
          <><CheckCircle2 size={15} /> В корзине ({cartItem.qty})</>
        ) : product.inStock === 0 ? (
          'Нет в наличии'
        ) : (
          <><Plus size={15} /> В корзину</>
        )}
      </motion.button>
    </motion.div>
  );
}

// ─── Main Market Tab ──────────────────────────────────────────
export default function MarketTab() {
  const { state, dispatch, showToast } = useApp();
  const [category, setCategory] = useState('Все');
  const [search,   setSearch]   = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = (state.cart || []).reduce((s, i) => s + i.qty, 0);

  const products = useMemo(() => {
    let list = MOCK_MARKET;
    if (category !== 'Все') list = list.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return list;
  }, [category, search]);

  const addToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { productId: product.id, name: product.name, price: product.price, emoji: product.emoji },
    });
    showToast(`🛒 ${product.name} добавлен в корзину!`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-2 pb-3 flex-shrink-0">
        {/* Search bar + cart button */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-card-dark rounded-2xl px-3 py-2.5
            border border-white/5 focus-within:border-glacial-cyan/40 transition-colors">
            <Search size={15} className="text-text-muted flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск снаряжения..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-text-muted"
            />
            {search && (
              <button onClick={() => setSearch('')}><X size={14} className="text-text-muted" /></button>
            )}
          </div>
          <motion.button
            onClick={() => setCartOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="relative w-11 h-11 rounded-2xl bg-card-dark border border-white/5
              flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-text-light" />
            {cartCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blazing-orange
                  flex items-center justify-center"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span className="text-white text-[9px] font-black">{cartCount}</span>
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat)}
              whileTap={{ scale: 0.92 }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all
                ${category === cat
                  ? 'bg-blazing-orange text-white shadow-orange'
                  : 'bg-card-dark text-text-muted border border-white/5'}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Product count */}
      <div className="px-4 mb-2 flex-shrink-0">
        <p className="text-text-muted text-xs">
          {products.length} {products.length === 1 ? 'товар' : products.length < 5 ? 'товара' : 'товаров'}
          {category !== 'Все' && ` · ${category}`}
        </p>
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={category + search}
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {products.map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <ProductCard product={product} onAdd={addToCart} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-text-muted">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>

      {/* Cart sheet */}
      <AnimatePresence>
        {cartOpen && <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
