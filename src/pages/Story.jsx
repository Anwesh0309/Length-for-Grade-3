import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import StoryIllustration from '../components/illustrations/StoryIllustration.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { introNarration } from '../utils/narration.js';

const SLIDES = [
  {
    title: "The Map Room Discovery",
    body: "Emma, Oliver, and Lily found a glowing treasure map in the old school library. It had a message: 'Only those who understand the LANGUAGE OF LENGTH shall find the treasure.' Emma whispered — do you know how to measure things?",
    mascotLine: "Let's explore the world of measurement together! 📏",
    highlight: '✨ "Only those who know length shall find the treasure!" ✨',
    mood: 'excited',
  },
  {
    title: "Sam's Carpenter Workshop — Norway 🔨",
    body: "At the first station, Sam the Carpenter handed each child a ruler. 'Always start from ZERO,' he said. 'Ten small marks make one centimetre. A hundred centimetres make one metre.' They measured pencils, erasers, and planks of wood.",
    mascotLine: "Start from zero — always! Let's measure carefully! ✏️",
    highlight: '📏 10 mm = 1 cm · Always start measuring from 0!',
    mood: 'happy',
  },
  {
    title: "Lena's Giant Garden — Brazil 🌻",
    body: "The garden was enormous! Sunflowers taller than Oliver stood in rows. Lena handed them a metre stick. 'For long things, use metres,' she said. 'This sunflower is 2 metres and 30 centimetres tall!' Oliver's eyes went wide.",
    mascotLine: "One metre equals 100 centimetres — that's really long! 🌱",
    highlight: '📐 1 m = 100 cm · Use metres for big objects!',
    mood: 'excited',
  },
  {
    title: "The Race Track Challenge — Kenya 🏟️",
    body: "At the stadium, Emma jumped 145 cm and Noah jumped 1 m 52 cm. 'Who jumped further?' asked Lily. 'Convert to the same unit first!' called Aisha from the sideline. 1 m 52 cm = 152 cm — so Noah won by just 7 centimetres!",
    mascotLine: "Convert to the same unit before comparing lengths! ⚖️",
    highlight: '⚖️ Always use the SAME unit before comparing!',
    mood: 'thinking',
  },
];

export default function Story() {
  const navigate = useNavigate();
  const { markDone } = useGame();
  const { audioEnabled } = useAudio();
  const [slide, setSlide] = useState(0);

  const current = SLIDES[slide];
  const progress = ((slide + 1) / SLIDES.length) * 100;

  useEffect(() => {
    if (audioEnabled) narrate(introNarration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  const handleNext = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      markDone('story');
      navigate('/simulate');
    }
  };

  const handlePrev = () => {
    if (slide > 0) setSlide(s => s - 1);
  };

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />

      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '72px 16px 24px', maxWidth: '680px', margin: '0 auto'
      }}>

        {/* Progress bar */}
        <div style={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
            Slide {slide + 1} of {SLIDES.length}
          </span>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                style={{
                  width: i === slide ? '24px' : '8px', height: '8px',
                  borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: i === slide ? '#f5a623' : i < slide ? 'rgba(245,166,35,0.5)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress track */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', marginBottom: '20px' }}>
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
            style={{ height: '4px', background: '#f5a623', borderRadius: '999px' }} />
        </div>

        {/* Story card */}
        <AnimatePresence mode="wait">
          <motion.div key={slide}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}
            style={{
              background: 'rgba(93,63,211,0.2)', border: '1px solid rgba(93,63,211,0.35)',
              borderRadius: '20px', overflow: 'hidden', width: '100%'
            }}
          >
            {/* Illustration */}
            <StoryIllustration slide={slide} />

            {/* Content */}
            <div style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#f5a623', marginBottom: '12px' }}>
                {current.title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.88)', marginBottom: '16px', fontWeight: 500 }}>
                {current.body}
              </p>

              {/* Highlight strip */}
              <div style={{
                background: 'rgba(93,63,211,0.35)', border: '1px solid rgba(93,63,211,0.5)',
                borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', textAlign: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#f5a623' }}>{current.highlight}</span>
              </div>

              {/* Mascot speech */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Mascot size={36} mood={current.mood} />
                <div style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0 12px 12px 12px', padding: '8px 14px',
                  fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', flex: 1
                }}>
                  {current.mascotLine}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', marginTop: '20px', gap: '12px' }}>
          {slide > 0 && (
            <button className="btn-ghost" onClick={handlePrev}>← Previous</button>
          )}
          <button className="btn-yellow" onClick={handleNext} style={{ fontSize: '15px', padding: '12px 28px' }}>
            {slide < SLIDES.length - 1 ? 'Next →' : 'Go to Simulate →'}
          </button>
        </div>
      </div>
    </div>
  );
}
