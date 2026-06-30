import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Mascot from '../components/ui/Mascot.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { homeNarration } from '../utils/narration.js';

export default function Home() {
  const navigate = useNavigate();
  const { resetGame } = useGame();
  const { audioEnabled } = useAudio();

  // Reset game state when landing on home
  useEffect(() => {
    resetGame();
  }, []);

  // Play home narration — stop any previous audio first
  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(homeNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center px-4 py-10 relative z-10"
      style={{ overflow: 'hidden' }}>

      {/* ── 1. Curriculum badge ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '999px', padding: '6px 18px',
          fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)',
          marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px'
        }}>
          ✨ Grade 3 Mathematics - Length Adventures
        </div>
      </motion.div>

      {/* ── 2. Title ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }} style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.05, color: 'white', marginBottom: '4px' }}>
          MeasureQuest:
        </h1>
        <h2 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.05, color: '#f5a623' }}>
          Length Adventures
        </h2>
      </motion.div>

      {/* ── 3. Mascot + speech bubble  (BETWEEN title and description) ── */}
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        className="flex items-center gap-3"
        style={{ marginBottom: '12px' }}>
        <div className="anim-float">
          <Mascot size={52} mood="excited" />
        </div>
        <div className="bubble-text" style={{ fontSize: '14px' }}>
          Ready to master measurement? Let's go! 📏
        </div>
      </motion.div>

      {/* ── 4. Description ── */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', fontWeight: 600,
          maxWidth: '420px', lineHeight: 1.6, textAlign: 'center', marginBottom: '22px' }}>
        Join Sam the Ruler and discover how centimetres, metres, and millimetres
        unlock the treasure — through stories, simulations, and exciting games!
      </motion.p>

      {/* ── 5. Journey steps card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '16px 24px', marginBottom: '22px',
          width: '100%', maxWidth: '460px',
        }}>
        <p style={{
          fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '12px',
          textTransform: 'uppercase'
        }}>
          YOUR LEARNING JOURNEY
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', flexWrap: 'wrap'
        }}>
          {[
            { icon: '🔮', label: 'Wonder' },
            { icon: '📖', label: 'Story' },
            { icon: '✏️', label: 'Simulate' },
            { icon: '🎮', label: 'Play' },
            { icon: '📝', label: 'Reflect' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(255,255,255,0.07)', borderRadius: '999px',
                padding: '5px 11px', fontSize: '13px', fontWeight: 700,
                color: 'rgba(255,255,255,0.8)'
              }}>
                <span>{s.icon}</span><span>{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* ── 6. CTA ── */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, type: 'spring' }}>
        <button className="btn-yellow" style={{ fontSize: '18px', padding: '15px 38px' }}
          onClick={() => navigate('/wonder')}>
          🚀 Begin Your Journey!
        </button>
      </motion.div>

      {/* ── 7. Feature boxes ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '📏', label: 'Rulers & mm',    sub: 'cm, mm, m units' },
          { icon: '✏️', label: '4 Simulations', sub: 'Interactive labs' },
          { icon: '🏆', label: '10 Game Worlds', sub: 'XP, stars & awards' },
        ].map(f => (
          <div key={f.label} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px', padding: '14px 18px', textAlign: 'center', minWidth: '110px'
          }}>
            <div style={{ fontSize: '26px', marginBottom: '5px' }}>{f.icon}</div>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>{f.label}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{f.sub}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
