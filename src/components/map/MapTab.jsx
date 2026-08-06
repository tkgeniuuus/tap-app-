import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LanguageContext';
import { Modal } from '../ui';
import { MOCK_POI } from '../../data/mockData';
import { Navigation, TreePine, Home } from 'lucide-react';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Custom Icons ────────────────────────────────────────────
function makeCampIcon(emoji, heat) {
  const bg = heat > 0.8 ? '#FF5A00' : heat > 0.5 ? '#FF8A00' : '#00B4D8';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:48px;height:48px;cursor:pointer;">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${bg};opacity:0.3;
          animation:tapPulse 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute;inset:6px;border-radius:50%;
          background:${bg};display:flex;align-items:center;
          justify-content:center;font-size:17px;
          box-shadow:0 2px 10px rgba(0,0,0,0.35);
        ">${emoji}</div>
      </div>`,
    iconSize:   [48, 48],
    iconAnchor: [24, 24],
    popupAnchor:[0, -28],
  });
}

function makePOIIcon(type) {
  const cfg = {
    city:  { bg: '#161C27', border: '#00E5FF', emoji: '🏙️' },
    park:  { bg: '#161C27', border: '#10B981', emoji: '🏞️' },
    stay:  { bg: '#161C27', border: '#FF5A00', emoji: '🏡' },
  }[type] || { bg: '#161C27', border: '#8A94A6', emoji: '📍' };

  return L.divIcon({
    className: '',
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${cfg.bg};border:2px solid ${cfg.border};
      display:flex;align-items:center;justify-content:center;
      font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.4);
      cursor:pointer;
    ">${cfg.emoji}</div>`,
    iconSize:   [34, 34],
    iconAnchor: [17, 17],
    popupAnchor:[0, -20],
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:#00E5FF;border:3px solid white;
      box-shadow:0 0 0 6px rgba(0,229,255,0.25);
    "></div>`,
    iconSize:   [18, 18],
    iconAnchor: [9, 9],
  });
}

// ─── Map resize helper ───────────────────────────────────────
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 350);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

// ─── Locate Me control ───────────────────────────────────────
function LocateButton({ onLocate }) {
  const map = useMap();
  const locate = () => {
    map.locate({ setView: true, maxZoom: 13, enableHighAccuracy: true });
    map.once('locationfound', e => onLocate({ lat: e.latlng.lat, lng: e.latlng.lng }));
    map.once('locationerror', () => {
      // fallback: center on Almaty
      map.setView([43.2565, 76.9284], 9);
    });
  };
  return (
    <button
      onClick={locate}
      className="absolute bottom-4 right-4 z-[400] w-10 h-10 rounded-xl bg-card-dark
        border border-white/10 flex items-center justify-center text-glacial-cyan
        shadow-glass active:scale-95 transition-all"
      title="Моё местоположение"
    >
      <Navigation size={16} />
    </button>
  );
}

// ─── Main Map Tab ────────────────────────────────────────────
export default function MapTab() {
  const { t } = useLang();
  const { state, dispatch, showToast } = useApp();
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [userPos, setUserPos]           = useState(null);
  const [joined,  setJoined]            = useState(new Set());

  const handleJoin = (camp) => {
    if (joined.has(camp.id)) return;
    dispatch({ type: 'JOIN_CAMP', payload: camp.id });
    setJoined(prev => new Set([...prev, camp.id]));
    showToast(`✅ Вы присоединились к "${camp.name}"!`);
    setSelectedCamp(null);
  };

  // Add pulse CSS once
  useEffect(() => {
    if (document.getElementById('tap-pulse-style')) return;
    const s = document.createElement('style');
    s.id = 'tap-pulse-style';
    s.textContent = `
      @keyframes tapPulse {
        0%   { transform: scale(0.9); opacity: 0.6; }
        70%  { transform: scale(1.5); opacity: 0; }
        100% { transform: scale(1.5); opacity: 0; }
      }`;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-xl">{t.liveMap}</h2>
            <p className="text-text-muted text-xs">Жетысу · Алматинская область</p>
          </div>
          <div className="flex items-center gap-1.5 bg-card-dark rounded-xl px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-blazing-orange animate-pulse" />
            <span className="text-xs text-text-light font-medium">
              {state.camps.length} {t.hotCamps}
            </span>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="mx-4 rounded-[28px] overflow-hidden relative flex-shrink-0" style={{ height: '52vw', maxHeight: 260 }}>
        <MapContainer
          center={[43.5, 78.5]}
          zoom={7}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <MapResizer />
          <LocateButton onLocate={pos => setUserPos(pos)} />

          {/* OSM tiles — dark-ish */}
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User position */}
          {userPos && (
            <Marker position={[userPos.lat, userPos.lng]} icon={makeUserIcon()}>
              <Popup>
                <div style={{ color: '#F3F5F8', fontSize: 13, fontWeight: 600, padding: 4 }}>
                  📍 Вы здесь
                </div>
              </Popup>
            </Marker>
          )}

          {/* Hot camp markers */}
          {state.camps.map(camp => (
            <Marker
              key={camp.id}
              position={[camp.lat, camp.lng]}
              icon={makeCampIcon(camp.emoji, camp.current / camp.max)}
              eventHandlers={{ click: () => setSelectedCamp(camp) }}
            >
              <Popup>
                <div style={{ color: '#F3F5F8', padding: '4px 2px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{camp.emoji} {camp.name}</div>
                  <div style={{ color: '#00E5FF', fontSize: 11, marginTop: 2 }}>
                    {camp.current}/{camp.max} чел.
                  </div>
                  <div style={{ color: '#8A94A6', fontSize: 11 }}>Выезд: {camp.departure}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* POI city/park markers */}
          {MOCK_POI.map(poi => (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={makePOIIcon(poi.type)}
            >
              <Popup>
                <div style={{ color: '#F3F5F8', fontWeight: 600, fontSize: 13, padding: 4 }}>
                  {poi.name}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Camp list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 mt-4">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-3">
          Активные хот-кемпы
        </p>
        {state.camps.map(camp => {
          const heat = camp.current / camp.max;
          return (
            <motion.button
              key={camp.id}
              onClick={() => setSelectedCamp(camp)}
              className="w-full bg-card-dark rounded-[24px] p-4 mb-3 flex items-center gap-3 text-left
                border border-white/5 active:scale-[0.98] transition-transform"
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: heat > 0.8 ? '#FF5A0022' : '#00E5FF11' }}
              >
                {camp.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{camp.name}</p>
                <p className="text-text-muted text-xs mt-0.5">Выезд: {camp.departure}</p>
                <div className="h-1.5 bg-card-light rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${heat * 100}%`,
                      background: heat > 0.8 ? '#FF5A00' : '#00E5FF',
                    }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="font-black text-sm"
                  style={{ color: heat > 0.8 ? '#FF5A00' : '#00E5FF' }}
                >
                  {camp.current}/{camp.max}
                </p>
                <p className="text-text-muted text-[10px]">чел.</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Camp detail modal */}
      <Modal
        open={!!selectedCamp}
        onClose={() => setSelectedCamp(null)}
        title={selectedCamp ? `${selectedCamp.emoji} ${selectedCamp.name}` : ''}
      >
        {selectedCamp && (
          <div>
            <p className="text-text-light text-sm leading-relaxed mb-4">{selectedCamp.description}</p>

            {/* Mini map coords */}
            <div className="bg-card-dark rounded-2xl p-3 mb-4 flex items-center gap-2">
              <Navigation size={14} className="text-glacial-cyan" />
              <span className="text-text-muted text-xs font-mono">
                {selectedCamp.lat.toFixed(4)}, {selectedCamp.lng.toFixed(4)}
              </span>
            </div>

            {/* Capacity */}
            <div className="bg-card-dark rounded-2xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-text-muted text-sm">Участников</span>
                <span
                  className="font-black"
                  style={{ color: selectedCamp.current / selectedCamp.max > 0.8 ? '#FF5A00' : '#00E5FF' }}
                >
                  {selectedCamp.current}/{selectedCamp.max}
                </span>
              </div>
              <div className="h-2 bg-card-light rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: selectedCamp.current / selectedCamp.max > 0.8 ? '#FF5A00' : '#00E5FF' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(selectedCamp.current / selectedCamp.max) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              {selectedCamp.max - selectedCamp.current <= 3 && (
                <p className="text-blazing-orange text-xs mt-2 font-bold">
                  🔥 Осталось {selectedCamp.max - selectedCamp.current} мест!
                </p>
              )}
            </div>

            <div className="flex justify-between mb-5">
              <div>
                <p className="text-text-muted text-xs">Организатор</p>
                <p className="text-white font-semibold">{selectedCamp.organizer}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-xs">Стоимость</p>
                <p className="text-glacial-cyan font-black">{selectedCamp.price.toLocaleString('ru')} ₸</p>
              </div>
            </div>

            <motion.button
              onClick={() => handleJoin(selectedCamp)}
              disabled={joined.has(selectedCamp.id) || selectedCamp.current >= selectedCamp.max}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all
                ${joined.has(selectedCamp.id)
                  ? 'bg-glacial-cyan/20 text-glacial-cyan border border-glacial-cyan/30'
                  : 'bg-blazing-orange text-white shadow-orange'}`}
              whileTap={{ scale: 0.97 }}
            >
              {joined.has(selectedCamp.id) ? '✅ Вы в группе!' : t.joinCamp}
            </motion.button>
          </div>
        )}
      </Modal>
    </div>
  );
}
