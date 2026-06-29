import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { reflectNarration } from '../../utils/narration.js';

const CARDS = [
  { icon: '📏', title: 'Rulers', fact: 'Start from ZERO. Read mm and cm for small objects.', sub: '10 mm = 1 cm', color: 'border-amber-400 bg-amber-50', titleColor: 'text-amber-800' },
  { icon: '📐', title: 'Metres',  fact: '1 m = 100 cm. Use metres for rooms, roads, gardens.', sub: 'Big objects → metres', color: 'border-teal-400 bg-teal-50', titleColor: 'text-teal-800' },
  { icon: '🤚', title: 'Estimation', fact: 'Use your body! Finger ≈ 1 cm, hand ≈ 15 cm, arm ≈ 60 cm.', sub: 'Estimate before measuring', color: 'border-yellow-400 bg-yellow-50', titleColor: 'text-yellow-800' },
  { icon: '🔄', title: 'Converting', fact: 'Metres → cm: × 100. Centimetres → m: ÷ 100.', sub: '3 m = 300 cm', color: 'border-blue-400 bg-blue-50', titleColor: 'text-blue-800' },
  { icon: '⚖️', title: 'Comparing', fact: 'Convert to the SAME unit, then compare.', sub: 'Then use > < =', color: 'border-pink-400 bg-pink-50', titleColor: 'text-pink-800' },
  { icon: '➕', title: 'Word Problems', fact: 'Read → Find → Calculate → Check your answer!', sub: '4-step strategy', color: 'border-purple-400 bg-purple-50', titleColor: 'text-purple-800' },
];

export default function ReflectPhase() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (audioEnabled) narrate(reflectNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    if (visible >= CARDS.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 500);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-amber-900/80 to-[#1A1A2E] overflow-hidden pt-14">
      <div className="flex-1 flex flex-col px-4 py-3 max-w-2xl mx-auto w-full overflow-y-auto">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-4">
          <div className="text-5xl mb-1">🪞</div>
          <h2 className="text-3xl font-black text-white">What You Learned!</h2>
          <p className="text-base font-bold text-white/60">6 big ideas from your measurement adventure</p>
        </motion.div>

        {/* Characters */}
        <div className="flex justify-center gap-8 mb-4">
          {[
            { emoji: '👧', name: 'Emma',   color: 'text-amber-300' },
            { emoji: '👦', name: 'Oliver', color: 'text-teal-300' },
            { emoji: '👧🏻', name: 'Lily',   color: 'text-purple-300' },
          ].map((c, i) => (
            <div key={c.name} className="flex flex-col items-center gap-1"
              style={{ animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
              <div className="text-4xl">{c.emoji}</div>
              <span className={`text-xs font-extrabold ${c.color}`}>{c.name}</span>
            </div>
          ))}
        </div>

        {/* Summary cards — 2 columns */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {CARDS.map((card, i) => (
            i < visible ? (
              <motion.div key={card.title}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className={`${card.color} border-2 rounded-2xl p-3`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl flex-shrink-0">{card.icon}</span>
                  <div>
                    <p className={`font-black text-base ${card.titleColor}`}>{card.title}</p>
                    <p className="text-xs font-bold text-gray-700 leading-snug mt-0.5">{card.fact}</p>
                    <div className="mt-1 bg-white/60 rounded-pill px-2 py-0.5 inline-block">
                      <p className="text-xs font-extrabold text-gray-600">{card.sub}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div key={card.title} className="border-2 border-white/10 bg-white/5 rounded-2xl p-3 opacity-30">
                <div className="flex items-start gap-2">
                  <span className="text-2xl grayscale">{card.icon}</span>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-white/20 rounded w-1/2" />
                    <div className="h-2.5 bg-white/10 rounded w-full" />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* CTA */}
        <AnimatePresence>
          {visible >= CARDS.length && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-3 pb-4">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-xl font-extrabold text-white">🎮 Ready to test your skills?</p>
                <p className="text-sm font-bold text-white/60 mt-1">12 randomised practice questions — 3 stars possible!</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.PRACTICE })}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black text-xl py-4 rounded-pill shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                🎮 Start Practice! →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}
