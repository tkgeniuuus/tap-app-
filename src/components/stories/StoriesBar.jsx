import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { Modal } from '../ui';
import { Heart, X, Plus, MapPin, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';

const BG_OPTIONS = [
  { emoji: '🏔️', bg: '#1a3a5c' },
  { emoji: '🌅', bg: '#4a2000' },
  { emoji: '🌊', bg: '#003d4d' },
  { emoji: '🏜️', bg: '#3d2400' },
  { emoji: '🌿', bg: '#1a3d1a' },
  { emoji: '⛄', bg: '#1a2a3d' },
  { emoji: '🌸', bg: '#3d1a2a' },
  { emoji: '⭐', bg: '#2a2000' },
];

// ─── Story Viewer ─────────────────────────────────────────────
function StoryViewer({ stories, startIndex, onClose }) {
  const [idx,      setIdx]     = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const { dispatch, state } = useApp();
  const [liked, setLiked] = useState(new Set());
  const story = stories[idx];
  const DURATION = story?.image ? 7000 : 5000; // longer for photos

  // Progress timer
  useEffect(() => {
    setProgress(0);
    if (!story) return;
    const start = Date.now();
    const iv = setInterval(() => {
      const pct = ((Date.now() - start) / DURATION) * 100;
      if (pct >= 100) {
        clearInterval(iv);
        if (idx < stories.length - 1) setIdx(i => i + 1);
        else onClose();
      } else {
        setProgress(Math.min(pct, 100));
      }
    }, 50);
    return () => clearInterval(iv);
  }, [idx, DURATION]);

  const handleLike = () => {
    if (liked.has(story.id)) return;
    dispatch({ type: 'LIKE_STORY', payload: story.id });
    setLiked(p => new Set([...p, story.id]));
  };

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] h-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Background: image or color */}
        {story.image ? (
          <img
            src={story.image}
            alt="story"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: story.bgColor || '#1a2a1a' }} />
        )}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/25 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${i < idx ? 100 : i === idx ? progress : 0}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm
              flex items-center justify-center text-xl ring-2 ring-white/30">
              {story.userEmoji}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight drop-shadow">{story.userName}</p>
              <div className="flex items-center gap-1 text-white/60 text-xs">
                <MapPin size={9} />
                <span>{story.location || 'Казахстан'}</span>
                {story.live && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                    LIVE
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Caption */}
        <div className="absolute bottom-20 left-5 right-16 z-20">
          {!story.image && (
            <span className="text-5xl mb-3 block drop-shadow-lg">{story.emoji}</span>
          )}
          <p className="text-white font-semibold text-base leading-snug drop-shadow-lg">
            {story.caption}
          </p>
        </div>

        {/* Like button */}
        <div className="absolute bottom-20 right-4 z-20 flex flex-col items-center gap-1">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 1.35 }}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm
              flex items-center justify-center"
          >
            <Heart
              size={22}
              className={liked.has(story.id) ? 'text-red-500 fill-red-500' : 'text-white'}
            />
          </motion.button>
          <span className="text-white text-xs font-bold drop-shadow">{story.likes}</span>
        </div>

        {/* Tap zones: prev / next */}
        <div className="absolute inset-0 flex z-10">
          <div className="flex-1" onClick={() => idx > 0 && setIdx(i => i - 1)} />
          <div className="flex-1" onClick={() => idx < stories.length - 1 ? setIdx(i => i + 1) : onClose()} />
        </div>
      </div>
    </div>
  );
}

// ─── Add Story Sheet ──────────────────────────────────────────
function AddStorySheet({ open, onClose }) {
  const { t } = useLang();
  const { dispatch } = useApp();
  const [caption,  setCaption]  = useState('');
  const [location, setLocation] = useState('');
  const [selBg,    setSelBg]    = useState(BG_OPTIONS[0]);
  const [imgSrc,   setImgSrc]   = useState(null); // base64
  const fileRef = useRef(null);

  const reset = () => {
    setCaption(''); setLocation(''); setSelBg(BG_OPTIONS[0]); setImgSrc(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const pickImage = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 5 МБ.'); return;
    }
    const reader = new FileReader();
    reader.onload = ev => setImgSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const post = () => {
    if (!caption.trim() && !imgSrc) return;
    dispatch({
      type: 'ADD_STORY',
      payload: {
        caption:  caption.trim(),
        location: location.trim(),
        bgColor:  selBg.bg,
        emoji:    selBg.emoji,
        image:    imgSrc || null,
      },
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="✨ Новая история">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {/* Photo preview / picker */}
      <div className="mb-4">
        {imgSrc ? (
          <div className="relative rounded-2xl overflow-hidden mb-2">
            <img src={imgSrc} alt="preview" className="w-full object-cover max-h-48 rounded-2xl" />
            <button
              onClick={() => setImgSrc(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60
                flex items-center justify-center text-white"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <motion.button
            onClick={pickImage}
            whileTap={{ scale: 0.97 }}
            className="w-full h-32 rounded-2xl border-2 border-dashed border-white/15
              flex flex-col items-center justify-center gap-2 text-text-muted
              hover:border-glacial-cyan/40 hover:text-glacial-cyan transition-colors mb-2"
          >
            <Camera size={28} />
            <span className="text-sm font-semibold">Добавить фото</span>
            <span className="text-xs">JPEG / PNG до 5 МБ</span>
          </motion.button>
        )}
      </div>

      {/* Background picker (if no photo) */}
      {!imgSrc && (
        <div className="mb-4">
          <p className="text-text-muted text-xs font-semibold mb-2">Фон</p>
          <div className="flex gap-2 flex-wrap">
            {BG_OPTIONS.map(opt => (
              <motion.button
                key={opt.emoji}
                onClick={() => setSelBg(opt)}
                whileTap={{ scale: 0.88 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
                  transition-all ${selBg.emoji === opt.emoji ? 'ring-2 ring-glacial-cyan scale-110' : ''}`}
                style={{ background: opt.bg }}
              >
                {opt.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <input
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="📍 Где вы? (Кольсай, Чарын...)"
        className="w-full bg-card-dark border border-white/5 rounded-2xl px-4 py-3 text-white
          text-sm outline-none focus:border-glacial-cyan/40 mb-3 placeholder-text-muted transition-colors"
      />

      {/* Caption */}
      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="Напишите что-нибудь... 🌿"
        rows={3}
        className="w-full bg-card-dark border border-white/5 rounded-2xl px-4 py-3 text-white
          text-sm outline-none focus:border-glacial-cyan/40 mb-4 resize-none
          placeholder-text-muted transition-colors"
      />

      {/* Preview card */}
      {(caption || imgSrc) && (
        <div
          className="rounded-2xl overflow-hidden mb-4 relative min-h-[80px]"
          style={{ background: imgSrc ? 'transparent' : selBg.bg }}
        >
          {imgSrc && (
            <img src={imgSrc} alt="prev" className="w-full object-cover max-h-32" />
          )}
          {!imgSrc && (
            <div className="p-4 flex items-center gap-2">
              <span className="text-2xl">{selBg.emoji}</span>
              <p className="text-white font-semibold text-sm">{caption}</p>
            </div>
          )}
          {imgSrc && caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3">
              <p className="text-white font-semibold text-sm">{caption}</p>
            </div>
          )}
        </div>
      )}

      <motion.button
        onClick={post}
        disabled={!caption.trim() && !imgSrc}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all
          ${(caption.trim() || imgSrc)
            ? 'bg-blazing-orange text-white shadow-orange'
            : 'bg-card-light text-text-muted cursor-not-allowed'}`}
      >
        🚀 Опубликовать историю
      </motion.button>
    </Modal>
  );
}

// ─── Stories Bar ──────────────────────────────────────────────
export default function StoriesBar() {
  const { state } = useApp();
  const [viewerIdx, setViewerIdx] = useState(null);
  const [addOpen,   setAddOpen]   = useState(false);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
        {/* Add story button */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <motion.button
            onClick={() => setAddOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center
              bg-card-mid border-2 border-dashed border-white/20
              hover:border-glacial-cyan/50 transition-colors"
          >
            <Plus size={20} className="text-text-muted" />
          </motion.button>
          <span className="text-[10px] text-text-muted font-medium whitespace-nowrap">История</span>
        </div>

        {/* Story circles */}
        {state.stories.map((story, i) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <motion.button
              onClick={() => setViewerIdx(i)}
              whileTap={{ scale: 0.88 }}
              className="w-14 h-14 rounded-full p-[2.5px]"
              style={{
                background: story.live
                  ? 'conic-gradient(#FF5A00 0deg, #00E5FF 180deg, #FF5A00 360deg)'
                  : 'rgba(255,255,255,0.12)',
              }}
            >
              {/* Avatar circle */}
              <div
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-2xl"
                style={{ background: story.bgColor || '#1a2a1a' }}
              >
                {story.image
                  ? <img src={story.image} alt="story" className="w-full h-full object-cover" />
                  : story.userEmoji
                }
              </div>
            </motion.button>
            <span className="text-[10px] text-text-light font-medium whitespace-nowrap max-w-[56px]
              overflow-hidden text-ellipsis text-center">
              {story.userName.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Viewer */}
      <AnimatePresence>
        {viewerIdx !== null && (
          <motion.div key="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StoryViewer
              stories={state.stories}
              startIndex={viewerIdx}
              onClose={() => setViewerIdx(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add story sheet */}
      <AddStorySheet open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
