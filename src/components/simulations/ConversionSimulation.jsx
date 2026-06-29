import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station4Narration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateChallenge(index) {
  const type = index % 3;
  if (type === 0) {
    const m = randInt(1, 6); const cm = randInt(10, 90);
    return { prompt: `${m} m ${cm} cm = _____ cm`, answer: String(m * 100 + cm), hint: `${m} × 100 + ${cm} = ${m * 100 + cm}`, type: 'toTotal' };
  } else if (type === 1) {
    const m = randInt(2, 8);
    return { prompt: `${m} m = _____ cm`, answer: String(m * 100), hint: `${m} × 100 = ${m * 100}`, type: 'mToCm' };
  } else {
    const totalCm = randInt(100, 800);
    const m = Math.floor(totalCm / 100); const rem = totalCm % 100;
    return { prompt: `${totalCm} cm = _____ m`, answer: String(m), hint: `${totalCm} ÷ 100 = ${m} m (remainder ${rem} cm)`, type: 'cmToM' };
  }
}

export default function ConversionSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challenge, setChallenge] = useState(() => generateChallenge(0));
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const TOTAL_CHALLENGES = 5;

  useEffect(() => {
    if (audioEnabled) narrate(station4Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setChallenge(generateChallenge(challengeIndex));
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
    setAttempts(0);
  }, [challengeIndex]);

  const handleCheck = () => {
    const isCorrect = userInput.trim() === challenge.answer;
    setAttempts(a => a + 1);
    if (isCorrect) {
      setFeedback('correct');
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    } else {
      setFeedback('incorrect');
      if (attempts >= 1) setShowHint(true);
    }
  };

  const handleNext = () => {
    if (challengeIndex < TOTAL_CHALLENGES - 1) setChallengeIndex(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'conversion' });
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">

      <div className="flex items-center gap-2 self-end bg-blue-50 border border-blue-200 rounded-pill px-3 py-1">
        <span className="text-lg">🔄</span>
        <span className="text-base font-extrabold text-blue-700">{tokens} / {TOTAL_CHALLENGES} tokens</span>
      </div>

      <CharacterBubble character="jake" position="left"
        text="The secret formula: × 100 to go from m to cm, ÷ 100 to go from cm to m! 🔄" />

      {/* Conversion formula card */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-card p-4">
        <p className="text-xs font-extrabold text-inkMid mb-2 uppercase tracking-wider text-center">🔑 The Conversion Key</p>
        <div className="flex items-center justify-center gap-2 text-base font-extrabold">
          <div className="bg-teal-100 text-teal-700 rounded-pill px-4 py-2">metres (m)</div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-bold">× 100 →</span>
            <span className="text-xs text-gray-500 font-bold">← ÷ 100</span>
          </div>
          <div className="bg-amber-100 text-amber-700 rounded-pill px-4 py-2">centimetres (cm)</div>
        </div>
      </div>

      {/* Challenge card */}
      <motion.div
        key={challengeIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-white rounded-card shadow-card p-5 border-2 border-blue-100"
      >
        {/* Progress */}
        <div className="flex justify-between mb-4">
          {Array.from({ length: TOTAL_CHALLENGES }, (_, i) => (
            <div key={i} className={`h-2 flex-1 mx-0.5 rounded-pill ${i < challengeIndex ? 'bg-teal-500' : i === challengeIndex ? 'bg-amber-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        <p className="text-sm font-extrabold text-inkMid mb-1">Challenge {challengeIndex + 1} of {TOTAL_CHALLENGES}</p>

        {/* Bridge illustration */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
          <div className="text-5xl mb-2">🌉</div>
          <p className="text-2xl font-black text-inkDark">{challenge.prompt}</p>
        </div>

        {/* Input */}
        {feedback !== 'correct' && (
          <div className="flex gap-3 mb-3">
            <input
              type="number"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheck()}
              placeholder="Your answer"
              className="flex-1 border-2 border-gray-200 rounded-bubble px-4 py-3 text-xl font-extrabold text-center focus:outline-none focus:border-blue-400"
            />
            <button onClick={handleCheck} className="btn-secondary px-6 py-3 text-base">
              Check ✓
            </button>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback === 'incorrect' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-bubble p-3 mb-3 text-center">
              <p className="font-extrabold text-red-700">🤔 Not quite! Try again!</p>
            </motion.div>
          )}
          {feedback === 'correct' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-teal-50 border-2 border-teal-300 rounded-bubble p-4 mb-3 text-center">
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-extrabold text-xl text-teal-700">Correct! Answer: {challenge.answer}</p>
              <button onClick={handleNext} className="mt-3 btn-primary text-base px-6 py-3">
                {challengeIndex < TOTAL_CHALLENGES - 1 ? 'Next Challenge →' : '✅ Complete Station!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {showHint && feedback !== 'correct' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border border-amber-200 rounded-bubble p-3 text-center">
            <p className="text-sm font-extrabold text-amber-700">💡 Hint: {challenge.hint}</p>
          </motion.div>
        )}

        {!showHint && feedback === 'incorrect' && (
          <button onClick={() => setShowHint(true)} className="w-full text-sm font-bold text-amber-600 hover:text-amber-700 py-2">
            💡 Show hint
          </button>
        )}
      </motion.div>

      <div className="w-full bg-blue-50 border border-blue-200 rounded-card p-4">
        <p className="text-sm font-extrabold text-blue-700 mb-2">📌 Key Facts:</p>
        <ul className="space-y-1">
          {['100 cm = 1 m', 'Metres → Centimetres: multiply by 100', 'Centimetres → Metres: divide by 100', 'Example: 3 m 50 cm = 350 cm'].map(f => (
            <li key={f} className="text-sm font-bold text-inkDark flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <CelebrationOverlay show={showCelebration} message="🔗 Rope knot earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
