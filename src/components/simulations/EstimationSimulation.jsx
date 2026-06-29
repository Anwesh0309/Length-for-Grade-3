import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station3Narration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';
import StarRating from '../ui/StarRating.jsx';

const ITEMS = [
  { name: 'a pencil', emoji: '✏️', actualCm: 17, max: 50 },
  { name: 'a textbook', emoji: '📖', actualCm: 30, max: 60 },
  { name: 'your shoe', emoji: '👟', actualCm: 24, max: 50 },
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
  const [itemIndex, setItemIndex] = useState(0);
  const [estimate, setEstimate] = useState(25);
  const [revealed, setRevealed] = useState(false);
  const [stars, setStars] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  const item = ITEMS[itemIndex];

  useEffect(() => {
    if (audioEnabled) narrate(station3Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setEstimate(Math.floor(item.max / 2));
    setRevealed(false);
    setStars(0);
  }, [itemIndex]);

  const handleEstimate = () => {
    const s = getStars(estimate, item.actualCm);
    setStars(s);
    setRevealed(true);
    dispatch({ type: 'EARN_TOKEN', amount: s });
    setTotalTokens(t => t + s);
  };

  const handleNext = () => {
    if (itemIndex < ITEMS.length - 1) setItemIndex(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'estimation' });
  };

  const accuracy = revealed ? Math.abs(estimate - item.actualCm) : null;

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">

      <div className="flex items-center gap-2 self-end bg-yellow-50 border border-yellow-200 rounded-pill px-3 py-1">
        <span className="text-lg">⭐</span>
        <span className="text-base font-extrabold text-yellow-700">{totalTokens} stars earned</span>
      </div>

      <CharacterBubble character="maya" position="left"
        text="Great explorers estimate before measuring! Use your body as a guide — your finger ≈ 1 cm, hand span ≈ 15–20 cm! 🤚" />

      <motion.div
        key={itemIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-white rounded-card shadow-card p-5 border-2 border-yellow-100"
      >
        <div className="text-center mb-4">
          <div className="text-7xl mb-2">{item.emoji}</div>
          <p className="text-xl font-extrabold text-inkDark">Estimate the length of {item.name}</p>
          <p className="text-sm font-bold text-inkMid">Object {itemIndex + 1} of {ITEMS.length}</p>
        </div>

        {/* Body reference benchmarks */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: '☝️', label: 'Finger', value: '≈ 1 cm' },
            { icon: '🤚', label: 'Hand span', value: '≈ 15-20 cm' },
            { icon: '💪', label: 'Forearm', value: '≈ 30 cm' },
          ].map(ref => (
            <div key={ref.label} className="bg-amber-50 rounded-bubble p-2 text-center">
              <div className="text-2xl">{ref.icon}</div>
              <div className="text-xs font-extrabold text-inkDark">{ref.label}</div>
              <div className="text-xs font-bold text-amber-600">{ref.value}</div>
            </div>
          ))}
        </div>

        {/* Slider */}
        <div className="mb-4">
          <p className="text-center text-2xl font-black text-amber-600 mb-2">{estimate} cm</p>
          <input
            type="range"
            min="1"
            max={item.max}
            value={estimate}
            onChange={e => setEstimate(Number(e.target.value))}
            disabled={revealed}
            className="w-full h-4 rounded-pill accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs font-bold text-inkMid mt-1">
            <span>1 cm</span>
            <span>{item.max} cm</span>
          </div>
        </div>

        {!revealed ? (
          <button onClick={handleEstimate} className="btn-primary w-full">
            🎯 That's my estimate!
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Result */}
            <div className={`rounded-bubble p-4 text-center border-2 ${stars === 3 ? 'bg-teal-50 border-teal-300' : stars === 2 ? 'bg-amber-50 border-amber-300' : 'bg-purple-50 border-purple-200'}`}>
              <StarRating stars={stars} size="md" />
              <p className="font-extrabold text-lg mt-2">
                {stars === 3 ? '🎯 Perfect estimate!' : stars === 2 ? '👍 Good estimate!' : '💪 Nice try!'}
              </p>
              <p className="font-bold text-inkMid mt-1">
                Actual length: <span className="font-black text-teal-600 text-xl">{item.actualCm} cm</span>
              </p>
              <p className="text-sm font-bold text-inkMid">
                Your estimate: {estimate} cm ({accuracy === 0 ? 'Exact!' : `${accuracy} cm off`})
              </p>
            </div>

            {/* Animated ruler reveal */}
            <div className="bg-gray-50 rounded-xl p-3 overflow-x-auto">
              <p className="text-xs font-extrabold text-inkMid mb-2 text-center">📏 Actual measurement:</p>
              <svg width={Math.max(200, item.actualCm * 6 + 30)} height="50" className="mx-auto block">
                <rect x="10" y="20" width={item.actualCm * 6} height="16" fill="#14B8A6" rx="3" opacity="0.8" />
                <line x1="10" y1="15" x2="10" y2="40" stroke="#374151" strokeWidth="2" />
                <line x1={10 + item.actualCm * 6} y1="15" x2={10 + item.actualCm * 6} y2="40" stroke="#374151" strokeWidth="2" />
                <text x={10 + item.actualCm * 3} y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0D9488">
                  {item.actualCm} cm
                </text>
              </svg>
            </div>

            <button onClick={handleNext} className="btn-primary w-full">
              {itemIndex < ITEMS.length - 1 ? 'Next Object →' : '✅ Complete Station!'}
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="w-full bg-yellow-50 border border-yellow-200 rounded-card p-4">
        <p className="text-sm font-extrabold text-yellow-700 mb-2">📌 Body Benchmarks:</p>
        <ul className="space-y-1">
          {['Finger width ≈ 1 cm', 'Hand span ≈ 15–20 cm', 'Arm length ≈ 60 cm', 'Door height ≈ 2 m'].map(f => (
            <li key={f} className="text-sm font-bold text-inkDark flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">✓</span>{f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
