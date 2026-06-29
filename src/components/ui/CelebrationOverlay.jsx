import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONFETTI_COLORS = ['#FBBF24', '#2DD4BF', '#FB7185', '#C084FC', '#34D399', '#60A5FA', '#F97316'];

function ConfettiParticle({ index }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = `${Math.random() * 100}%`;
  const delay = Math.random() * 0.5;
  const duration = 1.5 + Math.random() * 1.5;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{ y: '110vh', rotate: 720, opacity: 0 }}
      transition={{ duration, delay, ease: 'easeIn' }}
      style={{
        position: 'absolute',
        left,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function CelebrationOverlay({ show, message = '🎉 Amazing!', onDone }) {
  const [particles] = useState(() => Array.from({ length: 40 }, (_, i) => i));

  useEffect(() => {
    if (show && onDone) {
      const timer = setTimeout(onDone, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {particles.map(i => <ConfettiParticle key={i} index={i} />)}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-card shadow-float px-8 py-6 text-center pointer-events-auto"
          >
            <div className="text-5xl mb-2">⭐</div>
            <p className="text-3xl font-black text-amber-600">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
