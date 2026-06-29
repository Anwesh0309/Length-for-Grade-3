import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { practiceCorrectNarration, practiceIncorrectNarration } from '../../utils/narration.js';
import { questionBank } from '../../utils/questionBank.js';
import { generatePracticeSession } from '../../utils/randomizer.js';
import StarRating from '../ui/StarRating.jsx';
import CelebrationOverlay from '../ui/CelebrationOverlay.jsx';

// ── Question type components ───────────────────────────────────────────

function MCQQuestion({ question, onAnswer, answered, correct }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.choices.map(choice => (
        <button
          key={choice}
          onClick={() => !answered && onAnswer(choice)}
          disabled={answered}
          className={`py-4 px-4 rounded-bubble border-2 font-extrabold text-base transition-all active:scale-95
            ${answered && choice === String(question.answer) ? 'bg-teal-50 border-teal-400 text-teal-800' : ''}
            ${answered && choice !== String(question.answer) ? 'bg-gray-50 border-gray-200 text-gray-400' : ''}
            ${!answered ? 'bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50 text-inkDark' : ''}
          `}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}

function TextInputQuestion({ question, onAnswer, answered }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-3">
      <input
        type="number"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !answered && value && onAnswer(value)}
        disabled={answered}
        placeholder="Your answer"
        className="flex-1 border-2 border-gray-200 rounded-bubble px-4 py-3 text-xl font-extrabold text-center focus:outline-none focus:border-amber-400"
      />
      {!answered && (
        <button onClick={() => value && onAnswer(value)} className="btn-primary text-base px-6 py-3">
          Check ✓
        </button>
      )}
    </div>
  );
}

function SortableChip({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 p-3 rounded-bubble border-2 border-gray-200 bg-white shadow-sm cursor-grab active:cursor-grabbing font-extrabold text-base text-inkDark select-none ${isDragging ? 'opacity-50 shadow-float' : ''}`}
    >
      <span className="text-inkLight">⠿</span>
      <span>{label}</span>
    </div>
  );
}

function ComparisonQuestion({ question, onAnswer, answered }) {
  const [items, setItems] = useState(() => [...question.visual.props.items]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || answered) return;
    setItems(prev => {
      const oi = prev.findIndex(i => i.name === active.id);
      const ni = prev.findIndex(i => i.name === over.id);
      return arrayMove(prev, oi, ni);
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-extrabold text-inkMid text-center">Drag to order (shortest → longest):</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.name)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map(item => (
              <SortableChip key={item.name} id={item.name} label={`${item.name}: ${item.lengthCm} cm`} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {!answered && (
        <button onClick={() => onAnswer(items.map(i => i.name).join(','))} className="btn-primary w-full mt-2">
          ✓ Submit Order
        </button>
      )}
    </div>
  );
}

function EstimationQInput({ question, onAnswer, answered }) {
  const [value, setValue] = useState(25);
  return (
    <div className="space-y-3">
      <p className="text-center text-2xl font-black text-amber-600">{value} cm</p>
      <input
        type="range"
        min={question.visual.props.min || 1}
        max={question.visual.props.max || 100}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        disabled={answered}
        className="w-full h-4 rounded-pill accent-amber-500"
      />
      {!answered && (
        <button onClick={() => onAnswer(value)} className="btn-primary w-full">
          🎯 That's my estimate!
        </button>
      )}
    </div>
  );
}

// ── Main Practice Phase ────────────────────────────────────────────────

export default function PracticePhase() {
  const { state, dispatch } = usePhase();
  const { audioEnabled } = useAudio();

  const questions = useMemo(() => generatePracticeSession(questionBank), []);
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const q = questions[qIndex];
  const progress = ((qIndex + (answered ? 1 : 0)) / questions.length) * 100;

  const checkAnswer = (userAnswer) => {
    if (answered) return;

    let correct = false;
    const ua = String(userAnswer).trim().toLowerCase();
    const ca = String(q.answer).trim().toLowerCase();

    if (q.type === 'estimation') {
      const pct = Math.abs(Number(userAnswer) - q.answer) / q.answer;
      correct = pct <= 0.15;
    } else if (q.type === 'comparison') {
      const userOrder = ua.split(',').map(s => s.trim());
      const correctOrder = Array.isArray(q.answer) ? q.answer.map(s => s.trim().toLowerCase()) : [ca];
      correct = userOrder.every((v, i) => v === correctOrder[i]?.toLowerCase());
    } else {
      correct = ua === ca;
    }

    setIsCorrect(correct);
    setAnswered(true);
    dispatch({ type: 'RECORD_ANSWER', correct });
    setSessionScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (correct) {
      if (audioEnabled) narrate(practiceCorrectNarration(), false);
      setShowCelebration(true);
    } else {
      if (audioEnabled) narrate(practiceIncorrectNarration(), false);
      setWrongAttempts(w => w + 1);
    }
  };

  const handleNext = () => {
    stopNarration();
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
      setAnswered(false);
      setIsCorrect(null);
      setShowHint(false);
      setWrongAttempts(0);
    } else {
      dispatch({ type: 'FINISH_PRACTICE' });
    }
  };

  const TYPE_ICONS = {
    ruler_reading: '📏',
    unit_selection: '🏷️',
    estimation: '🤚',
    conversion: '🔄',
    comparison: '⚖️',
    word_problem: '➕',
  };

  const TYPE_LABELS = {
    ruler_reading: 'Ruler Reading',
    unit_selection: 'Unit Selection',
    estimation: 'Estimation',
    conversion: 'Conversion',
    comparison: 'Comparison',
    word_problem: 'Word Problem',
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-teal-50 to-cream pt-16">
      <div className="flex-1 flex flex-col items-center px-4 py-4 gap-4 max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-sm font-extrabold text-inkMid">Question {qIndex + 1} / {questions.length}</p>
            <p className="text-xs font-bold text-inkLight">{TYPE_ICONS[q?.type]} {TYPE_LABELS[q?.type]}</p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-pill px-3 py-1">
            <span className="text-base">✅</span>
            <span className="font-extrabold text-teal-700 text-sm">{sessionScore.correct} / {sessionScore.total}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-pill overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-pill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Streak indicator */}
        {state.streakCount >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-pill px-3 py-1"
          >
            <span className="text-lg">🔥</span>
            <span className="font-extrabold text-orange-600 text-sm">{state.streakCount} in a row!</span>
          </motion.div>
        )}

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white rounded-card shadow-card p-5 border-2 border-teal-100"
          >
            {/* Question prompt */}
            <p className="text-xl font-extrabold text-inkDark mb-4 leading-snug">{q?.prompt}</p>

            {/* Visual for ruler_reading */}
            {q?.type === 'ruler_reading' && q?.visual?.props && (
              <div className="bg-amber-50 rounded-xl p-4 mb-4 overflow-x-auto">
                <svg width="300" height="60" viewBox="0 0 300 60" className="mx-auto block">
                  <rect x="10" y="25" width="280" height="25" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" rx="4" />
                  {Array.from({ length: 101 }, (_, mm) => {
                    const x = 10 + mm * 2.8;
                    const isCm = mm % 10 === 0;
                    const isFive = mm % 5 === 0;
                    const h = isCm ? 18 : isFive ? 12 : 6;
                    return (
                      <g key={mm}>
                        <line x1={x} y1={50} x2={x} y2={50 - h} stroke="#374151" strokeWidth={isCm ? 1.5 : 0.8} />
                        {isCm && <text x={x} y="22" textAnchor="middle" fontSize="8" fill="#374151" fontWeight="bold">{mm / 10}</text>}
                      </g>
                    );
                  })}
                  <rect x="10" y="14" width={(q.visual.props.markAt || 50) * 2.8} height="9"
                    fill="#2DD4BF" rx="2" opacity="0.8" />
                  <polygon points={`${10 + (q.visual.props.markAt || 50) * 2.8},10 ${10 + (q.visual.props.markAt || 50) * 2.8 - 4},3 ${10 + (q.visual.props.markAt || 50) * 2.8 + 4},3`} fill="#EF4444" />
                </svg>
              </div>
            )}

            {/* Visual for conversion */}
            {q?.type === 'conversion' && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                <div className="flex items-center justify-center gap-3 text-2xl font-black">
                  <div className="bg-teal-100 text-teal-700 rounded-pill px-4 py-2 text-base">metres (m)</div>
                  <div className="text-sm text-gray-500 flex flex-col">
                    <span>× 100 →</span>
                    <span>← ÷ 100</span>
                  </div>
                  <div className="bg-amber-100 text-amber-700 rounded-pill px-4 py-2 text-base">centimetres (cm)</div>
                </div>
              </div>
            )}

            {/* Visual for estimation */}
            {q?.type === 'estimation' && (
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{q.visual?.props?.emoji || '📏'}</div>
              </div>
            )}

            {/* Answer input based on type */}
            {!answered ? (
              <>
                {q?.choices ? (
                  <MCQQuestion question={q} onAnswer={checkAnswer} answered={answered} correct={isCorrect} />
                ) : q?.type === 'comparison' ? (
                  <ComparisonQuestion question={q} onAnswer={checkAnswer} answered={answered} />
                ) : q?.type === 'estimation' ? (
                  <EstimationQInput question={q} onAnswer={checkAnswer} answered={answered} />
                ) : (
                  <TextInputQuestion question={q} onAnswer={checkAnswer} answered={answered} />
                )}
              </>
            ) : (
              <div className={`rounded-bubble p-4 text-center border-2 ${isCorrect ? 'bg-teal-50 border-teal-300' : 'bg-orange-50 border-orange-200'}`}>
                <div className="text-3xl mb-2">{isCorrect ? '🎉' : '🤔'}</div>
                <p className="font-extrabold text-lg text-inkDark">
                  {isCorrect ? 'Brilliant! Correct!' : `The answer was: ${Array.isArray(q?.answer) ? q.answer.join(' → ') : q?.answer}`}
                </p>
                {!isCorrect && q?.hint && (
                  <p className="text-sm font-bold text-inkMid mt-2">💡 {q.hint}</p>
                )}
                {q?.choices && !isCorrect && (
                  <p className="text-sm font-bold text-inkMid mt-1">
                    Correct answer: <span className="text-teal-600 font-black">{q.answer}</span>
                  </p>
                )}
              </div>
            )}

            {/* Hint button */}
            {!answered && !showHint && wrongAttempts >= 2 && (
              <button onClick={() => setShowHint(true)} className="w-full mt-3 text-sm font-bold text-amber-600 hover:text-amber-700">
                💡 Show hint
              </button>
            )}
            {showHint && !answered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-3 bg-amber-50 border border-amber-200 rounded-bubble p-3 text-center">
                <p className="text-sm font-extrabold text-amber-700">💡 {q?.hint}</p>
              </motion.div>
            )}

            {/* Next button */}
            {answered && (
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleNext}
                className="mt-4 btn-primary w-full"
              >
                {qIndex < questions.length - 1 ? 'Next Question →' : '🏆 See My Results!'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Question type pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {questions.map((qi, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center transition-all
                ${i < qIndex ? 'bg-teal-500 text-white' : i === qIndex ? 'bg-amber-500 text-white scale-125' : 'bg-gray-200 text-gray-400'}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <CelebrationOverlay show={showCelebration} message="⭐ Correct!" onDone={() => setShowCelebration(false)} />
    </div>
  );
}
