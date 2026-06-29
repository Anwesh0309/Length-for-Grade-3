import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Mascot from '../components/ui/Mascot.jsx';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center px-4 py-10 relative z-10">

      {/* Curriculum badge */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '999px', padding: '6px 18px',
          fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)',
          marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '6px'
        }}>
          ✨ Singapore MOE Curriculum · Grade 3
        </div>
      </motion.div>

      {/* Mascot + speech bubble */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex items-center gap-3 mb-6">
        <div className="anim-float">
          <Mascot size={56} mood="excited" />
        </div>
        <div className="bubble-text">Ready to master measurement? Let's go! 📏</div>
      </motion.div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }} className="text-center mb-2">
        <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.1, color: 'white', marginBottom: '4px' }}>
          MeasureQuest:
        </h1>
        <h2 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.1, color: '#f5a623', marginBottom: '20px' }}>
          Length Adventures
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', fontWeight: 600,
          maxWidth: '440px', lineHeight: 1.6, margin: '0 auto' }}>
          Join Sam the Ruler and discover how centimetres, metres, and millimetres
          unlock the treasure — through stories, simulations, and exciting games!
        </p>
      </motion.div>

      {/* Journey steps card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '20px 28px', marginBottom: '28px',
          width: '100%', maxWidth: '460px',
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '14px',
          textTransform: 'uppercase' }}>
          YOUR LEARNING JOURNEY
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', flexWrap: 'wrap' }}>
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
                padding: '6px 12px', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)'
              }}>
                <span>{s.icon}</span><span>{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, type: 'spring' }}>
        <button className="btn-yellow" style={{ fontSize: '18px', padding: '16px 40px' }}
          onClick={() => navigate('/wonder')}>
          🚀 Begin Your Journey!
        </button>
      </motion.div>

      {/* Feature boxes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '📏', label: 'Rulers & mm',    sub: 'cm, mm, m units' },
          { icon: '✏️', label: '4 Simulations', sub: 'Interactive labs' },
          { icon: '🏆', label: '3 Game Worlds',  sub: 'XP, stars & awards' },
        ].map(f => (
          <div key={f.label} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px', padding: '16px 20px', textAlign: 'center', minWidth: '120px'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{f.icon}</div>
            <p style={{ fontSize: '13px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>{f.label}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{f.sub}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
