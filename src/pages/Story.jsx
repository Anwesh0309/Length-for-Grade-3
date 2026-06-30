import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import StoryIllustration from '../components/illustrations/StoryIllustration.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import {
  storySlide1Narration, storySlide2Narration,
  storySlide3Narration, storySlide4Narration,
} from '../utils/narration.js';

const SLIDE_NARRATIONS = [
  storySlide1Narration, storySlide2Narration,
  storySlide3Narration, storySlide4Narration,
];

const SLIDES = [
  {
    title:'The Map Room Discovery',
    body:'Emma, Oliver, and Lily found a glowing treasure map in the old school library. It said: "Only those who understand the LANGUAGE OF LENGTH shall find the treasure." Emma whispered — do you know how to measure things?',
    mascotLine:'Let us explore the world of measurement together! 📏',
    highlight:'✨ "Only those who know length shall find the treasure!" ✨',
    mood:'excited',
  },
  {
    title:"Sam's Workshop — Norway 🔨",
    body:"Sam the Carpenter handed each child a ruler. 'Always start from ZERO,' he said. 'Ten small marks = one centimetre. A hundred centimetres = one metre.' They measured pencils, erasers, and planks of wood!",
    mascotLine:'Start from zero — always! Read in mm and cm! ✏️',
    highlight:'📏 10 mm = 1 cm · Always start from 0!',
    mood:'happy',
  },
  {
    title:"Lena's Giant Garden — Brazil 🌻",
    body:'The garden was enormous! Sunflowers taller than Oliver stood in rows. Lena handed them a metre stick. "For long things, use metres — this sunflower is 2 m 30 cm tall!" Oliver\'s eyes went wide.',
    mascotLine:'One metre equals 100 centimetres — use metres for big things! 🌱',
    highlight:'📐 1 m = 100 cm · Use metres for big objects!',
    mood:'excited',
  },
  {
    title:'The Race Track — Kenya 🏟️',
    body:"Emma jumped 145 cm. Noah jumped 1 m 52 cm. 'Who jumped further?' asked Lily. 'Convert to the same unit first!' 1 m 52 cm = 152 cm. So Noah won — by just 7 centimetres!",
    mascotLine:'Convert to the same unit before comparing lengths! ⚖️',
    highlight:'⚖️ Always use the SAME unit before comparing!',
    mood:'thinking',
  },
];

export default function Story() {
  const navigate     = useNavigate();
  const { markDone } = useGame();
  const { audioEnabled } = useAudio();
  const [slide, setSlide] = useState(0);

  const current  = SLIDES[slide];
  const progress = ((slide + 1) / SLIDES.length) * 100;

  // Play narration for current slide only — stop previous first
  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(SLIDE_NARRATIONS[slide](), true);
    return () => stopNarration();
  }, [slide, audioEnabled]);  // re-runs on slide change

  const goNext = () => {
    stopNarration();            // hard stop — no overlap
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      markDone('story');
      navigate('/simulate');
    }
  };
  const goPrev = () => { stopNarration(); if (slide > 0) setSlide(s => s - 1); };

  return (
    <div className="page-bg relative z-10" style={{ height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <TopNav />

      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', padding:'64px 16px 12px',
        maxWidth:'660px', margin:'0 auto', width:'100%', gap:'10px', overflow:'hidden',
      }}>

        {/* Progress row */}
        <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', flexShrink:0 }}>
          <span style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.4)' }}>Slide {slide+1} of {SLIDES.length}</span>
          <div style={{ display:'flex', gap:'5px', flex:1, justifyContent:'center' }}>
            {SLIDES.map((_,i) => (
              <button key={i} onClick={() => { stopNarration(); setSlide(i); }}
                style={{ width: i===slide?'22px':'8px', height:'8px', borderRadius:'999px', border:'none', cursor:'pointer',
                  background: i===slide?'#f5a623':i<slide?'rgba(245,166,35,0.5)':'rgba(255,255,255,0.18)', transition:'all 0.3s' }} />
            ))}
          </div>
          <span style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{Math.round(progress)}%</span>
        </div>

        {/* Progress bar */}
        <div style={{ width:'100%', height:'3px', background:'rgba(255,255,255,0.1)', borderRadius:'999px', flexShrink:0 }}>
          <motion.div animate={{ width:`${progress}%` }} transition={{ duration:0.4 }}
            style={{ height:'3px', background:'#f5a623', borderRadius:'999px' }} />
        </div>

        {/* Story card — fills remaining space */}
        <AnimatePresence mode="wait">
          <motion.div key={slide}
            initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-30 }} transition={{ duration:0.3 }}
            style={{
              background:'rgba(93,63,211,0.2)', border:'1px solid rgba(93,63,211,0.35)',
              borderRadius:'18px', overflow:'hidden', width:'100%', flex:1,
              display:'flex', flexDirection:'column',
            }}>
            {/* Illustration */}
            <div style={{ flexShrink:0 }}>
              <StoryIllustration slide={slide} />
            </div>

            {/* Content */}
            <div style={{ padding:'16px 20px', flex:1, display:'flex', flexDirection:'column', gap:'8px', overflow:'hidden' }}>
              <h3 style={{ fontSize:'17px', fontWeight:900, color:'#f5a623', margin:0, flexShrink:0 }}>
                {current.title}
              </h3>
              <p style={{ fontSize:'14px', lineHeight:1.65, color:'rgba(255,255,255,0.85)',
                fontWeight:500, margin:0, flexShrink:0 }}>
                {current.body}
              </p>

              {/* Highlight */}
              <div style={{ background:'rgba(93,63,211,0.35)', border:'1px solid rgba(93,63,211,0.5)',
                borderRadius:'8px', padding:'8px 12px', flexShrink:0 }}>
                <span style={{ fontSize:'13px', fontWeight:800, color:'#f5a623' }}>{current.highlight}</span>
              </div>

              {/* Mascot */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:'8px', flexShrink:0 }}>
                <Mascot size={32} mood={current.mood} />
                <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:'0 10px 10px 10px', padding:'7px 12px', fontSize:'12px', fontWeight:700,
                  color:'rgba(255,255,255,0.8)', flex:1 }}>
                  {current.mascotLine}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', width:'100%', gap:'10px', flexShrink:0 }}>
          {slide > 0 && (
            <button className="btn-ghost" style={{ fontSize:'13px', padding:'9px 18px' }} onClick={goPrev}>
              ← Previous
            </button>
          )}
          <button className="btn-yellow" style={{ fontSize:'14px', padding:'11px 24px' }} onClick={goNext}>
            {slide < SLIDES.length - 1 ? 'Next →' : 'Go to Simulate →'}
          </button>
        </div>
      </div>
    </div>
  );
}
