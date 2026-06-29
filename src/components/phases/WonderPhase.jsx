import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

const CHOICES = [
  { id: 'hands', label: 'Using my hands and feet!', emoji: '🤚', color: 'border-amber-400 bg-amber-50',
    response: 'Great thinking! Body parts were the very first measuring tools — ancient Egyptians used the "cubit" (elbow to fingertip). That is how measurement began!' },
  { id: 'ruler', label: 'With a ruler!', emoji: '📏', color: 'border-teal-400 bg-teal-50',
    response: 'Excellent! A ruler uses standard units everyone agrees on — so your measurement matches mine, whether you are in London or Singapore!' },
  { id: 'steps', label: 'By counting steps!', emoji: '👣', color: 'border-purple-400 bg-purple-50',
    response: 'Smart! Steps work but everyone has different sized feet — that is exactly why scientists invented standard units like centimetres and metres!' },
];

export default function WonderPhase() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [selected, setSelected] = useState(null);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  const handleChoice = (choice) => {
    if (selected) return;
    setSelected(choice);
    setTimeout(() => setShowContinue(true), 1200);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#1E0B3B] to-[#2D1B69] overflow-hidden pt-14 relative">

      {/* Decorative background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" aria-hidden>
        <circle cx="10%" cy="20%" r="80" fill="#A855F7" />
        <circle cx="90%" cy="30%" r="60" fill="#F59E0B" />
        <circle cx="50%" cy="90%" r="100" fill="#14B8A6" />
      </svg>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 py-3 max-w-lg mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <div className="text-5xl mb-1">🔮</div>
          <h2 className="text-3xl font-black text-white">Wonder Time!</h2>
          <p className="text-base font-bold text-purple-200">Spark your curiosity</p>
        </motion.div>

        {/* Character dialogue */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-3"
        >
          {/* Jake */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/30 border-2 border-teal-400 flex items-center justify-center text-2xl flex-shrink-0">👦</div>
            <div className="bg-teal-500/20 border border-teal-400/40 rounded-2xl rounded-tl-none px-4 py-2 flex-1">
              <p className="text-xs font-extrabold text-teal-300 mb-0.5">OLIVER</p>
              <p className="text-sm font-bold text-white leading-snug">"We'll need to measure everything on this adventure!"</p>
            </div>
          </div>
          {/* Sofia */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="w-12 h-12 rounded-full bg-purple-500/30 border-2 border-purple-400 flex items-center justify-center text-2xl flex-shrink-0">👧🏻</div>
            <div className="bg-purple-500/20 border border-purple-400/40 rounded-2xl rounded-tr-none px-4 py-2 flex-1">
              <p className="text-xs font-extrabold text-purple-300 mb-0.5 text-right">LILY</p>
              <p className="text-sm font-bold text-white leading-snug text-right">"But what IS length? How do people measure around the world?"</p>
            </div>
          </div>
        </motion.div>

        {/* Big question */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
          className="w-full text-center"
        >
          <p className="text-xl font-black text-white mb-3">How do YOU think people measure things?</p>
          <div className="flex flex-col gap-2">
            {CHOICES.map((choice, i) => (
              <motion.button
                key={choice.id}
                initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleChoice(choice)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 font-extrabold text-left transition-all
                  ${selected?.id === choice.id
                    ? `${choice.color} shadow-lg scale-102`
                    : selected
                      ? 'border-white/10 bg-white/5 opacity-50'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40'
                  }`}
              >
                <span className="text-3xl">{choice.emoji}</span>
                <span className={`text-base font-extrabold ${selected?.id === choice.id ? 'text-gray-800' : 'text-white'}`}>
                  {choice.label}
                </span>
                {selected?.id === choice.id && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-2xl">✅</motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Maya's response + continue */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center text-2xl flex-shrink-0">👧</div>
                <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl rounded-tl-none px-4 py-2 flex-1">
                  <p className="text-xs font-extrabold text-amber-300 mb-0.5">EMMA</p>
                  <p className="text-sm font-bold text-white leading-snug">✨ {selected.response}</p>
                </div>
              </div>

              {showContinue && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.INTRO })}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black text-lg py-4 rounded-pill shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  Continue to the Story! 📖
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
