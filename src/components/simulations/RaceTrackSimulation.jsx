import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePhase } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { station5Narration } from '../../utils/narration.js';
import CharacterBubble from '../ui/CharacterBubble.jsx';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

const ROUNDS = [
  {
    athletes: [
      { name: 'Emma', lengthCm: 145, display: '145 cm' },
      { name: 'Oliver', lengthCm: 152, display: '1 m 52 cm' },
      { name: 'Grace', lengthCm: 138, display: '138 cm' },
    ],
  },
  {
    athletes: [
      { name: 'Noah', lengthCm: 200, display: '2 m' },
      { name: 'Liam', lengthCm: 175, display: '175 cm' },
      { name: 'Charlotte', lengthCm: 1 * 100 + 90, display: '1 m 90 cm' },
    ],
  },
  {
    athletes: [
      { name: 'Ava', lengthCm: 88, display: '88 cm' },
      { name: 'Ethan', lengthCm: 100, display: '1 m' },
      { name: 'James', lengthCm: 95, display: '95 cm' },
    ],
  },
];

function SortableItem({ id, name, display, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const colors = ['bg-coral-400', 'bg-teal-500', 'bg-purple-500'];
  const emojis = ['🥇', '🥈', '🥉'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 p-3 rounded-bubble border-2 border-white bg-white shadow-card cursor-grab active:cursor-grabbing select-none ${isDragging ? 'opacity-50 shadow-float' : ''}`}
    >
      <span className="text-2xl">{emojis[index] || '🏃'}</span>
      <div className="flex-1">
        <p className="font-extrabold text-base text-inkDark">{name}</p>
        <p className="font-bold text-sm text-inkMid">{display}</p>
      </div>
      <span className="text-inkLight text-xl">⠿</span>
    </div>
  );
}

export default function RaceTrackSimulation() {
  const { dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [roundIndex, setRoundIndex] = useState(0);
  const [items, setItems] = useState(() => [...ROUNDS[0].athletes]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const round = ROUNDS[roundIndex];

  useEffect(() => {
    if (audioEnabled) narrate(station5Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    setItems([...ROUNDS[roundIndex].athletes]);
    setChecked(false);
    setCorrect(null);
  }, [roundIndex]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || checked) return;
    setItems(prev => {
      const oldIndex = prev.findIndex(i => i.name === active.id);
      const newIndex = prev.findIndex(i => i.name === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleCheck = () => {
    const sorted = [...round.athletes].sort((a, b) => a.lengthCm - b.lengthCm);
    const isCorrect = items.every((item, i) => item.name === sorted[i].name);
    setChecked(true);
    setCorrect(isCorrect);
    if (isCorrect) {
      dispatch({ type: 'EARN_TOKEN', amount: 1 });
      setTokens(t => t + 1);
      setShowCelebration(true);
    }
  };

  const handleNext = () => {
    if (roundIndex < ROUNDS.length - 1) setRoundIndex(i => i + 1);
    else dispatch({ type: 'COMPLETE_STATION', station: 'racetrack' });
  };

  const correctOrder = [...round.athletes].sort((a, b) => a.lengthCm - b.lengthCm);

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4 max-w-2xl mx-auto w-full">

      <div className="flex items-center gap-2 self-end bg-pink-50 border border-pink-200 rounded-pill px-3 py-1">
        <span className="text-lg">🏅</span>
        <span className="text-base font-extrabold text-pink-700">{tokens} / {ROUNDS.length} medals</span>
      </div>

      <CharacterBubble character="sofia" position="left"
        text="Convert to the SAME unit before comparing! Then order from shortest to longest! ⚖️" />

      <motion.div
        key={roundIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-white rounded-card shadow-card p-5 border-2 border-pink-100"
      >
        {/* Stadium header */}
        <div className="bg-gradient-to-r from-pink-50 to-coral-50 rounded-xl p-3 text-center mb-4">
          <div className="text-4xl mb-1">🏟️</div>
          <p className="text-xl font-extrabold text-inkDark">Drag to order: SHORTEST → LONGEST</p>
          <p className="text-sm font-bold text-inkMid">Round {roundIndex + 1} of {ROUNDS.length}</p>
        </div>

        {/* Convert hint */}
        <div className="bg-amber-50 border border-amber-200 rounded-bubble p-2 mb-3 text-center">
          <p className="text-xs font-extrabold text-amber-700">
            💡 Tip: Convert everything to cm first! 1m = 100cm
          </p>
          <div className="flex justify-center gap-2 mt-1 flex-wrap">
            {round.athletes.map(a => (
              <span key={a.name} className="text-xs font-bold bg-white rounded-pill px-2 py-0.5 border border-amber-200">
                {a.name}: {a.display} = {a.lengthCm} cm
              </span>
            ))}
          </div>
        </div>

        {/* Drag list */}
        {!checked ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.name)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 mb-4">
                {items.map((item, index) => (
                  <SortableItem key={item.name} id={item.name} {...item} index={index} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-2 mb-4">
            {correctOrder.map((item, index) => {
              const emojis = ['🥇 1st', '🥈 2nd', '🥉 3rd'];
              return (
                <div key={item.name} className={`flex items-center gap-3 p-3 rounded-bubble border-2 ${correct ? 'bg-teal-50 border-teal-300' : 'bg-orange-50 border-orange-200'}`}>
                  <span className="font-extrabold text-base">{emojis[index]}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-base">{item.name}</p>
                    <p className="text-sm font-bold text-inkMid">{item.display} = {item.lengthCm} cm</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!checked && (
          <button onClick={handleCheck} className="btn-primary w-full">
            ✓ Check Order!
          </button>
        )}

        {checked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-bubble p-4 text-center border-2 ${correct ? 'bg-teal-50 border-teal-300' : 'bg-orange-50 border-orange-200'}`}>
            <div className="text-3xl mb-1">{correct ? '🎉' : '🤔'}</div>
            <p className="font-extrabold text-lg">{correct ? 'Perfect order! 🏅' : 'The correct order is shown above!'}</p>
            <button onClick={handleNext} className="mt-3 btn-primary text-base px-6 py-3">
              {roundIndex < ROUNDS.length - 1 ? 'Next Round →' : '✅ Complete Station!'}
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="w-full bg-pink-50 border border-pink-200 rounded-card p-4">
        <p className="text-sm font-extrabold text-pink-700 mb-2">📌 Key Facts:</p>
        <ul className="space-y-1">
          {['Always convert to the same unit before comparing', 'Smaller number = shorter length', 'Use >, <, = to compare two lengths'].map(f => (
            <li key={f} className="text-sm font-bold text-inkDark flex items-start gap-2">
              <span className="text-pink-500 mt-0.5">✓</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <CelebrationOverlay show={showCelebration} message="🏅 Medal earned!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
