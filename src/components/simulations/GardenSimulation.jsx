import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station2Narration } from '../../utils/narration.js';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const OBJECTS = [
  { name: 'Giant Sunflower', emoji: '🌻', trueM: 2, trueCm: 30 },
  { name: 'Garden Fence',    emoji: '🌿', trueM: 3, trueCm: 50 },
  { name: 'Trampoline',      emoji: '⭕', trueM: 1, trueCm: 80 },
];

export default function GardenSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [objIdx, setObjIdx] = useState(0);
  const [stickCount, setStickCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const obj = OBJECTS[objIdx];
  const totalCm = obj.trueM * 100 + obj.trueCm;

  useEffect(() => {
    if (audioEnabled) narrate(station2Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setStickCount(0); setUserInput(''); setAnswered(false); setIsCorrect(null);
  }, [objIdx]);

  const handleAddStick = () => {
    if (stickCount < obj.trueM + 2) setStickCount(s => s + 1);
  };

  const handleCheck = () => {
    const val = parseInt(userInput);
    const correct = val === obj.trueM;
    setIsCorrect(correct); setAnswered(true);
    if (correct) {
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    }
  };

  const handleNext = () => {
    if (objIdx < OBJECTS.length - 1) setObjIdx(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'garden' });
  };

  const STICK_COLORS = ['bg-teal-500', 'bg-teal-400', 'bg-teal-600'];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/40 rounded-2xl px-3 py-2">
          <span className="text-2xl">👩‍🌾</span>
          <div>
            <p className="text-xs font-extrabold text-green-300">LENA</p>
            <p className="text-xs font-bold text-white/70">The Gardener</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-500/40 rounded-pill px-3 py-2">
          <span className="text-xl">🌿</span>
          <span className="text-base font-black text-green-300">{tokens}/{OBJECTS.length}</span>
        </div>
      </div>

      {/* Key formula */}
      <div className="bg-teal-500/15 border border-teal-400/40 rounded-2xl px-5 py-3">
        <div className="flex items-center justify-center gap-3">
          <div className="text-center">
            <p className="text-2xl font-black text-teal-300">1 m</p>
            <p className="text-xs font-bold text-white/50">metre</p>
          </div>
          <p className="text-2xl font-black text-white/50">=</p>
          <div className="text-center">
            <p className="text-2xl font-black text-amber-300">100 cm</p>
            <p className="text-xs font-bold text-white/50">centimetres</p>
          </div>
        </div>
      </div>

      {/* Main object card */}
      <AnimatePresence mode="wait">
        <motion.div key={objIdx}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-float overflow-hidden border-2 border-green-200"
        >
          {/* Object header */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-green-100">
            <span className="text-5xl">{obj.emoji}</span>
            <div>
              <p className="text-2xl font-black text-gray-800">{obj.name}</p>
              <p className="text-sm font-bold text-gray-500">
                {obj.trueM} m {obj.trueCm} cm = {totalCm} cm total
              </p>
            </div>
          </div>

          {/* Metre stick visualizer */}
          <div className="px-5 py-4 bg-green-50">
            <p className="text-sm font-extrabold text-gray-600 mb-3 text-center">
              Click to place metre sticks — how many <span className="text-teal-600 font-black">whole metres</span>?
            </p>

            {/* Stick display */}
            <div className="flex flex-wrap gap-1.5 min-h-[52px] items-center bg-white rounded-xl p-3 mb-3 border border-green-200">
              {Array.from({ length: stickCount }, (_, i) => (
                <motion.div key={i}
                  initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                  className={`h-12 rounded-lg text-white text-xs font-extrabold flex items-center justify-center ${STICK_COLORS[i % 3]}`}
                  style={{ width: '56px' }}
                >
                  1 m
                </motion.div>
              ))}
              {stickCount === 0 && (
                <p className="text-gray-400 text-sm font-bold w-full text-center">Tap the button to place sticks!</p>
              )}
            </div>

            <button onClick={handleAddStick}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-lg rounded-2xl transition-all active:scale-95">
              📐 Place Metre Stick ({stickCount} placed)
            </button>
          </div>

          {/* Answer */}
          <div className="px-5 py-4">
            {!answered ? (
              stickCount > 0 ? (
                <div className="space-y-3">
                  <p className="text-lg font-extrabold text-gray-700">
                    How many <span className="text-teal-600">full metres</span> is the {obj.name}?
                  </p>
                  <div className="flex gap-3">
                    <input type="number" value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && userInput && handleCheck()}
                      placeholder="? metres"
                      className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-2xl font-black text-center focus:outline-none focus:border-teal-400" />
                    <button onClick={handleCheck} disabled={!userInput}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-black text-lg px-6 rounded-2xl transition-all active:scale-95">
                      Check ✓
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-base font-bold text-gray-500 text-center py-2">Place metre sticks first! 👆</p>
              )
            ) : (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl p-4 text-center border-2 ${isCorrect ? 'bg-teal-50 border-teal-400' : 'bg-red-50 border-red-300'}`}
                >
                  <div className="text-4xl mb-2">{isCorrect ? '🎉' : '🤔'}</div>
                  <p className="font-black text-xl text-gray-800">
                    {isCorrect ? `Correct! ${obj.trueM} m ${obj.trueCm} cm!` : `It was ${obj.trueM} m ${obj.trueCm} cm!`}
                  </p>
                  <button onClick={handleNext}
                    className="mt-3 bg-teal-500 hover:bg-teal-600 text-white font-black text-lg px-8 py-3 rounded-pill transition-all active:scale-95">
                    {objIdx < OBJECTS.length - 1 ? 'Next Object →' : '✅ Complete Station!'}
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Key facts */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '📐', fact: '1 m = 100 cm' },
            { icon: '🏠', fact: 'Rooms use metres' },
            { icon: '✏️', fact: 'Pencils use cm' },
          ].map(f => (
            <div key={f.fact} className="bg-white/5 rounded-xl p-2 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs font-extrabold text-white/80">{f.fact}</p>
            </div>
          ))}
        </div>
      </div>

      <CelebrationOverlay show={showCelebration} message="🌿 Token earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
