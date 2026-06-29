import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station6Narration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const PROBLEMS = [
  {
    text: "The path to the treasure has 3 sections. The first is 45 m long. The second is twice as long. The third is 30 m shorter than the second. How long is the whole path?",
    steps: [
      { label: 'Section 1', value: 45, color: 'bg-amber-200' },
      { label: 'Section 2 (× 2)', value: 90, color: 'bg-teal-200' },
      { label: 'Section 3 (−30)', value: 60, color: 'bg-purple-200' },
    ],
    answer: 195,
    unit: 'm',
    emoji: '🗺️',
  },
  {
    text: "Emma's ribbon is 1 m 20 cm long. She cuts off 35 cm. How much ribbon is left?",
    steps: [
      { label: 'Total ribbon', value: 120, color: 'bg-pink-200' },
      { label: 'Cut off', value: -35, color: 'bg-red-200' },
    ],
    answer: 85,
    unit: 'cm',
    emoji: '🎀',
  },
  {
    text: "Oliver walked 2 m 50 cm. Liam walked 180 cm. Who walked further, and by how much?",
    steps: [
      { label: "Oliver (2m 50cm)", value: 250, color: 'bg-blue-200' },
      { label: "Liam (180cm)", value: 180, color: 'bg-green-200' },
      { label: "Difference", value: 70, color: 'bg-amber-200' },
    ],
    answer: 70,
    unit: 'cm',
    emoji: '🏃',
    extraPrompt: "Oliver walked further by _____ cm",
  },
];

export default function WordProblemSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [problemIndex, setProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const problem = PROBLEMS[problemIndex];

  useEffect(() => {
    if (audioEnabled) narrate(station6Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setAttempts(0);
  }, [problemIndex]);

  const handleCheck = () => {
    const isCorrect = parseInt(userAnswer) === problem.answer;
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
    if (problemIndex < PROBLEMS.length - 1) setProblemIndex(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'wordproblem' });
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">

      <div className="flex items-center gap-2 self-end bg-purple-50 border border-purple-200 rounded-pill px-3 py-1">
        <span className="text-lg">💎</span>
        <span className="text-base font-extrabold text-purple-700">{tokens} / {PROBLEMS.length} gems</span>
      </div>

      <CharacterBubble character="maya" position="left"
        text="For word problems: identify what you need to find first, then calculate step by step! 🧠" />

      <motion.div
        key={problemIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-white rounded-card shadow-card p-5 border-2 border-purple-100"
      >
        {/* Problem header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-4">
          <div className="text-4xl text-center mb-2">{problem.emoji}</div>
          <p className="text-base font-extrabold text-inkDark leading-relaxed text-center">
            {problem.text}
          </p>
          {problem.extraPrompt && (
            <p className="text-sm font-bold text-purple-600 mt-2 text-center">{problem.extraPrompt}</p>
          )}
        </div>

        {/* Visual equation builder */}
        <div className="mb-4">
          <p className="text-sm font-extrabold text-inkMid mb-2">📊 Break it down:</p>
          <div className="space-y-2">
            {problem.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-3 ${step.color} rounded-bubble p-3`}
              >
                <span className="font-extrabold text-inkDark text-sm flex-1">{step.label}</span>
                <span className="font-black text-lg text-inkDark">
                  {step.value < 0 ? `−${Math.abs(step.value)}` : step.value} {problem.unit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Answer input */}
        {feedback !== 'correct' && (
          <div className="space-y-3">
            <p className="text-base font-extrabold text-inkDark">
              {problem.extraPrompt || `What is the answer? (in ${problem.unit})`}
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCheck()}
                placeholder={`Answer in ${problem.unit}`}
                className="flex-1 border-2 border-gray-200 rounded-bubble px-4 py-3 text-xl font-extrabold text-center focus:outline-none focus:border-purple-400"
              />
              <button onClick={handleCheck} className="btn-purple text-base px-5 py-3">
                Check ✓
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback === 'incorrect' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 bg-red-50 border border-red-200 rounded-bubble p-3 text-center">
              <p className="font-extrabold text-red-700">🤔 Not quite! Try again!</p>
            </motion.div>
          )}
          {feedback === 'correct' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 bg-teal-50 border-2 border-teal-300 rounded-bubble p-4 text-center">
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-extrabold text-xl text-teal-700">Correct! {problem.answer} {problem.unit}! 💎</p>
              <button onClick={handleNext} className="mt-3 btn-primary text-base px-6 py-3">
                {problemIndex < PROBLEMS.length - 1 ? 'Next Problem →' : '✅ Complete Station!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {showHint && feedback !== 'correct' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-amber-50 border border-amber-200 rounded-bubble p-3">
            <p className="text-sm font-extrabold text-amber-700">💡 Hint: Add up all the sections: {problem.steps.map(s => Math.abs(s.value)).join(' + ')} = ?</p>
          </motion.div>
        )}
      </motion.div>

      <div className="w-full bg-purple-50 border border-purple-200 rounded-card p-4">
        <p className="text-sm font-extrabold text-purple-700 mb-2">📌 Word Problem Strategy:</p>
        <ul className="space-y-1">
          {['Read the problem carefully', 'Identify what you need to find', 'Write out the calculation', 'Check your answer makes sense'].map((f, i) => (
            <li key={f} className="text-sm font-bold text-inkDark flex items-start gap-2">
              <span className="text-purple-500 font-black">Step {i + 1}:</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <CelebrationOverlay show={showCelebration} message="💎 Gem found!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
