import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station3Narration } from '../../utils/narration.js';
import StarRating from '../ui/StarRating.jsx';

const ITEMS = [
  { name: 'a pencil',    emoji: '✏️', actualCm: 17, max: 50,  bg: 'from-amber-400 to-yellow-500' },
  { name: 'a textbook',  emoji: '📖', actualCm: 30, max: 60,  bg: 'from-teal-400 to-green-500' },
  { name: 'your shoe',   emoji: '👟', actualCm: 24, max: 50,  bg: 'from-purple-400 to-indigo-500' },
];

const BENCHMARKS = [
  { icon: '☝️', label: 'Finger width', value: '≈ 1 cm' },
  { icon: '🤚', label: 'Hand span',    value: '≈ 15–20 cm' },
  { icon: '💪', label: 'Forearm',      value: '≈ 30 cm' },
];

function getStars(estimate, actual) {
  const pct = Math.abs(estimate - actual) / actual;
  if (pct <= 0.05) return 3;
  if (pct <= 0.15) return 2;
  return 1;
}

export default function EstimationSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [itemIdx, setItemIdx] = useState(0);
  const [estimate, setEstimate] = useState(25);
  const [revealed, setRevealed] = useState(false);
  const [stars, setStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  const item = ITEMS[itemIdx];

  useEffect(() => {
    if (audioEnabled) narrate(station3Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setEstimate(Math.floor(item.max / 2));
    setRevealed(false);
    setStars(0);
  }, [itemIdx]);

  const handleEstimate = () => {
    const s = getStars(estimate, item.actualCm);
    setStars(s);
    setRevealed(true);
    dispatch({ type: 'EARN_TOKEN', amount: s });
    setTotalStars(t => t + s);
  };

  const handleNext = () => {
    if (itemIdx < ITEMS.length - 1) setItemIdx(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'estimation' });
  };

  const diff = Math.abs(estimate - item.actualCm);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-500/40 rounded-2xl px-3 py-2">
          <span className="text-2xl">🧑‍🦱</span>
          <div>
            <p className="text-xs font-extrabold text-yellow-300">OMAR</p>
            <p className="text-xs font-bold text-white/70">The Explorer</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-900/30 border border-yellow-500/40 rounded-pill px-3 py-2">
          <span className="text-xl">⭐</span>
          <span className="text-base font-black text-yellow-300">{totalStars} stars</span>
        </div>
      </div>

      {/* Benchmark reference */}
      <div className="grid grid-cols-3 gap-2">
        {BENCHMARKS.map(b => (
          <div key={b.label} className="bg-white/10 border border-white/15 rounded-2xl p-2 text-center">
            <div className="text-2xl">{b.icon}</div>
            <p className="text-xs font-extrabold text-white/80 mt-0.5">{b.label}</p>
            <p className="text-xs font-black text-amber-400">{b.value}</p>
          </div>
        ))}
      </div>

      {/* Main card */}
      <AnimatePresence mode="wait">
        <motion.div key={itemIdx}
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-float overflow-hidden"
        >
          {/* Object display */}
          <div className={`bg-gradient-to-br ${item.bg} px-5 py-6 text-center`}>
            <div className="text-7xl mb-2">{item.emoji}</div>
            <p className="text-xl font-black text-white">Estimate the length of</p>
            <p className="text-2xl font-black text-white drop-shadow">{item.name}</p>
            <p className="text-sm font-bold text-white/70 mt-1">Item {itemIdx + 1} of {ITEMS.length}</p>
          </div>

          <div className="px-5 py-4 space-y-4">
            {!revealed ? (
              <>
                {/* Slider */}
                <div className="text-center">
                  <p className="text-4xl font-black text-amber-600 mb-1">{estimate} cm</p>
                  <p className="text-sm font-bold text-gray-500">Move the slider to your best estimate</p>
                </div>
                <input type="range" min={1} max={item.max} value={estimate}
                  onChange={e => setEstimate(Number(e.target.value))}
                  className="w-full h-5 rounded-pill accent-amber-500 cursor-pointer" />
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>1 cm</span>
                  <span>{item.max} cm</span>
                </div>
                <button onClick={handleEstimate}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xl py-4 rounded-pill shadow-glow transition-all active:scale-95">
                  🎯 That's my estimate!
                </button>
              </>
            ) : (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Stars */}
                  <div className={`rounded-2xl p-4 text-center border-2 ${stars === 3 ? 'bg-teal-50 border-teal-400' : stars === 2 ? 'bg-amber-50 border-amber-400' : 'bg-purple-50 border-purple-300'}`}>
                    <StarRating stars={stars} size="md" />
                    <p className="font-black text-xl text-gray-800 mt-2">
                      {stars === 3 ? '🎯 Perfect estimate!' : stars === 2 ? '👍 Good estimate!' : '💪 Nice try!'}
                    </p>
                    <p className="font-bold text-gray-600 mt-1">
                      Actual: <span className="text-teal-600 font-black text-2xl">{item.actualCm} cm</span>
                    </p>
                    <p className="text-sm text-gray-500">Your guess: {estimate} cm · {diff === 0 ? 'Exact!' : `${diff} cm off`}</p>
                  </div>

                  {/* Visual comparison bar */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-extrabold text-gray-500 text-center mb-2">Visual comparison:</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-1">Your estimate ({estimate} cm)</p>
                        <div className="bg-gray-200 rounded-pill h-5 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-pill transition-all"
                            style={{ width: `${(estimate / item.max) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-teal-600 mb-1">Actual ({item.actualCm} cm)</p>
                        <div className="bg-gray-200 rounded-pill h-5 overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-pill"
                            style={{ width: `${(item.actualCm / item.max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleNext}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xl py-4 rounded-pill shadow-glow transition-all active:scale-95">
                    {itemIdx < ITEMS.length - 1 ? 'Next Object →' : '✅ Complete Station!'}
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
