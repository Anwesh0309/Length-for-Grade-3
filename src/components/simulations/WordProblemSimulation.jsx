import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station6Narration } from '../../utils/narration.js';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const PROBLEMS = [
  {
    title: 'The Three Paths',
    emoji: '🗺️',
    bg: 'from-purple-600 to-indigo-700',
    text: "The path to the treasure has 3 sections. Section 1 is 45 m long. Section 2 is twice as long. Section 3 is 30 m shorter than Section 2. How long is the whole path?",
    steps: [
      { label: 'Section 1', calc: '45 m', value: 45, color: 'bg-amber-200' },
      { label: 'Section 2 = 45 × 2', calc: '90 m', value: 90, color: 'bg-teal-200' },
      { label: 'Section 3 = 90 − 30', calc: '60 m', value: 60, color: 'bg-purple-200' },
      { label: 'TOTAL = 45 + 90 + 60', calc: '195 m', value: 195, color: 'bg-pink-200', isTotal: true },
    ],
    answer: 195,
    unit: 'm',
    prompt: 'How many metres is the whole path?',
  },
  {
    title: "Emma's Ribbon",
    emoji: '🎀',
    bg: 'from-pink-500 to-rose-600',
    text: "Emma has a ribbon that is 1 m 20 cm long. She cuts off 35 cm. How much ribbon is left?",
    steps: [
      { label: 'Start: 1 m 20 cm', calc: '= 120 cm', value: 120, color: 'bg-pink-200' },
      { label: 'Cut off', calc: '− 35 cm', value: -35, color: 'bg-red-200' },
      { label: 'Remaining', calc: '= 85 cm', value: 85, color: 'bg-green-200', isTotal: true },
    ],
    answer: 85,
    unit: 'cm',
    prompt: 'How many cm of ribbon is left?',
  },
  {
    title: "Oliver vs Liam",
    emoji: '🏃',
    bg: 'from-teal-500 to-cyan-600',
    text: "Oliver walked 2 m 50 cm. Liam walked 180 cm. How much further did Oliver walk than Liam?",
    steps: [
      { label: "Oliver: 2 m 50 cm", calc: '= 250 cm', value: 250, color: 'bg-blue-200' },
      { label: "Liam: 180 cm", calc: '180 cm', value: 180, color: 'bg-green-200' },
      { label: "Difference: 250 − 180", calc: '= 70 cm', value: 70, color: 'bg-amber-200', isTotal: true },
    ],
    answer: 70,
    unit: 'cm',
    prompt: 'How many cm further did Oliver walk?',
  },
];

export default function WordProblemSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [pIdx, setPIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [revealSteps, setRevealSteps] = useState(false);

  const p = PROBLEMS[pIdx];

  useEffect(() => {
    if (audioEnabled) narrate(station6Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setUserAnswer(''); setFeedback(null);
    setShowHint(false); setAttempts(0); setRevealSteps(false);
  }, [pIdx]);

  const handleCheck = () => {
    const correct = parseInt(userAnswer) === p.answer;
    setAttempts(a => a + 1);
    if (correct) {
      setFeedback('correct');
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    } else {
      setFeedback('wrong');
      if (attempts >= 1) { setShowHint(true); setRevealSteps(true); }
    }
  };

  const handleNext = () => {
    if (pIdx < PROBLEMS.length - 1) setPIdx(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'wordproblem' });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-purple-900/30 border border-purple-500/40 rounded-2xl px-3 py-2">
          <span className="text-2xl">👧</span>
          <div>
            <p className="text-xs font-extrabold text-amber-300">EMMA</p>
            <p className="text-xs font-bold text-white/70">Measurement Island</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-900/30 border border-purple-500/40 rounded-pill px-3 py-2">
          <span className="text-xl">💎</span>
          <span className="text-base font-black text-purple-300">{tokens}/{PROBLEMS.length}</span>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-purple-500/15 border border-purple-400/40 rounded-2xl px-4 py-2">
        <p className="text-xs font-extrabold text-white/60 uppercase tracking-wider mb-1">Word Problem Strategy</p>
        <div className="flex gap-2 justify-center">
          {['1. Read', '2. Find', '3. Calculate', '4. Check'].map(s => (
            <div key={s} className="bg-white/10 rounded-pill px-2 py-1 text-xs font-extrabold text-white/80">{s}</div>
          ))}
        </div>
      </div>

      {/* Main card */}
      <AnimatePresence mode="wait">
        <motion.div key={pIdx}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-float overflow-hidden"
        >
          {/* Problem header */}
          <div className={`bg-gradient-to-br ${p.bg} px-5 py-5`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{p.emoji}</span>
              <div>
                <p className="text-xs font-extrabold text-white/60 uppercase tracking-wider">Problem {pIdx + 1} of {PROBLEMS.length}</p>
                <p className="text-xl font-black text-white">{p.title}</p>
              </div>
            </div>
            <div className="bg-white/15 rounded-2xl p-3">
              <p className="text-base font-extrabold text-white leading-snug">{p.text}</p>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3">
            {/* Step breakdown (always shown, or revealed on hint) */}
            {(revealSteps || feedback === 'correct') && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-extrabold text-gray-600 mb-2">📊 Step-by-step:</p>
                <div className="space-y-1.5">
                  {p.steps.map((step, i) => (
                    <motion.div key={i}
                      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 ${step.color} rounded-xl p-2.5 ${step.isTotal ? 'border-2 border-gray-400' : ''}`}
                    >
                      <span className="text-gray-700 font-extrabold text-sm flex-1">{step.label}</span>
                      <span className={`font-black text-base ${step.isTotal ? 'text-gray-900' : 'text-gray-700'}`}>{step.calc}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick breakdown button */}
            {!revealSteps && feedback !== 'correct' && (
              <button onClick={() => setRevealSteps(true)}
                className="w-full text-sm font-bold text-purple-500 hover:text-purple-600 py-1 text-center">
                📊 Show step-by-step breakdown
              </button>
            )}

            {/* Answer input */}
            {feedback !== 'correct' && (
              <>
                <p className="text-base font-extrabold text-gray-700">{p.prompt}</p>
                <div className="flex gap-3">
                  <input type="number" value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && userAnswer && handleCheck()}
                    placeholder={`Answer in ${p.unit}`}
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-2xl font-black text-center focus:outline-none focus:border-purple-400" />
                  <button onClick={handleCheck} disabled={!userAnswer}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black text-lg px-6 rounded-2xl transition-all active:scale-95">
                    ✓
                  </button>
                </div>
              </>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {feedback === 'wrong' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
                  <p className="font-extrabold text-red-600">🤔 Not quite! Check the steps above and try again.</p>
                </motion.div>
              )}
              {feedback === 'correct' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-teal-50 border-2 border-teal-400 rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-1">🎉</div>
                  <p className="font-black text-xl text-gray-800">Correct! {p.answer} {p.unit}! 💎</p>
                  <button onClick={handleNext}
                    className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg px-8 py-3 rounded-pill transition-all active:scale-95">
                    {pIdx < PROBLEMS.length - 1 ? 'Next Problem →' : '✅ Complete Station!'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      <CelebrationOverlay show={showCelebration} message="💎 Gem found!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
