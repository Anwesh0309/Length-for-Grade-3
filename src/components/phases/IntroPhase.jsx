import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { introNarration } from '../../utils/narration.js';

const SCENES = [
  {
    id: 0,
    text: '🌧️ One rainy afternoon, Emma, Oliver, and Lily found a rolled-up map tucked behind the oldest book in the school library.',
    textColor: 'text-amber-100',
  },
  {
    id: 1,
    text: '🗺️ "Only those who understand the language of length shall find the treasure," the note read.',
    textColor: 'text-amber-300',
  },
  {
    id: 2,
    text: '💬 Emma looked up and whispered — "Do you know how to measure things?"',
    textColor: 'text-purple-200',
  },
];

const STATIONS = [
  { icon: '🔨', label: 'Norway', sub: 'Rulers & mm' },
  { icon: '🌻', label: 'Brazil',  sub: 'Metres & cm' },
  { icon: '🏜️', label: 'Egypt',   sub: 'Estimation' },
  { icon: '🌉', label: 'Japan',   sub: 'Converting' },
  { icon: '🏟️', label: 'Kenya',   sub: 'Comparing' },
];

export default function IntroPhase() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [scene, setScene] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrate(introNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    if (scene >= SCENES.length - 1) {
      setTimeout(() => setReady(true), 800);
      return;
    }
    const t = setTimeout(() => setScene(s => s + 1), 3800);
    return () => clearTimeout(t);
  }, [scene]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden pt-14 relative"
      style={{ background: 'linear-gradient(160deg, #1a0533 0%, #12204a 40%, #0d2e1a 100%)' }}>

      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bookshelf floor */}
        <div className="absolute bottom-0 left-0 right-0 h-28"
          style={{ background: 'linear-gradient(to top, #3D2B0E 0%, #5C3D11 60%, transparent 100%)' }} />
        {/* Floating books */}
        {['📚', '📖', '📕', '📗', '📘'].map((b, i) => (
          <div key={i} className="absolute text-3xl"
            style={{ left: `${8 + i * 19}%`, top: `${12 + (i % 3) * 8}%`, opacity: 0.15,
              animation: `float ${3.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            {b}
          </div>
        ))}
        {/* Warm candle glow */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%)' }} />
        {/* Window light */}
        <div className="absolute top-16 right-8 w-16 h-24 border-2 border-amber-400/20 rounded-sm"
          style={{ background: 'linear-gradient(to bottom, rgba(255,215,0,0.08), transparent)' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 py-3 max-w-lg mx-auto w-full">

        {/* Illustrated scene */}
        <motion.div className="w-full">
          {/* Library header */}
          <div className="text-center mb-3">
            <span className="bg-white/10 border border-white/20 rounded-pill px-4 py-1.5 text-white/70 text-xs font-extrabold uppercase tracking-widest">
              📖 The Story Begins
            </span>
          </div>

          {/* Character stage */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm"
            style={{ height: '160px' }}>

            {/* Background scene SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden>
              {/* Bookshelf wall */}
              <rect x="0" y="0" width="400" height="160" fill="#2D1B4E" />
              {/* Shelves */}
              {[40, 90, 140].map(y => (
                <g key={y}>
                  <rect x="0" y={y} width="400" height="6" fill="#5C3D11" />
                  {[15, 55, 90, 125, 165, 200, 235, 275, 310, 345].map((x, j) => (
                    <rect key={j} x={x} y={y - 30 + (j % 3) * 5} width={22 + (j % 4) * 5} height={25 + (j % 3) * 5}
                      rx="2" fill={['#C2185B', '#1565C0', '#2E7D32', '#F57F17', '#6A1B9A', '#00838F'][j % 6]}
                      opacity="0.7" />
                  ))}
                </g>
              ))}
              {/* Table */}
              <rect x="80" y="128" width="240" height="8" rx="2" fill="#795548" />
              <rect x="90" y="136" width="12" height="24" fill="#6D4C41" />
              <rect x="298" y="136" width="12" height="24" fill="#6D4C41" />
              {/* Glowing map on table */}
              <rect x="148" y="108" width="104" height="26" rx="4" fill="#FEF3C7" opacity="0.9" />
              <rect x="152" y="112" width="96" height="18" rx="2" fill="#F59E0B" opacity="0.5" />
              <ellipse cx="200" cy="121" rx="30" ry="5" fill="#FCD34D" opacity="0.6" />
              {/* Candle */}
              <rect x="340" y="118" width="8" height="16" fill="#FEF3C7" rx="2" />
              <ellipse cx="344" cy="116" rx="4" ry="6" fill="#FF8F00" opacity="0.9" />
              <ellipse cx="344" cy="116" rx="2" ry="4" fill="#FFD54F" opacity="0.9" />
              {/* Sparkles */}
              {[{x:200,y:105},{x:165,y:112},{x:235,y:108}].map((p,i) => (
                <text key={i} x={p.x} y={p.y} fontSize="10" textAnchor="middle" opacity="0.8">✦</text>
              ))}
            </svg>

            {/* Characters overlay */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-6 px-4 pb-2">
              {[
                { emoji: '👧', name: 'Emma', color: 'text-amber-300', delay: 0 },
                { emoji: '👦', name: 'Oliver', color: 'text-teal-300', delay: 0.15 },
                { emoji: '👧🏻', name: 'Lily', color: 'text-purple-300', delay: 0.3 },
              ].map((c) => (
                <motion.div key={c.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: c.delay }}
                  className="flex flex-col items-center"
                  style={{ animation: `float ${2.5 + Math.random()}s ease-in-out infinite`, animationDelay: `${c.delay}s` }}
                >
                  <div className="text-4xl drop-shadow-lg">{c.emoji}</div>
                  <div className={`text-xs font-extrabold ${c.color} mt-0.5`}>{c.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Story text panel */}
        <div className="w-full bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 min-h-[90px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={scene}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-base font-bold leading-relaxed italic text-center ${SCENES[scene]?.textColor || 'text-white'}`}
            >
              {SCENES[scene]?.text}
            </motion.p>
          </AnimatePresence>
          {/* Scene dots */}
          <div className="flex justify-center gap-2 mt-3">
            {SCENES.map((s, i) => (
              <button key={s.id} onClick={() => setScene(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === scene ? 'bg-amber-400 scale-125' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* World map stations */}
        <div className="w-full bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3">
          <p className="text-white/50 text-xs font-extrabold uppercase tracking-widest text-center mb-2">🗺️ 5 Stations to Unlock</p>
          <div className="grid grid-cols-5 gap-1">
            {STATIONS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5 bg-white/5 rounded-xl py-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-white/80 text-xs font-extrabold">{s.label}</span>
                <span className="text-white/40 text-xs font-bold">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {ready && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.LEARN })}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black text-xl py-4 rounded-pill shadow-glow flex items-center justify-center gap-3 transition-all"
          >
            🗺️ Let's Find the Treasure!
          </motion.button>
        )}
        {!ready && (
          <div className="w-full py-4 rounded-pill bg-white/5 border border-white/10 text-white/30 font-bold text-center text-base">
            Story loading...
          </div>
        )}
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}
