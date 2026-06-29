import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { reflectNarration } from '../../utils/narration.js';

const CARDS = [
  { icon: '📏', title: 'Rulers', fact: 'Measure in mm and cm. Always start from ZERO! 10 mm = 1 cm.', color: 'from-amber-50 to-yellow-50 border-amber-200', textColor: 'text-amber-800' },
  { icon: '📐', title: 'Metres', fact: '1 m = 100 cm. Use metres for long objects like rooms and roads.', color: 'from-teal-50 to-green-50 border-teal-200', textColor: 'text-teal-800' },
  { icon: '🤚', title: 'Estimation', fact: 'Use body benchmarks: finger ≈ 1cm, hand ≈ 15cm, arm ≈ 60cm, door ≈ 2m.', color: 'from-yellow-50 to-orange-50 border-yellow-200', textColor: 'text-yellow-800' },
  { icon: '🔄', title: 'Conversion', fact: 'Multiply × 100 to convert m → cm. Divide ÷ 100 for cm → m.', color: 'from-blue-50 to-purple-50 border-blue-200', textColor: 'text-blue-800' },
  { icon: '⚖️', title: 'Comparing', fact: 'Always convert to the SAME unit before comparing lengths!', color: 'from-pink-50 to-coral-50 border-pink-200', textColor: 'text-pink-800' },
  { icon: '➕', title: 'Word Problems', fact: 'Identify what to find, write the calculation, then solve step by step!', color: 'from-purple-50 to-indigo-50 border-purple-200', textColor: 'text-purple-800' },
];

export default function ReflectPhase() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (audioEnabled) narrate(reflectNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(c => {
        if (c < CARDS.length) return c + 1;
        clearInterval(timer);
        return c;
      });
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-amber-50 to-cream pt-16 overflow-hidden">
      <div className="flex-1 flex flex-col items-center px-4 py-6 gap-5 max-w-2xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <div className="text-5xl mb-2">🪞</div>
          <h2 className="text-3xl font-black text-inkDark mb-1">What You Learned!</h2>
          <p className="text-base font-bold text-inkMid">6 big ideas from your measurement adventure</p>
        </motion.div>

        {/* Characters recap */}
        <div className="flex justify-center gap-6">
          {[
            { emoji: '👧', name: 'Maya', color: 'text-amber-600' },
            { emoji: '👦', name: 'Jake', color: 'text-teal-600' },
            { emoji: '👧🏻', name: 'Sofia', color: 'text-purple-600' },
          ].map(c => (
            <div key={c.name} className="flex flex-col items-center gap-1">
              <div className="text-4xl animate-float">{c.emoji}</div>
              <span className={`text-xs font-extrabold ${c.color}`}>{c.name}</span>
            </div>
          ))}
        </div>

        {/* Summary cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {CARDS.map((card, i) => (
            i < visibleCount ? (
              <motion.div
                key={card.title}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`bg-gradient-to-br ${card.color} border-2 rounded-card p-4`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{card.icon}</span>
                  <div>
                    <p className={`font-black text-lg ${card.textColor} mb-1`}>{card.title}</p>
                    <p className="text-sm font-bold text-inkDark leading-relaxed">{card.fact}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div key={card.title} className="bg-gray-100 border-2 border-gray-200 rounded-card p-4 opacity-30">
                <div className="flex items-start gap-3">
                  <span className="text-3xl grayscale">{card.icon}</span>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* CTA */}
        {visibleCount >= CARDS.length && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="bg-gradient-to-r from-teal-50 to-amber-50 border-2 border-teal-200 rounded-card p-4 text-center w-full">
              <p className="text-xl font-extrabold text-inkDark">🎮 Ready to test your skills?</p>
              <p className="text-base font-bold text-inkMid mt-1">12 practice questions await!</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.PRACTICE })}
              className="btn-primary flex items-center gap-2"
            >
              🎮 Start Practice! →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
