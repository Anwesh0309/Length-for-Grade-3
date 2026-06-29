import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';

/* ── Static star positions so they don't shift on re-render ── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: (i * 137.508) % 100,
  y: (i * 89.3) % 65,
  size: (i % 3) + 1,
  dur: 2 + (i % 4),
  delay: (i * 0.3) % 3,
}));

export default function LandingPhase() {
  const { dispatch } = usePhase();

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#0D0B1E] via-[#1A1A4E] to-[#0F2D60] overflow-hidden relative select-none">

      {/* ── Night sky ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        {STARS.map(s => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size}
            fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.2;1;0.2"
              dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Moon */}
        <circle cx="88%" cy="12%" r="32" fill="#FEF3C7" opacity="0.9" />
        <circle cx="92%" cy="10%" r="28" fill="#1A1A4E" opacity="0.85" />
        {/* Clouds */}
        <ellipse cx="20%" cy="18%" rx="60" ry="20" fill="white" opacity="0.05" />
        <ellipse cx="70%" cy="22%" rx="80" ry="18" fill="white" opacity="0.04" />
      </svg>

      {/* ── Illustrated landscape ── */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 800 200" preserveAspectRatio="xMidYMax meet" aria-hidden>
        {/* Ocean */}
        <rect x="0" y="140" width="800" height="60" fill="#0E4D8A" opacity="0.6" />
        <ellipse cx="400" cy="140" rx="400" ry="12" fill="#1565C0" opacity="0.4" />
        {/* Island */}
        <ellipse cx="400" cy="158" rx="120" ry="22" fill="#2E7D32" />
        <ellipse cx="400" cy="155" rx="90" ry="18" fill="#388E3C" />
        {/* Island palm trees */}
        <line x1="365" y1="158" x2="360" y2="125" stroke="#5D4037" strokeWidth="4" />
        <ellipse cx="355" cy="122" rx="18" ry="10" fill="#2E7D32" />
        <line x1="435" y1="158" x2="440" y2="122" stroke="#5D4037" strokeWidth="4" />
        <ellipse cx="445" cy="119" rx="18" ry="10" fill="#388E3C" />
        {/* Treasure chest glow on island */}
        <rect x="388" y="148" width="24" height="18" rx="3" fill="#F59E0B" opacity="0.9" />
        <rect x="388" y="148" width="24" height="8" rx="2" fill="#D97706" opacity="0.9" />
        <circle cx="400" cy="152" r="3" fill="#FCD34D" />
        {/* Waves */}
        {[0, 1, 2].map(i => (
          <path key={i} d={`M${50 + i * 240},148 Q${120 + i * 240},142 ${190 + i * 240},148`}
            stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />
        ))}
        {/* Foreground hills */}
        <ellipse cx="0" cy="185" rx="180" ry="50" fill="#1B5E20" opacity="0.8" />
        <ellipse cx="800" cy="190" rx="200" ry="55" fill="#1B5E20" opacity="0.7" />
        {/* Lighthouse */}
        <rect x="90" y="130" width="16" height="45" fill="#ECEFF1" />
        <polygon points="90,130 98,112 106,130" fill="#EF5350" />
        <circle cx="98" cy="130" r="5" fill="#FFF176" />
        <rect x="88" y="172" width="20" height="8" fill="#B0BEC5" />
      </svg>

      {/* ── Curriculum badge ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex justify-center pt-4"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-pill px-5 py-2 text-white text-sm font-extrabold tracking-wide">
          ✨ Singapore MOE Curriculum · Grade 3 Math
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 gap-4 pb-36">

        {/* Floating map icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 15 }}
          className="text-7xl md:text-8xl"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          🗺️
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight drop-shadow-lg">
            MeasureQuest
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1 tracking-wide">
            Length Adventures 📏
          </h2>
          <p className="text-base md:text-lg text-white/75 font-bold mt-3 max-w-sm mx-auto leading-snug">
            Join <span className="text-amber-300 font-black">Emma</span>,{' '}
            <span className="text-teal-300 font-black">Oliver</span> &{' '}
            <span className="text-purple-300 font-black">Lily</span> on an epic measurement adventure!
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { icon: '📏', label: 'Ruler & mm Skills' },
            { icon: '🧩', label: '6 Simulations' },
            { icon: '🎮', label: '12 Practice Qs' },
            { icon: '🏆', label: 'Earn 3 Stars' },
          ].map(f => (
            <div key={f.label}
              className="bg-white/10 border border-white/25 rounded-pill px-4 py-1.5 text-white font-extrabold text-sm flex items-center gap-1.5">
              <span>{f.icon}</span><span>{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Journey strip */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 w-full max-w-sm"
        >
          <p className="text-white/50 text-xs font-extrabold uppercase tracking-widest mb-2 text-center">Your Learning Journey</p>
          <div className="flex items-center justify-between">
            {[
              { icon: '🔮', label: 'Wonder' },
              { icon: '📖', label: 'Story' },
              { icon: '🧪', label: 'Simulate' },
              { icon: '🎮', label: 'Play' },
              { icon: '🏆', label: 'Win' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-white/60 text-xs font-bold">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-white/20 text-xs font-bold">—</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(245,158,11,0.6)' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => dispatch({ type: 'SET_PHASE', phase: PHASES.WONDER })}
          className="bg-amber-500 text-white font-black text-xl md:text-2xl px-10 py-4 rounded-pill shadow-glow transition-all flex items-center gap-3 mt-1"
        >
          🚀 Begin Your Journey!
        </motion.button>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </div>
  );
}
