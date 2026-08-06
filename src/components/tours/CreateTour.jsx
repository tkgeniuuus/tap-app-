import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Plus, X, CheckCircle2, ChevronRight, MapPin, Users, Calendar, Wallet, Tag } from 'lucide-react';

const ACTIVITY_OPTIONS = [
  '🥾 Hiking', '🏕️ Camping', '📸 Photography', '🐴 Horse riding',
  '🚤 Water sports', '🎣 Fishing', '🌿 Eco-tour', '🧗 Climbing',
  '🎿 Winter sports', '🍽️ Food tasting', '🔭 Stargazing', '🦅 Bird watching',
];

const DIFFICULTY = ['Easy', 'Moderate', 'Hard', 'Extreme'];

const STEP_LABELS = ['Basics', 'Details', 'Pricing', 'Preview'];

function StepDot({ step, current }) {
  const done = step < current;
  const active = step === current;
  return (
    <div className="flex items-center gap-0">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
        done   ? 'bg-glacial-cyan text-midnight-ink' :
        active ? 'bg-blazing-orange text-white' :
                 'bg-card-dark text-text-muted border border-white/10'
      }`}>
        {done ? '✓' : step + 1}
      </div>
      {step < 3 && (
        <div className={`w-8 h-0.5 transition-all ${done ? 'bg-glacial-cyan' : 'bg-white/10'}`} />
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }) {
  const cls = `w-full bg-card-dark border border-white/8 rounded-2xl px-4 py-3 text-white text-sm
    outline-none focus:border-blazing-orange/50 transition-colors placeholder-text-muted`;
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} className={cls + ' resize-none'} />
    : <input    value={value} onChange={onChange} placeholder={placeholder} className={cls} />;
}

export default function CreateTour() {
  const { state, dispatch, showToast } = useApp();
  const [step,   setStep]   = useState(0);
  const [done,   setDone]   = useState(false);

  const [form, setForm] = useState({
    name:        '',
    destination: '',
    region:      '',
    duration:    '',
    difficulty:  'Moderate',
    maxPeople:   '',
    activities:  [],
    description: '',
    includes:    '',
    excludes:    '',
    price:       '',
    startDate:   '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleActivity = (a) => {
    set('activities', form.activities.includes(a)
      ? form.activities.filter(x => x !== a)
      : [...form.activities, a]);
  };

  const publish = () => {
    const tour = {
      id:         `tour_${Date.now()}`,
      type:       'custom_tour',
      name:       form.name,
      destination: form.destination,
      region:     form.region,
      duration:   `${form.duration} days`,
      difficulty: form.difficulty,
      maxPeople:  parseInt(form.maxPeople) || 8,
      activities: form.activities,
      description: form.description,
      includes:   form.includes,
      excludes:   form.excludes,
      price:      parseInt(form.price) || 0,
      startDate:  form.startDate,
      author:     state.user.name,
      avatar:     state.user.avatar,
      emoji:      '🗺️',
      tag:        'NEW',
      bookedSeats: 0,
      totalSeats:  parseInt(form.maxPeople) || 8,
      createdAt:  new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CUSTOM_TOUR', payload: tour });
    showToast('🎉 Tour published! Travellers can now book it.');
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}>
          <div className="w-24 h-24 rounded-[32px] bg-glacial-cyan/20 flex items-center justify-center text-5xl mb-6">
            🎉
          </div>
        </motion.div>
        <h2 className="text-white font-black text-2xl mb-2">Tour Published!</h2>
        <p className="text-text-muted text-sm mb-6">
          Your tour <span className="text-white font-bold">"{form.name}"</span> is now live on TAP.
          Other travellers can find and book it.
        </p>
        <motion.button
          onClick={() => { setStep(0); setDone(false); setForm({ name:'',destination:'',region:'',duration:'',difficulty:'Moderate',maxPeople:'',activities:[],description:'',includes:'',excludes:'',price:'',startDate:'' }); }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-4 rounded-2xl bg-blazing-orange text-white font-black">
          Create Another Tour
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Progress header */}
      <div className="px-4 pt-3 pb-3 flex-shrink-0">
        <div className="flex items-center gap-1 mb-3">
          {STEP_LABELS.map((_, i) => <StepDot key={i} step={i} current={step} />)}
        </div>
        <h2 className="text-white font-black text-base">{STEP_LABELS[step]}</h2>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Basics ─────────────────────────────────── */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }} transition={{ duration: 0.2 }}>
              <Field label="Tour Name">
                <TextInput value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder='e.g. "Hidden Waterfalls of Zhetysu"' />
              </Field>
              <Field label="Destination">
                <TextInput value={form.destination} onChange={e => set('destination', e.target.value)}
                  placeholder="e.g. Kolsai Lakes, Burkhan-Bulak" />
              </Field>
              <Field label="Region">
                <TextInput value={form.region} onChange={e => set('region', e.target.value)}
                  placeholder="e.g. Almaty Region" />
              </Field>
              <Field label="Duration (days)">
                <input type="number" min="1" max="30" value={form.duration}
                  onChange={e => set('duration', e.target.value)}
                  className="w-full bg-card-dark border border-white/8 rounded-2xl px-4 py-3
                    text-white text-sm outline-none focus:border-blazing-orange/50 transition-colors" />
              </Field>
              <Field label="Difficulty">
                <div className="flex gap-2 flex-wrap">
                  {DIFFICULTY.map(d => (
                    <button key={d} onClick={() => set('difficulty', d)}
                      className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                        form.difficulty === d
                          ? 'bg-blazing-orange text-white'
                          : 'bg-card-dark text-text-muted border border-white/5'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Start Date">
                <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
                  className="w-full bg-card-dark border border-white/8 rounded-2xl px-4 py-3
                    text-white text-sm outline-none focus:border-blazing-orange/50 transition-colors" />
              </Field>
            </motion.div>
          )}

          {/* ── Step 1: Details ────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }} transition={{ duration: 0.2 }}>
              <Field label="Activities (select all that apply)">
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map(a => {
                    const sel = form.activities.includes(a);
                    return (
                      <motion.button key={a} onClick={() => toggleActivity(a)} whileTap={{ scale: 0.9 }}
                        className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                          sel ? 'bg-blazing-orange text-white' : 'bg-card-dark text-text-muted border border-white/5'}`}>
                        {a}
                      </motion.button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Max Group Size">
                <input type="number" min="1" max="50" value={form.maxPeople}
                  onChange={e => set('maxPeople', e.target.value)}
                  className="w-full bg-card-dark border border-white/8 rounded-2xl px-4 py-3
                    text-white text-sm outline-none focus:border-blazing-orange/50 transition-colors" />
              </Field>
              <Field label="Description">
                <TextInput multiline value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Describe the tour experience, highlights, what makes it special..." />
              </Field>
            </motion.div>
          )}

          {/* ── Step 2: Pricing ────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }} transition={{ duration: 0.2 }}>
              <Field label="Price per person (₸)">
                <div className="relative">
                  <input type="number" min="0" value={form.price}
                    onChange={e => set('price', e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full bg-card-dark border border-white/8 rounded-2xl px-4 py-3
                      text-white text-sm outline-none focus:border-blazing-orange/50 transition-colors pr-10" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">₸</span>
                </div>
              </Field>
              {form.price && (
                <div className="bg-card-dark rounded-2xl p-4 mb-4 border border-white/5">
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-3">Revenue breakdown</p>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-text-light text-sm">Per person</span>
                    <span className="text-white font-bold">{parseInt(form.price).toLocaleString('ru')} ₸</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-text-light text-sm">TAP fee (10%)</span>
                    <span className="text-blazing-orange font-bold">-{Math.round(parseInt(form.price) * 0.1).toLocaleString('ru')} ₸</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                    <span className="text-white font-bold">You receive</span>
                    <span className="text-glacial-cyan font-black">{Math.round(parseInt(form.price) * 0.9).toLocaleString('ru')} ₸</span>
                  </div>
                  {form.maxPeople && (
                    <p className="text-text-muted text-xs mt-2">
                      Full group ({form.maxPeople} pax): <span className="text-white font-bold">
                        {Math.round(parseInt(form.price) * 0.9 * parseInt(form.maxPeople)).toLocaleString('ru')} ₸
                      </span>
                    </p>
                  )}
                </div>
              )}
              <Field label="What's included">
                <TextInput multiline value={form.includes} onChange={e => set('includes', e.target.value)}
                  placeholder="e.g. Transport, meals, guide, gear rental..." />
              </Field>
              <Field label="Not included">
                <TextInput multiline value={form.excludes} onChange={e => set('excludes', e.target.value)}
                  placeholder="e.g. Personal expenses, entrance fees, insurance..." />
              </Field>
            </motion.div>
          )}

          {/* ── Step 3: Preview ────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }} transition={{ duration: 0.2 }}>
              <div className="bg-card-dark rounded-[28px] p-5 border border-white/5 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🗺️</span>
                    <div>
                      <p className="text-white font-black text-base">{form.name || 'My Tour'}</p>
                      <p className="text-text-muted text-xs flex items-center gap-1">
                        <MapPin size={10} />{form.destination}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg bg-green-500/20 text-green-400">NEW</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { Icon: Calendar, label: `${form.duration || '?'} days` },
                    { Icon: Users,    label: `Max ${form.maxPeople || '?'}` },
                    { Icon: Tag,      label: form.difficulty },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="bg-card-light rounded-xl p-2 flex flex-col items-center gap-1">
                      <Icon size={14} className="text-text-muted" />
                      <span className="text-white text-xs font-semibold">{label}</span>
                    </div>
                  ))}
                </div>

                {form.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {form.activities.map(a => (
                      <span key={a} className="text-[10px] bg-card-light text-text-muted px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                )}

                {form.description && (
                  <p className="text-text-muted text-xs leading-relaxed mb-3">{form.description}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <p className="text-text-muted text-xs">Price per person</p>
                    <p className="text-glacial-cyan font-black text-xl">
                      {parseInt(form.price || 0).toLocaleString('ru')} ₸
                    </p>
                  </div>
                  <p className="text-text-muted text-xs">By {state.user.name}</p>
                </div>
              </div>

              <motion.button onClick={publish} whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-[28px] bg-blazing-orange text-white font-black text-base
                  flex items-center justify-center gap-2"
                style={{ boxShadow: '0 8px 32px rgba(255,90,0,0.4)' }}>
                🚀 Publish Tour
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-[74px] left-0 right-0 px-4 pb-3 bg-gradient-to-t from-midnight-ink via-midnight-ink/95 to-transparent pt-6">
        <div className="flex gap-3">
          {step > 0 && (
            <motion.button onClick={() => setStep(s => s - 1)} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3.5 rounded-2xl bg-card-dark border border-white/10 text-text-light font-bold text-sm">
              ← Back
            </motion.button>
          )}
          {step < 3 && (
            <motion.button
              onClick={() => setStep(s => s + 1)}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3.5 rounded-2xl bg-blazing-orange text-white font-bold text-sm
                flex items-center justify-center gap-1"
              style={{ boxShadow: '0 4px 20px rgba(255,90,0,0.4)' }}>
              Next <ChevronRight size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
