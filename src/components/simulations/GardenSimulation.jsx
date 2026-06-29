import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station2Narration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const OBJECTS = [
  { name: 'Giant Sunflower', emoji: '🌻', trueM: 2, trueCm: 30, totalCm: 230 },
  { name: 'Garden Bed', emoji: '🌱', trueM: 3, trueCm: 50, totalCm: 350 },
  { name: 'Fence Panel', emoji: '🌿', trueM: 1, trueCm: 75, totalCm: 175 },
];

export default function GardenSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [objIndex, setObjIndex] = useState(0);
  const [stickCount, setStickCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const obj = OBJECTS[objIndex];
  const maxSticks = obj.trueM + (obj.trueCm > 0 ? 1 : 0);

  useEffect(() => {
    if (audioEnabled) narrate(station2Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setStickCount(0);
    setAnswered(false);
    setCorrect(null);
    setUserInput('');
  }, [objIndex]);

  const handleAddStick = () => {
    if (stickCount < maxSticks + 2) setStickCount(s => s + 1);
  };

  const handleCheck = () => {
    const userM = parseInt(userInput.split('m')[0]?.trim()) || 0;
    const isCorrect = userM === obj.trueM;
    setCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) {
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    }
  };

  const handleNext = () => {
    if (objIndex < OBJECTS.length - 1) setObjIndex(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'garden' });
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">

      <div className="flex items-center gap-2 self-end bg-green-50 border border-green-200 rounded-pill px-3 py-1">
        <span className="text-lg">🌿</span>
        <span className="text-base font-extrabold text-green-700">{tokens} / {OBJECTS.length} tokens</span>
      </div>

      <CharacterBubble character="jake" position="left" text="This ruler is too small! Use the metre stick for big things — 1 metre = 100 cm! 📐" />

      <motion.div
        key={objIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-white rounded-card shadow-card p-5 border-2 border-green-100"
      >
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">{obj.emoji}</div>
          <p className="text-xl font-extrabold text-inkDark">{obj.name}</p>
          <p className="text-base font-bold text-green-600">Actual length: {obj.trueM} m {obj.trueCm} cm</p>
        </div>

        {/* Metre stick visualisation */}
        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-extrabold text-inkMid mb-3 text-center">
            Click to place metre sticks ({stickCount} placed):
          </p>

          <div className="flex items-end gap-1 min-h-12 flex-wrap mb-3">
            {Array.from({ length: stickCount }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                className={`h-10 rounded text-white text-xs font-extrabold flex items-center justify-center ${
                  i < obj.trueM ? 'bg-teal-500' : 'bg-amber-400'
                }`}
                style={{ width: i < obj.trueM ? '60px' : `${(obj.trueCm / 100) * 60}px`, minWidth: '10px' }}
              >
                {i < obj.trueM ? '1m' : `${obj.trueCm}cm`}
              </motion.div>
            ))}
          </div>

          <button
            onClick={handleAddStick}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-extrabold rounded-bubble transition-all active:scale-95"
          >
            📐 Place Metre Stick
          </button>

          {stickCount > 0 && (
            <p className="text-center text-sm font-bold text-inkMid mt-2">
              Total: {stickCount === obj.trueM ? `${obj.trueM} m` : `${stickCount} m`}
              {stickCount > obj.trueM && ` + ${obj.trueCm} cm`}
            </p>
          )}
        </div>

        {/* Answer input */}
        {!answered && stickCount >= obj.trueM && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-base font-extrabold text-inkDark mb-2">
              How many full metres long is the {obj.name}?
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={`? metres`}
                className="flex-1 border-2 border-gray-200 rounded-bubble px-4 py-3 text-xl font-extrabold text-center focus:outline-none focus:border-teal-400"
                min="0"
                max="10"
              />
              <button onClick={handleCheck} className="btn-secondary text-base px-5 py-3">
                Check ✓
              </button>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-bubble p-4 text-center border-2 ${correct ? 'bg-teal-50 border-teal-300' : 'bg-red-50 border-red-200'}`}
          >
            <div className="text-3xl mb-1">{correct ? '🎉' : '🤔'}</div>
            <p className="font-extrabold text-lg">
              {correct ? `Correct! It is ${obj.trueM} m ${obj.trueCm} cm!` : `It was ${obj.trueM} m ${obj.trueCm} cm!`}
            </p>
            <button onClick={handleNext} className="mt-3 btn-primary text-base px-6 py-3">
              {objIndex < OBJECTS.length - 1 ? 'Next Object →' : '✅ Complete Station!'}
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Key facts */}
      <div className="w-full bg-teal-50 border border-teal-200 rounded-card p-4">
        <p className="text-sm font-extrabold text-teal-700 mb-2">📌 Key Facts:</p>
        <ul className="space-y-1">
          {['1 metre (m) = 100 centimetres (cm)', 'Use metres for long objects like rooms, gardens, fences', 'Use centimetres for smaller objects like pencils and books'].map(f => (
            <li key={f} className="text-sm font-bold text-inkDark flex items-start gap-2">
              <span className="text-teal-500 mt-0.5">✓</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <CelebrationOverlay show={showCelebration} message="🌿 Token earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
