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
  const navigate = useNavigate();
  const { markDone } = useGame();
  const { audioEnabled } = useAudio();

  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  const handleInvestigate = () => {
    markDone('wonder');
    navigate('/story');
  };

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />

      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '80px 16px 24px'
      }}>

        {/* Mascot + bubble */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="mascot-bubble" style={{ marginBottom: '32px' }}>
          <div className="anim-float"><Mascot size={52} mood="wonder" /></div>
          <div className="bubble-text">Hmm... I wonder... 🤔</div>
        </motion.div>

        {/* Wonder card */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'rgba(93,63,211,0.22)', border: '1px solid rgba(93,63,211,0.4)',
            borderRadius: '20px', padding: '40px 32px', maxWidth: '560px', width: '100%', textAlign: 'center'
          }}>

          {/* Purple question circle */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(124,58,237,0.35)', border: '2px solid rgba(124,58,237,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', margin: '0 auto 24px'
          }}>❓</div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', lineHeight: 1.3, marginBottom: '12px' }}>
            Emma has a 1 m 50 cm ribbon and uses 85 cm.<br />
            How much ribbon is left?
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '28px' }}>
            What if the numbers aren't in the same unit?
          </p>

          {/* Hint strip */}
          <div style={{
            background: 'rgba(93,63,211,0.35)', border: '1px solid rgba(93,63,211,0.5)',
            borderRadius: '12px', padding: '12px 20px', marginBottom: '32px'
          }}>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#f5a623' }}>
              ✨ We might need to convert units first! ✨
            </p>
          </div>

          <button className="btn-yellow" style={{ fontSize: '17px', padding: '14px 36px' }}
            onClick={handleInvestigate}>
            🔍 Let's Investigate!
          </button>
        </motion.div>
      </div>
    </div>
  );
}
