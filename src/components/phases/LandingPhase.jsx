import React from 'react';
import { motion } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';

export default function LandingPhase() {
  const { dispatch } = usePhase();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1A1A2E] via-[#16213E] to-[#0F3460] overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 60 + '%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* Header badge */}
      <div className="relative z-10 flex justify-center pt-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-pill px-4 py-2 text-white text-sm font-bold">
          ✨ Singapore MOE Curriculum · Grade 3
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-8xl animate-float"
        >
          🗺️
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
            MeasureQuest
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 mb-2">
            Length Adventures 📏
          </h2>
          <p className="text-base md:text-lg text-white/80 font-semibold max-w-md mx-auto">
            Join Maya, Jake & Sofia on an epic journey to master the art of measurement!
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: '📏', label: 'cm & mm Rulers' },
            { icon: '🧩', label: '6 Simulations' },
            { icon: '🏆', label: 'Earn Stars' },
          ].map(f => (
            <div key={f.label} className="bg-white/10 border border-white/20 rounded-pill px-4 py-2 text-white font-bold text-sm flex items-center gap-2">
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Journey steps */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-card p-4 w-full max-w-lg"
        >
          <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Your Learning Journey</p>
          <div className="flex items-center justify-between gap-1 text-center">
            {[
              { icon: '🔮', label: 'Wonder' },
              { icon: '📖', label: 'Story' },
              { icon: '🧪', label: 'Simulate' },
              { icon: '🎮', label: 'Play' },
              { icon: '📝', label: 'Reflect' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-white/70 text-xs font-bold">{step.label}</span>
                </div>
                {i < arr.length - 1 && <div className="text-white/30 text-xs">→</div>}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.WONDER })}
          className="bg-amber-500 hover:bg-amber-400 text-white font-black text-xl md:text-2xl px-10 py-5 rounded-pill shadow-glow transition-all duration-200 flex items-center gap-3"
        >
          🚀 Begin Your Journey!
        </motion.button>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
