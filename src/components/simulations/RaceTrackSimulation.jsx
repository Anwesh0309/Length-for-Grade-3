import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station5Narration } from '../../utils/narration.js';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const ROUNDS = [
  {
    athletes: [
      { name: 'Emma',      lengthCm: 145, display: '145 cm',       color: '#F59E0B' },
      { name: 'Charlotte', lengthCm: 152, display: '1 m 52 cm',    color: '#14B8A6' },
      { name: 'Grace',     lengthCm: 138, display: '138 cm',       color: '#A855F7' },
    ],
  },
  {
    athletes: [
      { name: 'Noah',  lengthCm: 200, display: '2 m',        color: '#F43F5E' },
      { name: 'Liam',  lengthCm: 175, display: '175 cm',     color: '#3B82F6' },
      { name: 'James', lengthCm: 190, display: '1 m 90 cm',  color: '#10B981' },
    ],
  },
  {
    athletes: [
      { name: 'Ava',   lengthCm: 88,  display: '88 cm',  color: '#F97316' },
      { name: 'Ethan', lengthCm: 100, display: '1 m',    color: '#6366F1' },
      { name: 'Lily',  lengthCm: 95,  display: '95 cm',  color: '#EC4899' },
    ],
  },
];

const MEDALS = ['🥇', '🥈', '🥉'];

function SortableAthlete({ id, name, display, color, index, checked, correctIndex }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`flex items-center gap-3 p-3 rounded-2xl border-2 bg-white font-extrabold cursor-grab active:cursor-grabbing select-none transition-all ${isDragging ? 'opacity-50 shadow-float scale-105' : 'shadow-card'} ${checked ? 'border-gray-200' : 'border-gray-200 hover:border-gray-400'}`}
    >
      <span className="text-2xl">{MEDALS[index] || '🏃'}</span>
      <div className="flex-1">
        <p className="text-base font-black text-gray-800">{name}</p>
        <p className="text-sm font-bold text-gray-500">{display}</p>
      </div>
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-gray-300 text-lg">⠿</span>
    </div>
  );
}

export default function RaceTrackSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [roundIdx, setRoundIdx] = useState(0);
  const [items, setItems] = useState(() => [...ROUNDS[0].athletes]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const round = ROUNDS[roundIdx];

  useEffect(() => {
    if (audioEnabled) narrate(station5Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setItems([...ROUNDS[roundIdx].athletes]);
    setChecked(false); setIsCorrect(null);
  }, [roundIdx]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || checked) return;
    setItems(prev => {
      const oi = prev.findIndex(a => a.name === active.id);
      const ni = prev.findIndex(a => a.name === over.id);
      return arrayMove(prev, oi, ni);
    });
  };

  const handleCheck = () => {
    const sorted = [...round.athletes].sort((a, b) => a.lengthCm - b.lengthCm);
    const correct = items.every((item, i) => item.name === sorted[i].name);
    setChecked(true); setIsCorrect(correct);
    if (correct) {
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    }
  };

  const handleNext = () => {
    if (roundIdx < ROUNDS.length - 1) setRoundIdx(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'racetrack' });
  };

  const correctOrder = [...round.athletes].sort((a, b) => a.lengthCm - b.lengthCm);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-pink-900/30 border border-pink-500/40 rounded-2xl px-3 py-2">
          <span className="text-2xl">🏃</span>
          <div>
            <p className="text-xs font-extrabold text-pink-300">AISHA & MARCO</p>
            <p className="text-xs font-bold text-white/70">Race Track, Kenya</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-pink-900/30 border border-pink-500/40 rounded-pill px-3 py-2">
          <span className="text-xl">🏅</span>
          <span className="text-base font-black text-pink-300">{tokens}/{ROUNDS.length}</span>
        </div>
      </div>

      {/* Key rule */}
      <div className="bg-pink-500/15 border border-pink-400/40 rounded-2xl px-4 py-3 text-center">
        <p className="text-base font-extrabold text-white">
          ⚖️ Convert to the <span className="text-pink-300 font-black">SAME UNIT</span> before comparing!
        </p>
        <p className="text-xs font-bold text-white/60 mt-0.5">1 m = 100 cm · smaller number = shorter length</p>
      </div>

      {/* Round progress */}
      <div className="flex gap-1.5">
        {ROUNDS.map((_, i) => (
          <div key={i} className={`flex-1 h-2.5 rounded-pill ${i < roundIdx ? 'bg-teal-500' : i === roundIdx ? 'bg-pink-400' : 'bg-white/15'}`} />
        ))}
      </div>

      {/* Main card */}
      <AnimatePresence mode="wait">
        <motion.div key={roundIdx}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-float overflow-hidden"
        >
          {/* Stadium header */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 px-5 py-4 text-center">
            <div className="text-4xl mb-1">🏟️</div>
            <p className="text-xl font-black text-white">Round {roundIdx + 1} of {ROUNDS.length}</p>
            <p className="text-sm font-bold text-pink-100">Drag to order SHORTEST → LONGEST</p>
          </div>

          {/* Cm conversion hint */}
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
            <p className="text-xs font-extrabold text-amber-700 text-center mb-1">💡 All lengths in cm:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {round.athletes.map(a => (
                <div key={a.name} className="text-xs font-bold text-gray-700 bg-white border border-amber-200 rounded-pill px-2 py-0.5">
                  <span style={{ color: a.color }}>●</span> {a.name}: {a.lengthCm} cm
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 space-y-3">
            {!checked ? (
              <>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map(a => a.name)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {items.map((athlete, i) => (
                        <SortableAthlete key={athlete.name} id={athlete.name} {...athlete} index={i} checked={false} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <button onClick={handleCheck}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xl py-4 rounded-pill transition-all active:scale-95">
                  ✓ Check Order!
                </button>
              </>
            ) : (
              <div className="space-y-2">
                {correctOrder.map((athlete, i) => (
                  <div key={athlete.name}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${isCorrect ? 'bg-teal-50 border-teal-300' : 'bg-orange-50 border-orange-200'}`}
                  >
                    <span className="text-2xl">{MEDALS[i]}</span>
                    <div className="flex-1">
                      <p className="font-black text-base text-gray-800">{athlete.name}</p>
                      <p className="text-sm font-bold text-gray-500">{athlete.display} = {athlete.lengthCm} cm</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {checked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 text-center border-2 ${isCorrect ? 'bg-teal-50 border-teal-400' : 'bg-orange-50 border-orange-200'}`}
              >
                <div className="text-3xl mb-1">{isCorrect ? '🎉' : '🤔'}</div>
                <p className="font-black text-xl text-gray-800">{isCorrect ? 'Perfect order! 🏅' : 'Correct order shown above!'}</p>
                <button onClick={handleNext}
                  className="mt-3 bg-pink-500 hover:bg-pink-600 text-white font-black text-lg px-8 py-3 rounded-pill transition-all active:scale-95">
                  {roundIdx < ROUNDS.length - 1 ? 'Next Round →' : '✅ Complete Station!'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <CelebrationOverlay show={showCelebration} message="🏅 Medal earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
