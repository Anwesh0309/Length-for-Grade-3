import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { reflectNarration } from '../utils/narration.js';

const CARDS = [
  {
    icon: '📏', color: '#f5a623',
    title: 'Rulers & mm',
    fact: 'Always start from 0. Count big marks for cm, small marks for mm.',
    formula: '10 mm = 1 cm',
  },
  {
    icon: '📐', color: '#22c55e',
    title: 'Metres & Centimetres',
    fact: 'Use cm for small things. Use m for big things like rooms or roads.',
    formula: '1 m = 100 cm',
  },
  {
    icon: '🤚', color: '#a78bfa',
    title: 'Estimation',
    fact: 'Use your body as a guide to estimate before measuring.',
    formula: 'Finger ≈ 1 cm · Hand ≈ 15 cm',
  },
  {
    icon: '🔄', color: '#3b82f6',
    title: 'Converting Units',
    fact: 'Multiply by 100 to go from metres to centimetres. Divide to go back.',
    formula: 'm × 100 = cm · cm ÷ 100 = m',
  },
  {
    icon: '⚖️', color: '#f43f5e',
    title: 'Comparing Lengths',
    fact: 'Always convert to the same unit before comparing with > < =',
    formula: 'Same unit → then compare!',
  },
  {
    icon: '➕', color: '#ec4899',
    title: 'Word Problems',
    fact: 'Read → Find what you need → Calculate → Check your answer.',
    formula: '4-step strategy every time',
  },
];

export default function Reflect() {
  const navigate = useNavigate();
  const { markDone, totalStars, totalXP } = useGame();
  const { audioEnabled } = useAudio();

  useEffect(() => {
    if (audioEnabled) narrate(reflectNarration(), true);
    markDone('reflect');
    return () => stopNarration();
  }, [audioEnabled]);

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', padding:'72px 16px 40px', maxWidth:'680px', margin:'0 auto' }}>

        {/* Mascot celebration */}
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:'spring', stiffness:200 }}
          style={{ textAlign:'center', marginBottom:'28px' }}>
          <div className="anim-float" style={{ display:'inline-block', marginBottom:'12px' }}>
            <Mascot size={72} mood="excited" />
          </div>
          <h2 style={{ fontSize:'32px', fontWeight:900, color:'white', marginBottom:'4px' }}>What You Learned!</h2>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.5)' }}>
            You mastered 6 big ideas about measurement!
          </p>
        </motion.div>

        {/* XP + Stars summary */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{
            display:'flex', gap:'12px', marginBottom:'28px', width:'100%', justifyContent:'center'
          }}>
          {[
            { icon:'⭐', value:totalStars, label:'Stars Earned' },
            { icon:'⚡', value:totalXP,   label:'XP Gained'   },
          ].map(s => (
            <div key={s.label} style={{
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:'14px', padding:'16px 28px', textAlign:'center', flex:1, maxWidth:'200px'
            }}>
              <div style={{ fontSize:'32px', marginBottom:'4px' }}>{s.icon}</div>
              <p style={{ fontSize:'28px', fontWeight:900, color:'#f5a623' }}>{s.value}</p>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Summary cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', width:'100%', marginBottom:'28px' }}>
          {CARDS.map((card, i) => (
            <motion.div key={card.title}
              initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: 0.3 + i * 0.08, type:'spring', stiffness:200 }}
              style={{
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:'14px', padding:'16px'
              }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                <span style={{ fontSize:'24px' }}>{card.icon}</span>
                <p style={{ fontSize:'14px', fontWeight:900, color: card.color }}>{card.title}</p>
              </div>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', lineHeight:1.5, marginBottom:'8px' }}>
                {card.fact}
              </p>
              <div style={{
                background:`${card.color}18`, border:`1px solid ${card.color}40`,
                borderRadius:'8px', padding:'6px 10px'
              }}>
                <p style={{ fontSize:'11px', fontWeight:800, color: card.color }}>{card.formula}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge */}
        <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:0.8, type:'spring' }}
          style={{
            background:'linear-gradient(135deg, rgba(245,166,35,0.25), rgba(245,166,35,0.05))',
            border:'2px solid rgba(245,166,35,0.5)', borderRadius:'20px',
            padding:'24px 32px', textAlign:'center', marginBottom:'24px', width:'100%'
          }}>
          <div style={{ fontSize:'48px', marginBottom:'8px' }}>🏅</div>
          <p style={{ fontSize:'22px', fontWeight:900, color:'#f5a623', marginBottom:'4px' }}>
            Length Legend!
          </p>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>
            Badge unlocked · MeasureQuest Grade 3
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center' }}>
          <button className="btn-ghost" onClick={() => navigate('/')}>🏠 Back to Home</button>
          <button className="btn-yellow" style={{ fontSize:'16px', padding:'14px 32px' }}
            onClick={() => navigate('/wonder')}>
            🔄 Play Again!
          </button>
        </div>
      </div>
    </div>
  );
}
