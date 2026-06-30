import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { reflectNarration } from '../utils/narration.js';

const CONCEPT_CARDS = [
  { icon:'📏', color:'#f5a623', title:'Rulers',     formula:'10 mm = 1 cm',            fact:'Start from 0. Count big marks = cm, small = mm.' },
  { icon:'📐', color:'#22c55e', title:'Metres',     formula:'1 m = 100 cm',             fact:'Use m for long objects like rooms or roads.' },
  { icon:'🤚', color:'#a78bfa', title:'Estimation', formula:'Finger ≈ 1 cm',            fact:'Use body benchmarks to estimate before measuring.' },
  { icon:'🔄', color:'#3b82f6', title:'Conversion', formula:'m × 100 = cm',             fact:'Multiply by 100 for m→cm. Divide for cm→m.' },
  { icon:'⚖️', color:'#f43f5e', title:'Comparing',  formula:'Same unit → compare',      fact:'Always convert to same unit before using > < =.' },
  { icon:'➕', color:'#ec4899', title:'Word Probs',  formula:'Read → Find → Calculate', fact:'Identify what to find first, then solve step by step.' },
];

function getRank(pct) {
  if (pct >= 90) return { rank:'🥇 Length Legend!',    color:'#f5a623', bg:'rgba(245,166,35,0.15)' };
  if (pct >= 75) return { rank:'🥈 Measurement Master', color:'#9ca3af', bg:'rgba(156,163,175,0.12)' };
  if (pct >= 60) return { rank:'🥉 Unit Explorer',      color:'#cd7c32', bg:'rgba(205,124,50,0.12)' };
  return             { rank:'📏 Keep Measuring!',       color:'#a78bfa', bg:'rgba(167,139,250,0.12)' };
}

export default function Reflect() {
  const navigate = useNavigate();
  const { markDone, worldScores, playCorrect, playTotal, totalStars, totalXP, resetGame } = useGame();
  const { audioEnabled } = useAudio();

  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(reflectNarration(), true);
    markDone('reflect');
    return () => stopNarration();
  }, [audioEnabled]);

  const pct  = playTotal > 0 ? Math.round((playCorrect / playTotal) * 100) : 0;
  const rank = getRank(pct);

  const handlePlayAgain = () => {
    stopNarration();
    resetGame();
    navigate('/');
  };

  return (
    <div className="page-bg relative z-10" style={{ height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <TopNav />

      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        maxWidth:'700px', margin:'0 auto', width:'100%',
        padding:'64px 16px 16px', overflow:'hidden',
        gap:'12px',
      }}>

        {/* ── Header row ── */}
        <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
          style={{ display:'flex', alignItems:'center', gap:'14px', flexShrink:0 }}>
          <div className="anim-float"><Mascot size={52} mood="excited" /></div>
          <div>
            <h2 style={{ fontSize:'26px', fontWeight:900, color:'white', margin:0 }}>Module Complete!</h2>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', margin:0 }}>MeasureQuest · Length Adventures</p>
          </div>
        </motion.div>

        {/* ── Scoreboard ── */}
        <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{delay:0.1}}
          style={{ background: rank.bg, border:`1px solid ${rank.color}40`, borderRadius:'16px', padding:'14px 18px', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px', flexWrap:'wrap', gap:'8px' }}>
            <p style={{ fontSize:'18px', fontWeight:900, color:rank.color, margin:0 }}>{rank.rank}</p>
            <div style={{ display:'flex', gap:'14px' }}>
              {[
                { icon:'✅', val:`${playCorrect}/${playTotal}`, label:'Correct' },
                { icon:'🎯', val:`${pct}%`,      label:'Score'   },
                { icon:'⭐', val:totalStars,     label:'Stars'   },
                { icon:'⚡', val:totalXP,        label:'XP'      },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'16px', fontWeight:900, color:'white', margin:0 }}>{s.val} {s.icon}</p>
                  <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)', fontWeight:700, margin:0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Overall progress bar */}
          <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'999px', height:'8px', overflow:'hidden' }}>
            <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.4,ease:'easeOut'}}
              style={{ height:'8px', background:rank.color, borderRadius:'999px' }} />
          </div>
        </motion.div>

        {/* ── Per-world scoreboard ── */}
        {worldScores.length > 0 && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:'14px', padding:'12px 14px', flexShrink:0 }}>
            <p style={{ fontSize:'12px', fontWeight:800, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>World Scores</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:'6px' }}>
              {worldScores.map(ws => {
                const wp = Math.round((ws.correct/ws.total)*100);
                return (
                  <div key={ws.worldId} style={{ background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'7px 10px' }}>
                    <p style={{ fontSize:'11px', fontWeight:800, color:'rgba(255,255,255,0.6)', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {ws.worldName}
                    </p>
                    <p style={{ fontSize:'15px', fontWeight:900, color: wp>=80?'#22c55e':wp>=60?'#f5a623':'#ef4444', margin:0 }}>
                      {ws.correct}/{ws.total} · {wp}%
                    </p>
                    <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', margin:0 }}>⭐ {ws.stars}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Concept cards (2 columns, compact) ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', flex:1, overflow:'hidden' }}>
          {CONCEPT_CARDS.map((card, i) => (
            <motion.div key={card.title}
              initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
              transition={{delay: 0.3 + i*0.06, type:'spring', stiffness:200}}
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
                borderRadius:'12px', padding:'10px 12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                <span style={{ fontSize:'20px' }}>{card.icon}</span>
                <p style={{ fontSize:'13px', fontWeight:900, color:card.color, margin:0 }}>{card.title}</p>
              </div>
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', lineHeight:1.4, marginBottom:'5px' }}>{card.fact}</p>
              <div style={{ background:`${card.color}18`, border:`1px solid ${card.color}35`, borderRadius:'6px', padding:'4px 8px' }}>
                <p style={{ fontSize:'11px', fontWeight:800, color:card.color, margin:0 }}>{card.formula}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
          style={{ display:'flex', gap:'10px', justifyContent:'center', flexShrink:0, paddingBottom:'4px' }}>
          <button className="btn-ghost" style={{ fontSize:'13px', padding:'10px 20px' }}
            onClick={() => navigate('/play')}>🏆 Play Again (Worlds)</button>
          <button className="btn-yellow" style={{ fontSize:'15px', padding:'12px 28px' }}
            onClick={handlePlayAgain}>
            🔄 Start Over
          </button>
        </motion.div>
      </div>
    </div>
  );
}
