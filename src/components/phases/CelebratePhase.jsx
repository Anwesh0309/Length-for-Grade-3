import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';
import { useAudio } from '../../context/AudioContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { celebrationNarration } from '../../utils/narration.js';
import StarRating from '../ui/StarRating.jsx';

const CONFETTI_COLORS = ['#FBBF24', '#2DD4BF', '#FB7185', '#C084FC', '#34D399', '#60A5FA', '#F97316', '#FDE68A'];

function Confetti() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 5 + Math.random() * 10,
    isCircle: Math.random() > 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', rotate: 720, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function CelebratePhase() {
  const { state, dispatch } = usePhase();
  const { audioEnabled } = useAudio();
  const [showContent, setShowContent] = useState(false);

  const stars = state.stars;
  const { correct, total } = state.practiceScore;

  useEffect(() => {
    if (audioEnabled) narrate(celebrationNarration(), true);
    const t = setTimeout(() => setShowContent(true), 800);
    return () => { stopNarration(); clearTimeout(t); };
  }, [audioEnabled]);

  const getMessage = () => {
    if (stars === 3) return { title: 'PERFECT!', subtitle: 'You are a true Length Legend!', emoji: '🏆' };
    if (stars === 2) return { title: 'GREAT JOB!', subtitle: 'Amazing measurement skills!', emoji: '🌟' };
    if (stars === 1) return { title: 'WELL DONE!', subtitle: 'You completed the adventure!', emoji: '🎖️' };
    return { title: 'COMPLETED!', subtitle: 'You finished MeasureQuest!', emoji: '✅' };
  };

  const msg = getMessage();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1A1A2E] via-[#16213E] to-[#0F3460] overflow-hidden relative">
      <Confetti />

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6 text-center max-w-2xl mx-auto w-full">

        {/* Treasure chest */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="text-9xl"
        >
          🎁
        </motion.div>

        {/* Main message */}
        {showContent && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="text-6xl mb-2">{msg.emoji}</div>
              <h1 className="text-5xl font-black text-white mb-2">{msg.title}</h1>
              <p className="text-xl font-extrabold text-amber-400">{msg.subtitle}</p>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-card shadow-float p-6 text-center"
            >
              <div className="text-5xl mb-2">📐</div>
              <p className="font-black text-2xl text-white">Length Legend</p>
              <p className="font-bold text-amber-100 text-sm mt-1">Badge Unlocked!</p>
            </motion.div>

            {/* Stars */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-card p-5 w-full"
            >
              <p className="text-white/60 text-sm font-extrabold uppercase tracking-wider mb-3">Your Score</p>
              <StarRating stars={stars} size="lg" />
              <p className="text-white font-extrabold text-xl mt-3">
                {correct} / {total} correct
              </p>
              <div className="mt-2 w-full bg-white/20 rounded-pill h-3">
                <div
                  className="h-full bg-amber-400 rounded-pill transition-all"
                  style={{ width: `${total > 0 ? (correct / total) * 100 : 0}%` }}
                />
              </div>
              <p className="text-white/60 text-sm font-bold mt-1">
                {total > 0 ? Math.round((correct / total) * 100) : 0}% accuracy
              </p>
            </motion.div>

            {/* Characters cheer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-4"
            >
              {[
                { emoji: '👧', name: 'Maya', color: 'text-amber-300' },
                { emoji: '👦', name: 'Jake', color: 'text-teal-300' },
                { emoji: '👧🏻', name: 'Sofia', color: 'text-purple-300' },
              ].map((c, i) => (
                <div key={c.name} className="flex flex-col items-center gap-1"
                  style={{ animation: `float ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
                  <div className="text-5xl">{c.emoji}</div>
                  <span className={`text-xs font-extrabold ${c.color}`}>{c.name}</span>
                </div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 w-full justify-center"
            >
              <button
                onClick={() => dispatch({ type: 'RESTART' })}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 border-2 border-white/30 hover:border-white/60 text-white font-extrabold text-base rounded-pill transition-all"
              >
                🔄 Play Again
              </button>
              <button
                className="flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-base rounded-pill shadow-glow transition-all"
                onClick={() => window.open('https://intelliasg.com/courses/grade-3-math', '_blank')}
              >
                📚 Next Lesson →
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
