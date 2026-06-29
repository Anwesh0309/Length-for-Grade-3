import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { introNarration } from '../../utils/narration.js';

export default function IntroPhase() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (audioEnabled) narrate(introNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scene < 2) setScene(s => s + 1);
    }, 3500);
    return () => clearTimeout(timer);
  }, [scene]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#2D1B4E] via-[#1a2a4a] to-[#1a3a2a] overflow-hidden pt-16 relative">

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Library shelves */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#3D2B0E]/60 to-transparent" />
        {/* Floating books */}
        {['📚', '📖', '📕', '📗', '📘'].map((book, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${10 + i * 18}%`,
              top: `${15 + (i % 2) * 20}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {book}
          </div>
        ))}
        {/* Candle glow */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6 max-w-2xl mx-auto w-full">

        {/* Story scene illustration */}
        <motion.div
          key={scene}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-card p-6 text-center"
        >
          {/* Scene image */}
          <div className="relative w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-b from-amber-900/20 to-transparent rounded-lg overflow-hidden">
            {/* Library scene with characters */}
            <div className="flex items-end justify-center gap-4">
              <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0s' }}>
                <div className="text-5xl">👧</div>
                <div className="text-xs font-extrabold text-amber-300 mt-1">Maya</div>
              </div>
              <div className="flex flex-col items-center mb-2">
                <div className="text-4xl mb-1">🗺️</div>
                <div className="w-24 h-16 bg-amber-100/20 rounded border border-amber-300/40 flex items-center justify-center">
                  <div className="text-3xl">📜</div>
                </div>
              </div>
              <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0.3s' }}>
                <div className="text-5xl">👦</div>
                <div className="text-xs font-extrabold text-teal-300 mt-1">Jake</div>
              </div>
              <div className="flex flex-col items-center animate-float" style={{ animationDelay: '0.6s' }}>
                <div className="text-5xl">👧🏻</div>
                <div className="text-xs font-extrabold text-purple-300 mt-1">Sofia</div>
              </div>
            </div>
            {/* Glowing map */}
            <div className="absolute top-2 right-4 text-2xl animate-pulse">✨</div>
            <div className="absolute top-2 left-4 text-2xl" style={{ animation: 'float 2s ease-in-out infinite' }}>🕯️</div>
          </div>

          {/* Story text */}
          <div className="space-y-4">
            {scene >= 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-bold text-white/90 italic leading-relaxed"
              >
                🌧️ One rainy afternoon, Maya, Jake, and Sofia found a rolled-up map tucked behind the oldest book in the school library.
              </motion.p>
            )}
            {scene >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base font-bold text-amber-200 italic leading-relaxed"
              >
                🗺️ "Only those who understand the language of length shall find the treasure," the note read.
              </motion.p>
            )}
            {scene >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base font-bold text-purple-200 italic leading-relaxed"
              >
                💬 Maya looked up and whispered — <span className="text-amber-300 font-black">"Do you know how to measure things?"</span>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Map stations preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-card p-4 w-full"
        >
          <p className="text-white/60 text-xs font-extrabold uppercase tracking-wider mb-3 text-center">🗺️ THE MAP SHOWS 5 STATIONS</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { icon: '🔨', label: 'Norway', sub: 'Rulers' },
              { icon: '🌻', label: 'Brazil', sub: 'Metres' },
              { icon: '🏜️', label: 'Egypt', sub: 'Estimate' },
              { icon: '🌉', label: 'Japan', sub: 'Convert' },
              { icon: '🏟️', label: 'Kenya', sub: 'Compare' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div className="text-2xl">{s.icon}</div>
                <div className="text-white/80 text-xs font-bold">{s.label}</div>
                <div className="text-white/40 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        {scene >= 2 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.LEARN })}
            className="bg-amber-500 hover:bg-amber-400 text-white font-black text-xl px-10 py-5 rounded-pill shadow-glow transition-all flex items-center gap-3"
          >
            🗺️ Let's find out!
          </motion.button>
        )}
      </div>
    </div>
  );
}
