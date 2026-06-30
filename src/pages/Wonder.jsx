import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { wonderNarration } from '../utils/narration.js';

export default function Wonder() {
  const navigate   = useNavigate();
  const { markDone } = useGame();
  const { audioEnabled } = useAudio();

  // Play wonder narration once on mount — stop any running audio first
  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  const handleInvestigate = () => {
    stopNarration();          // stop before navigating — no overlap
    markDone('wonder');
    navigate('/story');
  };

  return (
    <div className="page-bg relative z-10" style={{ height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <TopNav />

      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'68px 16px 24px', maxWidth:'560px', margin:'0 auto', width:'100%',
      }}>
        {/* Mascot + bubble */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          className="mascot-bubble" style={{ marginBottom:'24px' }}>
          <div className="anim-float"><Mascot size={52} mood="wonder" /></div>
          <div className="bubble-text">Hmm... I wonder... 🤔</div>
        </motion.div>

        {/* Wonder card */}
        <motion.div initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:0.15 }}
          style={{
            background:'rgba(93,63,211,0.22)', border:'1px solid rgba(93,63,211,0.4)',
            borderRadius:'20px', padding:'32px 28px', width:'100%', textAlign:'center',
          }}>
          {/* Question mark circle */}
          <div style={{
            width:'70px', height:'70px', borderRadius:'50%',
            background:'rgba(124,58,237,0.35)', border:'2px solid rgba(124,58,237,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'34px', margin:'0 auto 20px'
          }}>❓</div>

          <h2 style={{ fontSize:'22px', fontWeight:900, color:'white', lineHeight:1.4, marginBottom:'10px' }}>
            Emma has a 1 m 50 cm ribbon and uses 85 cm.<br />
            How much ribbon is left?
          </h2>
          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.45)', fontStyle:'italic', marginBottom:'22px' }}>
            What if the numbers aren't in the same unit?
          </p>

          {/* Hint strip */}
          <div style={{
            background:'rgba(93,63,211,0.35)', border:'1px solid rgba(93,63,211,0.5)',
            borderRadius:'10px', padding:'10px 16px', marginBottom:'24px'
          }}>
            <p style={{ fontSize:'14px', fontWeight:800, color:'#f5a623', margin:0 }}>
              ✨ We might need to convert units first! ✨
            </p>
          </div>

          <button className="btn-yellow" style={{ fontSize:'17px', padding:'14px 36px' }}
            onClick={handleInvestigate}>
            🔍 Let's Investigate!
          </button>
        </motion.div>
      </div>
    </div>
  );
}
