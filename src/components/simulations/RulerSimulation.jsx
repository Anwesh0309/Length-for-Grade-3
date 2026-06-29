import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station1Narration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const OBJECTS = [
  { name: 'Pencil', emoji: '✏️', trueCm: 14, trueMm: 3, color: '#FFD700' },
  { name: 'Eraser', emoji: '🧹', trueCm: 5, trueMm: 5, color: '#FF8C94' },
  { name: 'Crayon', emoji: '🖍️', trueCm: 9, trueMm: 0, color: '#90EE90' },
];

const CHOICES = (cm, mm) => {
  const correct = `${cm} cm ${mm} mm`;
  const opts = [
    correct,
    `${cm + 1} cm ${mm} mm`,
    `${cm} cm ${(mm + 3) % 10} mm`,
    `${cm - 1 < 1 ? cm + 2 : cm - 1} cm ${mm} mm`,
  ];
  return opts.sort(() => Math.random() - 0.5);
};

export default function RulerSimulation() {
  const { dispatch, state } = usePhase();
  const { audioEnabled } = useAudio();
  const [objIndex, setObjIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [step, setStep] = useState('quiz'); // quiz | feedback

  const obj = OBJECTS[objIndex];

  useEffect(() => {
    if (audioEnabled) narrate(station1Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setChoices(CHOICES(obj.trueCm, obj.trueMm));
    setSelected(null);
    setCorrect(null);
    setStep('quiz');
  }, [objIndex]);

  const handleAnswer = (choice) => {
    if (selected) return;
    setSelected(choice);
    const isCorrect = choice === `${obj.trueCm} cm ${obj.trueMm} mm`;
    setCorrect(isCorrect);
    if (isCorrect) {
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    }
    setStep('feedback');
  };

  const handleNext = () => {
    if (objIndex < OBJECTS.length - 1) {
      setObjIndex(i => i + 1);
    } else {
      dispatch({ type: 'COMPLETE_STATION', station: 'ruler' });
    }
  };

  // SVG Ruler component
  const RULER_W = 280;
  const totalMm = obj.trueCm * 10 + obj.trueMm;
  const mmPerPx = RULER_W / (obj.trueCm * 10 + 20);

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">

      {/* Tokens */}
      <div className="flex items-center gap-2 self-end bg-amber-50 border border-amber-200 rounded-pill px-3 py-1">
        <span className="text-lg">🪵</span>
        <span className="text-base font-extrabold text-amber-700">{tokens} / {OBJECTS.length} tokens</span>
      </div>

      {/* Character hint */}
      <CharacterBubble character="sofia" position="left" text="Measure carefully! Remember — always start from ZERO on the ruler! 📏" />

      {/* Object card */}
      <motion.div
        key={objIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-white rounded-card shadow-card p-5 border-2 border-amber-100"
      >
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">{obj.emoji}</div>
          <p className="text-xl font-extrabold text-inkDark">{obj.name}</p>
          <p className="text-base font-bold text-inkMid">Object {objIndex + 1} of {OBJECTS.length}</p>
        </div>

        {/* SVG Ruler */}
        <div className="bg-amber-50 rounded-xl p-4 mb-4 overflow-x-auto">
          <p className="text-sm font-extrabold text-inkMid mb-2 text-center">📏 Read the ruler below:</p>
          <svg width={RULER_W + 30} height={80} viewBox={`0 0 ${RULER_W + 30} 80`} className="mx-auto block">
            {/* Ruler body */}
            <rect x="10" y="30" width={RULER_W} height="30" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" rx="4" />

            {/* Marks */}
            {Array.from({ length: obj.trueCm * 10 + 21 }, (_, mm) => {
              const x = 10 + mm * mmPerPx;
              const isCm = mm % 10 === 0;
              const isFiveMm = mm % 5 === 0;
              const h = isCm ? 20 : isFiveMm ? 14 : 8;
              return (
                <g key={mm}>
                  <line x1={x} y1={60} x2={x} y2={60 - h} stroke="#374151" strokeWidth={isCm ? 1.5 : 0.8} />
                  {isCm && (
                    <text x={x} y={27} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="bold">
                      {mm / 10}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Object marker */}
            <rect
              x="10"
              y="20"
              width={totalMm * mmPerPx}
              height="8"
              fill={obj.color}
              stroke="#374151"
              strokeWidth="1.5"
              rx="2"
              opacity="0.8"
            />

            {/* Pointer arrow at end */}
            <polygon
              points={`${10 + totalMm * mmPerPx},14 ${10 + totalMm * mmPerPx - 5},4 ${10 + totalMm * mmPerPx + 5},4`}
              fill="#EF4444"
            />
          </svg>
          <p className="text-xs font-bold text-center text-inkMid mt-1">
            The <span style={{ color: obj.color, fontWeight: 900 }}>coloured bar</span> shows the object. Where does it end?
          </p>
        </div>

        {/* Answer choices */}
        {step === 'quiz' && (
          <div className="grid grid-cols-2 gap-3">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                className="py-3 px-4 rounded-bubble border-2 border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50 font-extrabold text-base text-inkDark transition-all active:scale-95"
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        {step === 'feedback' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-bubble p-4 text-center border-2 ${correct ? 'bg-teal-50 border-teal-300' : 'bg-red-50 border-red-200'}`}
            >
              <div className="text-3xl mb-1">{correct ? '🎉' : '🤔'}</div>
              <p className="font-extrabold text-lg text-inkDark">
                {correct ? 'Brilliant! Correct!' : `The answer was: ${obj.trueCm} cm ${obj.trueMm} mm`}
              </p>
              {!correct && (
                <p className="text-sm font-bold text-inkMid mt-1">
                  💡 Count carefully: each big mark = 1 cm, each small mark = 1 mm
                </p>
              )}
              <button
                onClick={handleNext}
                className="mt-3 btn-primary text-base px-6 py-3"
              >
                {objIndex < OBJECTS.length - 1 ? 'Next Object →' : '✅ Complete Station!'}
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Key facts */}
      <div className="w-full bg-teal-50 border border-teal-200 rounded-card p-4">
        <p className="text-sm font-extrabold text-teal-700 mb-2">📌 Key Facts:</p>
        <ul className="space-y-1">
          {['Always start measuring from ZERO', '10 millimetres (mm) = 1 centimetre (cm)', 'Read where the object ENDS on the ruler'].map(f => (
            <li key={f} className="text-sm font-bold text-inkDark flex items-start gap-2">
              <span className="text-teal-500 mt-0.5">✓</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <CelebrationOverlay show={showCelebration} message="🪵 Wood chip earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
