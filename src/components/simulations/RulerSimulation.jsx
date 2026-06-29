import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station1Narration } from '../../utils/narration.js';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const OBJECTS = [
  { name: 'Pencil', emoji: '✏️', trueCm: 14, trueMm: 3, barColor: '#FBBF24' },
  { name: 'Eraser', emoji: '🧹', trueCm: 5,  trueMm: 5, barColor: '#FB7185' },
  { name: 'Crayon', emoji: '🖍️', trueCm: 9,  trueMm: 0, barColor: '#34D399' },
];

function makeChoices(cm, mm) {
  const correct = `${cm} cm ${mm} mm`;
  const opts = new Set([correct,
    `${cm + 1} cm ${mm} mm`,
    `${cm} cm ${(mm + 3) % 10} mm`,
    `${cm - 1 < 1 ? cm + 2 : cm - 1} cm ${mm} mm`,
    `${cm} cm ${mm === 0 ? 4 : 0} mm`,
  ]);
  return [...opts].slice(0, 4).sort(() => Math.random() - 0.5);
}

/* ── SVG Ruler ── */
function RulerSVG({ trueCm, trueMm, barColor }) {
  const totalMm = trueCm * 10 + trueMm;
  const displayCm = trueCm + 3;      // ruler shows a bit beyond object
  const W = 300; const MARKS = displayCm * 10;
  const pxPerMm = (W - 20) / MARKS;

  return (
    <svg width={W} height={72} viewBox={`0 0 ${W} 72`} className="mx-auto block">
      {/* Ruler body */}
      <rect x="10" y="28" width={W - 20} height="34" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      {/* Zero label */}
      <text x="12" y="25" fontSize="9" fill="#374151" fontWeight="bold">0</text>

      {/* Tick marks and labels */}
      {Array.from({ length: MARKS + 1 }, (_, mm) => {
        const x = 10 + mm * pxPerMm;
        const isCm = mm % 10 === 0;
        const isFive = mm % 5 === 0;
        const h = isCm ? 22 : isFive ? 15 : 7;
        return (
          <g key={mm}>
            <line x1={x} y1={62} x2={x} y2={62 - h} stroke="#374151"
              strokeWidth={isCm ? 1.5 : isFive ? 1 : 0.7} />
            {isCm && mm > 0 && (
              <text x={x} y={24} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="bold">
                {mm / 10}
              </text>
            )}
          </g>
        );
      })}

      {/* Object bar */}
      <rect x="10" y="14" width={totalMm * pxPerMm} height="10" fill={barColor} rx="3" opacity="0.9" />
      {/* Arrow at end */}
      <polygon points={`
        ${10 + totalMm * pxPerMm},10
        ${10 + totalMm * pxPerMm - 5},2
        ${10 + totalMm * pxPerMm + 5},2
      `} fill="#EF4444" />

      {/* "cm" label */}
      <text x={W - 12} y={68} fontSize="9" fill="#9CA3AF" fontWeight="bold" textAnchor="end">cm</text>
    </svg>
  );
}

export default function RulerSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [objIdx, setObjIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const obj = OBJECTS[objIdx];
  const correctAnswer = `${obj.trueCm} cm ${obj.trueMm} mm`;

  useEffect(() => {
    if (audioEnabled) narrate(station1Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setChoices(makeChoices(obj.trueCm, obj.trueMm));
    setSelected(null);
    setIsCorrect(null);
  }, [objIdx]);

  const handleAnswer = (choice) => {
    if (selected) return;
    const correct = choice === correctAnswer;
    setSelected(choice);
    setIsCorrect(correct);
    if (correct) {
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    }
  };

  const handleNext = () => {
    if (objIdx < OBJECTS.length - 1) setObjIdx(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'ruler' });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

      {/* Sam character + token counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-500/40 rounded-2xl px-3 py-2">
          <span className="text-2xl">🧑‍🔨</span>
          <div>
            <p className="text-xs font-extrabold text-amber-300">SAM</p>
            <p className="text-xs font-bold text-white/70">The Carpenter</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-900/30 border border-amber-500/40 rounded-pill px-3 py-2">
          <span className="text-xl">🪵</span>
          <span className="text-base font-black text-amber-300">{tokens}/{OBJECTS.length}</span>
          <span className="text-xs font-bold text-white/50">chips</span>
        </div>
      </div>

      {/* Tip banner */}
      <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl px-4 py-2">
        <p className="text-sm font-extrabold text-amber-200 text-center">
          📏 Always start from <span className="text-amber-400 font-black text-base">ZERO</span>! &nbsp;·&nbsp;
          <span className="text-amber-400 font-black">10 mm</span> = <span className="text-amber-400 font-black">1 cm</span>
        </p>
      </div>

      {/* Main card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={objIdx}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-float overflow-hidden border-2 border-amber-200"
        >
          {/* Object header */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-amber-100">
            <span className="text-5xl">{obj.emoji}</span>
            <div>
              <p className="text-2xl font-black text-gray-800">{obj.name}</p>
              <p className="text-sm font-bold text-gray-500">Object {objIdx + 1} of {OBJECTS.length} — where does it end?</p>
            </div>
          </div>

          {/* Ruler */}
          <div className="px-5 py-4 bg-amber-50">
            <p className="text-sm font-extrabold text-gray-600 text-center mb-3">
              📍 The <span style={{ color: obj.barColor, fontWeight: 900 }}>coloured bar</span> shows the object
            </p>
            <RulerSVG trueCm={obj.trueCm} trueMm={obj.trueMm} barColor={obj.barColor} />
          </div>

          {/* Choices */}
          <div className="px-5 py-4">
            {!selected ? (
              <>
                <p className="text-lg font-extrabold text-gray-700 mb-3 text-center">What is the measurement?</p>
                <div className="grid grid-cols-2 gap-3">
                  {choices.map(choice => (
                    <button key={choice} onClick={() => handleAnswer(choice)}
                      className="py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 hover:border-amber-400 hover:bg-amber-50 font-extrabold text-lg text-gray-800 transition-all active:scale-95">
                      {choice}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl p-4 text-center border-2 ${isCorrect ? 'bg-teal-50 border-teal-400' : 'bg-red-50 border-red-300'}`}
                >
                  <div className="text-4xl mb-2">{isCorrect ? '🎉' : '🤔'}</div>
                  <p className="font-black text-xl text-gray-800 mb-1">
                    {isCorrect ? 'Brilliant! Correct!' : `Answer: ${correctAnswer}`}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm font-bold text-gray-600 mb-3">
                      💡 Count big marks = cm, small marks = mm
                    </p>
                  )}
                  <button onClick={handleNext}
                    className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg px-8 py-3 rounded-pill shadow-glow transition-all active:scale-95">
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
        <p className="text-xs font-extrabold text-white/60 uppercase tracking-wider mb-2">📌 Key Facts</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '0️⃣', fact: 'Start from ZERO' },
            { icon: '📏', fact: '10mm = 1cm' },
            { icon: '👁️', fact: 'Read at the END' },
          ].map(f => (
            <div key={f.fact} className="bg-white/5 rounded-xl p-2 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs font-extrabold text-white/80">{f.fact}</p>
            </div>
          ))}
        </div>
      </div>

      <CelebrationOverlay show={showCelebration} message="🪵 Wood chip earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
