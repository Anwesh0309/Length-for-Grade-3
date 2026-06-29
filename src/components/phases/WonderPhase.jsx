import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';

const CHOICES = [
  { id: 'hands', label: 'Using my hands and feet!', emoji: '🤚', response: 'Great thinking! People have always used body parts to measure. That is how ancient measurements began!' },
  { id: 'ruler', label: 'With a ruler!', emoji: '📏', response: 'Excellent! A ruler uses standard units that everyone agrees on — so we all get the same answer!' },
  { id: 'steps', label: 'By counting steps!', emoji: '👣', response: 'Smart! Counting steps works too! But everyone has different sized steps — that is why we need standard units!' },
];

export default function WonderPhase() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [selected, setSelected] = useState(null);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  const handleChoice = (choice) => {
    setSelected(choice);
    setShowResponse(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-purple-50 to-cream overflow-hidden pt-16">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6 max-w-2xl mx-auto w-full">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-3">🔮</div>
          <h2 className="text-3xl font-black text-purple-700 mb-2">Wonder Time!</h2>
          <p className="text-lg font-bold text-inkMid">What do YOU think length is all about?</p>
        </motion.div>

        {/* Character bubbles */}
        <div className="flex flex-col gap-3 w-full">
          <CharacterBubble character="jake" position="left" text="Jake pulled out his notebook. 'We will need to measure everything,' he said." />
          <CharacterBubble character="sofia" position="right" text="But Sofia asked — 'What IS length, anyway? And how do people measure it all around the world?'" />
        </div>

        {/* Question */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-card shadow-card p-5 w-full text-center border-2 border-purple-100"
        >
          <p className="text-xl font-extrabold text-inkDark mb-4">How do YOU think people measure things?</p>
          <div className="grid grid-cols-1 gap-3">
            {CHOICES.map((choice, i) => (
              <motion.button
                key={choice.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(choice)}
                className={`flex items-center gap-4 p-4 rounded-bubble border-2 font-extrabold text-left transition-all text-base
                  ${selected?.id === choice.id
                    ? 'border-amber-500 bg-amber-50 shadow-glow'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                  }`}
              >
                <span className="text-3xl">{choice.emoji}</span>
                <span className="text-inkDark">{choice.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Maya's response */}
        {showResponse && selected && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="w-full"
          >
            <CharacterBubble character="maya" position="left" text={`✨ ${selected.response}`} />
          </motion.div>
        )}

        {/* Continue button */}
        {showResponse && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.INTRO })}
            className="btn-primary flex items-center gap-2"
          >
            Continue to the Story! 📖 →
          </motion.button>
        )}
      </div>
    </div>
  );
}
