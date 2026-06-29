import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station4Narration } from '../../utils/narration.js';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genChallenge(i) {
  const t = i % 3;
  if (t === 0) {
    const m = randInt(1, 6), cm = randInt(10, 90);
    return { q: `${m} m ${cm} cm = _____ cm`, ans: m * 100 + cm, hint: `${m} × 100 + ${cm} = ${m * 100 + cm}`, type: 'a' };
  } else if (t === 1) {
    const m = randInt(2, 9);
    return { q: `${m} m = _____ cm`, ans: m * 100, hint: `${m} × 100 = ${m * 100}`, type: 'b' };
  } else {
    const total = randInt(100, 900);
    const m = Math.floor(total / 100), rem = total % 100;
    return { q: `${total} cm = _____ m _____ cm`, ans: `${m}m${rem}`, hint: `${total} ÷ 100 = ${m} m, remainder ${rem} cm`, type: 'c', m, rem };
  }
}

const TOTAL = 5;

export default function ConversionSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [idx, setIdx] = useState(0);
  const [challenge, setChallenge] = useState(() => genChallenge(0));
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrate(station4Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setChallenge(genChallenge(idx));
    setInputA(''); setInputB('');
    setFeedback(null); setShowHint(false); setAttempts(0);
  }, [idx]);

  const handleCheck = () => {
    let correct = false;
    if (challenge.type === 'c') {
      correct = parseInt(inputA) === challenge.m && parseInt(inputB) === challenge.rem;
    } else {
      correct = parseInt(inputA) === challenge.ans;
    }
    setAttempts(a => a + 1);
    if (correct) {
      setFeedback('correct');
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    } else {
      setFeedback('wrong');
      if (attempts >= 1) setShowHint(true);
    }
  };

  const handleNext = () => {
    if (idx < TOTAL - 1) setIdx(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'conversion' });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-500/40 rounded-2xl px-3 py-2">
          <span className="text-2xl">👨‍🔧</span>
          <div>
            <p className="text-xs font-extrabold text-blue-300">NOAH</p>
            <p className="text-xs font-bold text-white/70">The Engineer</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-900/30 border border-blue-500/40 rounded-pill px-3 py-2">
          <span className="text-xl">🔗</span>
          <span className="text-base font-black text-blue-300">{tokens}/{TOTAL}</span>
        </div>
      </div>

      {/* Conversion formula — always visible */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
        <p className="text-xs font-extrabold text-white/50 uppercase tracking-wider text-center mb-2">🔑 The Conversion Key</p>
        <div className="flex items-center justify-center gap-2">
          <div className="bg-teal-500/30 border border-teal-400/40 rounded-2xl px-4 py-2 text-center">
            <p className="text-lg font-black text-teal-300">metres (m)</p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-xs font-extrabold text-amber-300">× 100</span>
              <span className="text-white/40 text-xs">→</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white/40 text-xs">←</span>
              <span className="text-xs font-extrabold text-amber-300">÷ 100</span>
            </div>
          </div>
          <div className="bg-amber-500/30 border border-amber-400/40 rounded-2xl px-4 py-2 text-center">
            <p className="text-lg font-black text-amber-300">centimetres (cm)</p>
          </div>
        </div>
      </div>

      {/* Challenge progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className={`flex-1 h-2.5 rounded-pill transition-all ${i < idx ? 'bg-teal-500' : i === idx ? 'bg-amber-400' : 'bg-white/15'}`} />
        ))}
      </div>

      {/* Challenge card */}
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-float overflow-hidden"
        >
          {/* Bridge scene header */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 px-5 py-5 text-center">
            <div className="text-5xl mb-2">🌉</div>
            <p className="text-sm font-extrabold text-blue-200 mb-1">Challenge {idx + 1} of {TOTAL}</p>
            <p className="text-2xl font-black text-white">{challenge.q}</p>
          </div>

          <div className="px-5 py-4 space-y-3">
            {feedback !== 'correct' ? (
              <>
                {challenge.type === 'c' ? (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-extrabold text-gray-500 mb-1">Metres</p>
                      <input type="number" value={inputA}
                        onChange={e => setInputA(e.target.value)}
                        placeholder="? m"
                        className="w-full border-2 border-gray-200 rounded-2xl px-3 py-3 text-2xl font-black text-center focus:outline-none focus:border-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-extrabold text-gray-500 mb-1">Centimetres left</p>
                      <input type="number" value={inputB}
                        onChange={e => setInputB(e.target.value)}
                        placeholder="? cm"
                        className="w-full border-2 border-gray-200 rounded-2xl px-3 py-3 text-2xl font-black text-center focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                ) : (
                  <input type="number" value={inputA}
                    onChange={e => setInputA(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && inputA && handleCheck()}
                    placeholder="Your answer"
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-3xl font-black text-center focus:outline-none focus:border-blue-400" />
                )}

                <button onClick={handleCheck} disabled={!inputA}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xl py-4 rounded-pill transition-all active:scale-95">
                  Check ✓
                </button>
              </>
            ) : null}

            {/* Feedback */}
            <AnimatePresence>
              {feedback === 'wrong' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
                  <p className="font-extrabold text-red-600">🤔 Not quite! Try again!</p>
                </motion.div>
              )}
              {feedback === 'correct' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-teal-50 border-2 border-teal-400 rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-black text-xl text-gray-800">
                    Correct! {challenge.type === 'c' ? `${challenge.m} m ${challenge.rem} cm` : `${challenge.ans} cm`}
                  </p>
                  <button onClick={handleNext}
                    className="mt-3 bg-teal-500 hover:bg-teal-600 text-white font-black text-lg px-8 py-3 rounded-pill transition-all active:scale-95">
                    {idx < TOTAL - 1 ? 'Next Challenge →' : '✅ Complete Station!'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {showHint && feedback !== 'correct' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                <p className="text-sm font-extrabold text-amber-700">💡 Hint: {challenge.hint}</p>
              </motion.div>
            )}
            {!showHint && feedback === 'wrong' && (
              <button onClick={() => setShowHint(true)}
                className="w-full text-sm font-bold text-amber-400 hover:text-amber-300 py-1">
                💡 Show hint
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <CelebrationOverlay show={showCelebration} message="🔗 Rope knot earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
