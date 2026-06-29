import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import {
  station1Narration, station2Narration,
  station3Narration, station4Narration,
} from '../utils/narration.js';

/* ════════════════════════════════════════════════
   TAB A — Ruler Lab
   Drag the ruler end to read the measurement
   ════════════════════════════════════════════════ */
function RulerLab() {
  const ITEMS = [
    { name: 'Pencil', cm: 14, mm: 3, color: '#FBBF24' },
    { name: 'Eraser', cm: 5,  mm: 5, color: '#FB7185' },
    { name: 'Crayon', cm: 9,  mm: 0, color: '#34D399' },
  ];
  const [idx, setIdx] = useState(0);
  const [reading, setReading] = useState(null);

  const item = ITEMS[idx];
  const totalMm = item.cm * 10 + item.mm;
  const W = 500;
  const pxPerMm = (W - 40) / ((item.cm + 3) * 10);
  const correct = `${item.cm} cm ${item.mm} mm`;

  const choices = [correct,
    `${item.cm+1} cm ${item.mm} mm`,
    `${item.cm} cm ${(item.mm+3)%10} mm`,
    `${item.cm-1<1?item.cm+2:item.cm-1} cm ${item.mm} mm`,
  ].sort(() => Math.random() - 0.5).slice(0,4);

  const reset = () => { setReading(null); setIdx(i => (i+1)%ITEMS.length); };

  return (
    <div className="anim-slideUp">
      <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
        📏 Ruler Lab
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        Read the ruler and choose the correct measurement!
      </p>

      {/* Object + Ruler display */}
      <div style={{
        background: 'rgba(254,243,199,0.08)', border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '14px', padding: '20px', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '40px' }}>{['✏️','🧹','🖍️'][idx]}</span>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>{item.name}</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Where does it end?</p>
          </div>
        </div>

        {/* SVG Ruler */}
        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={70} viewBox={`0 0 ${W} 70`} style={{ display: 'block' }}>
            <rect x="20" y="22" width={W-40} height="30" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            {Array.from({ length: (item.cm+3)*10+1 }, (_, mm) => {
              const x = 20 + mm*pxPerMm;
              const isCm = mm%10===0, isFive = mm%5===0;
              const h = isCm?22:isFive?14:7;
              return (
                <g key={mm}>
                  <line x1={x} y1={52} x2={x} y2={52-h} stroke="#92400e" strokeWidth={isCm?1.5:0.7} />
                  {isCm&&<text x={x} y={19} textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold">{mm/10}</text>}
                </g>
              );
            })}
            {/* Object bar */}
            <rect x="20" y="12" width={totalMm*pxPerMm} height="9" rx="3" fill={item.color} opacity="0.9" />
            <polygon points={`${20+totalMm*pxPerMm},8 ${20+totalMm*pxPerMm-5},1 ${20+totalMm*pxPerMm+5},1`} fill="#ef4444" />
            <text x={W-12} y={65} fontSize="9" fill="#9CA3AF" fontWeight="bold" textAnchor="end">cm</text>
          </svg>
        </div>
      </div>

      {/* Answer choices */}
      {!reading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {choices.map(c => (
            <button key={c} className="answer-opt" onClick={() => setReading(c)}>{c}</button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }}
          style={{
            background: reading===correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `2px solid ${reading===correct?'#22c55e':'#ef4444'}`,
            borderRadius: '14px', padding: '20px', textAlign: 'center'
          }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>{reading===correct?'🎉':'🤔'}</div>
          <p style={{ fontSize: '18px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
            {reading===correct ? 'Correct!' : `Answer: ${correct}`}
          </p>
          {reading!==correct && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
              💡 Count the big marks (cm) then small marks (mm)
            </p>
          )}
          <button className="btn-yellow" style={{ fontSize: '14px', padding: '10px 24px' }} onClick={reset}>
            Next Object →
          </button>
        </motion.div>
      )}

      {/* Key fact */}
      <div style={{ marginTop: '16px', background: 'rgba(93,63,211,0.2)', borderRadius: '12px', padding: '12px 16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          🔑 Key: <strong style={{ color: '#f5a623' }}>Always start from 0!</strong> &nbsp;·&nbsp;
          <strong style={{ color: '#f5a623' }}>10 mm = 1 cm</strong>
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   TAB B — Unit Converter
   Type a measurement, see the conversion live
   ════════════════════════════════════════════════ */
function UnitConverter() {
  const [metres, setMetres] = useState(2);
  const [cm, setCm] = useState(50);
  const totalCm = metres * 100 + cm;
  const [quizAns, setQuizAns] = useState('');
  const [quizResult, setQuizResult] = useState(null);

  const quizQ = `${metres} m ${cm} cm = _____ cm`;
  const check = () => {
    const correct = parseInt(quizAns) === totalCm;
    setQuizResult(correct ? 'correct' : 'wrong');
  };

  return (
    <div className="anim-slideUp">
      <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
        🔄 Unit Converter
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        Drag the sliders — watch the conversion update live!
      </p>

      {/* Sliders */}
      <div style={{
        background: 'rgba(93,63,211,0.18)', border: '1px solid rgba(93,63,211,0.35)',
        borderRadius: '14px', padding: '20px', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>METRES</p>
            <p style={{ fontSize: '42px', fontWeight: 900, color: '#f5a623' }}>{metres}</p>
          </div>
          <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center' }}>+</div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>EXTRA CM</p>
            <p style={{ fontSize: '42px', fontWeight: 900, color: '#a78bfa' }}>{cm}</p>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Metres: {metres}</p>
          <input type="range" min="0" max="9" value={metres} onChange={e => { setMetres(+e.target.value); setQuizResult(null); setQuizAns(''); }}
            style={{ width: '100%', accentColor: '#f5a623', height: '8px' }} />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Extra cm: {cm}</p>
          <input type="range" min="0" max="99" value={cm} onChange={e => { setCm(+e.target.value); setQuizResult(null); setQuizAns(''); }}
            style={{ width: '100%', accentColor: '#a78bfa', height: '8px' }} />
        </div>

        {/* Result */}
        <div style={{
          marginTop: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
          padding: '16px', textAlign: 'center'
        }}>
          {metres > 0 && cm > 0 && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
              {cm < metres*100 ? '' : <span style={{ color: '#22c55e' }}>✅ </span>}
              {metres} × 100 + {cm} =
            </p>
          )}
          <motion.p key={totalCm} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: '36px', fontWeight: 900, color: '#f5a623' }}>
            {totalCm} cm
          </motion.p>
        </div>
      </div>

      {/* Quiz */}
      <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '14px', padding: '16px' }}>
        <p style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>🎯 Quick Quiz: {quizQ}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" value={quizAns} onChange={e => { setQuizAns(e.target.value); setQuizResult(null); }}
            onKeyDown={e => e.key==='Enter' && quizAns && check()}
            placeholder="Your answer"
            style={{
              flex: 1, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', padding: '10px 14px', fontSize: '18px', fontWeight: 800,
              color: 'white', textAlign: 'center', outline: 'none'
            }} />
          <button className="btn-yellow" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={check} disabled={!quizAns}>
            ✓
          </button>
        </div>
        {quizResult && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ marginTop: '10px', fontSize: '15px', fontWeight: 800,
              color: quizResult==='correct'?'#22c55e':'#ef4444', textAlign: 'center' }}>
            {quizResult==='correct' ? `🎉 Yes! ${totalCm} cm!` : `💡 ${metres} × 100 + ${cm} = ${totalCm} cm`}
          </motion.p>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   TAB C — Estimation Slider
   Drag the slider, then reveal true measurement
   ════════════════════════════════════════════════ */
function EstimationSlider() {
  const ITEMS = [
    { name: 'pencil', emoji: '✏️', actual: 17, max: 50 },
    { name: 'textbook', emoji: '📖', actual: 30, max: 60 },
    { name: 'shoe', emoji: '👟', actual: 24, max: 50 },
    { name: 'water bottle', emoji: '🍼', actual: 25, max: 50 },
  ];
  const [idx, setIdx] = useState(0);
  const [val, setVal] = useState(20);
  const [revealed, setRevealed] = useState(false);

  const item = ITEMS[idx];
  const diff = Math.abs(val - item.actual);
  const pct = diff / item.actual;
  const stars = pct <= 0.05 ? 3 : pct <= 0.15 ? 2 : 1;

  const reset = () => { setIdx(i => (i+1)%ITEMS.length); setVal(20); setRevealed(false); };

  return (
    <div className="anim-slideUp">
      <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
        🎯 Estimation Slider
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        Drag the slider — watch the estimation update live!
      </p>

      {/* Object + display */}
      <div style={{
        background: 'rgba(93,63,211,0.18)', border: '1px solid rgba(93,63,211,0.35)',
        borderRadius: '14px', padding: '24px', marginBottom: '20px', textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OBJECT</p>
            <p style={{ fontSize: '42px' }}>{item.emoji}</p>
            <p style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{item.name}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>YOUR ESTIMATE</p>
            <motion.p key={val} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              style={{ fontSize: '42px', fontWeight: 900, color: '#f5a623' }}>{val} cm</motion.p>
          </div>
        </div>

        <input type="range" min={1} max={item.max} value={val}
          onChange={e => { setVal(+e.target.value); setRevealed(false); }}
          style={{ width: '100%', accentColor: '#f5a623', height: '8px', marginBottom: '20px' }} />

        {/* Body benchmarks row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[['☝️','~1 cm'],['🤚','~15cm'],['💪','~30cm']].map(([icon,label]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: '8px',
              padding: '6px 12px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)'
            }}>{icon} {label}</div>
          ))}
        </div>

        {!revealed ? (
          <button className="btn-yellow" style={{ padding: '12px 28px', fontSize: '15px' }}
            onClick={() => setRevealed(true)}>
            🔍 Reveal True Length!
          </button>
        ) : (
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>
            <div style={{
              background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '12px'
            }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Actual length:</p>
              <p style={{ fontSize: '28px', fontWeight: 900, color: '#22c55e' }}>{item.actual} cm</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                {'⭐'.repeat(stars)}{'☆'.repeat(3-stars)} — {diff===0?'Exact!':diff<=2?'Near perfect!':diff<=5?'Great!':diff<=10?'Good try!':'Keep practising!'}
              </p>
            </div>
            <button className="btn-yellow" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={reset}>
              Next Object →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   TAB D — Spot the Error
   Show a calculation with a deliberate error 
   ════════════════════════════════════════════════ */
function SpotError() {
  const PROBLEMS = [
    { q: '2 m 50 cm = 25 cm', correct: false, explain: '2 m = 200 cm, so 2 m 50 cm = 250 cm (not 25 cm)' },
    { q: '1 m 30 cm = 130 cm', correct: true,  explain: '✅ Correct! 1 × 100 + 30 = 130 cm' },
    { q: '400 cm = 4 m', correct: true,  explain: '✅ Correct! 400 ÷ 100 = 4 m' },
    { q: '3 m 5 cm = 35 cm', correct: false, explain: '3 m = 300 cm, so 3 m 5 cm = 305 cm (not 35 cm)' },
    { q: '750 cm = 75 m', correct: false, explain: '750 ÷ 100 = 7.5 m = 7 m 50 cm (not 75 m)' },
    { q: '6 m 20 cm = 620 cm', correct: true,  explain: '✅ Correct! 6 × 100 + 20 = 620 cm' },
  ];

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const p = PROBLEMS[idx];

  const next = () => { setIdx(i => (i+1)%PROBLEMS.length); setPicked(null); };

  return (
    <div className="anim-slideUp">
      <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
        🔍 Spot the Error
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        Is this measurement conversion CORRECT or WRONG?
      </p>

      <div style={{
        background: 'rgba(93,63,211,0.22)', border: '1px solid rgba(93,63,211,0.4)',
        borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '20px'
      }}>
        <p style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>{p.q}</p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
          Problem {idx+1} of {PROBLEMS.length}
        </p>

        {!picked ? (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-green" style={{ fontSize: '16px', padding: '14px 32px' }}
              onClick={() => setPicked(true)}>✅ Correct</button>
            <button style={{
              background: 'rgba(239,68,68,0.3)', border: '2px solid rgba(239,68,68,0.5)',
              color: '#fff', fontWeight: 800, fontSize: '16px', padding: '14px 32px',
              borderRadius: '999px', cursor: 'pointer'
            }} onClick={() => setPicked(false)}>❌ Wrong</button>
          </div>
        ) : (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
            <div style={{
              background: picked===p.correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              border: `2px solid ${picked===p.correct?'#22c55e':'#ef4444'}`,
              borderRadius: '12px', padding: '16px', marginBottom: '16px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {picked===p.correct ? '🎉' : '🤔'}
              </div>
              <p style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
                {picked===p.correct ? 'Well spotted!' : 'Not quite!'}
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{p.explain}</p>
            </div>
            <button className="btn-yellow" style={{ padding: '10px 28px', fontSize: '14px' }} onClick={next}>
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN Simulate Page
   ════════════════════════════════════════════════ */
const TABS = [
  { key: 'ruler',    label: 'Ruler Lab',   icon: '📏', letter: 'A' },
  { key: 'convert',  label: 'Converter',   icon: '🔄', letter: 'B' },
  { key: 'estimate', label: 'Slider',      icon: '🎯', letter: 'C' },
  { key: 'error',    label: 'Spot Error',  icon: '🔍', letter: 'D' },
];

export default function Simulate() {
  const navigate = useNavigate();
  const { markDone } = useGame();
  const { audioEnabled } = useAudio();
  const [activeTab, setActiveTab] = useState('ruler');

  useEffect(() => {
    if (audioEnabled) narrate(station1Narration(), true);
    return () => stopNarration();
  }, [audioEnabled]);

  const handleNext = () => {
    markDone('simulate');
    navigate('/play');
  };

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />

      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', padding:'72px 16px 24px', maxWidth:'680px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'22px', fontWeight:900, color:'white', marginBottom:'4px' }}>
            ✏️ Simulate
          </h2>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.45)', fontWeight:600 }}>
            Explore and discover — no wrong answers!
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap', justifyContent:'center' }}>
          {TABS.map(tab => (
            <button key={tab.key}
              className={`sim-tab ${activeTab===tab.key?'active':''}`}
              onClick={() => setActiveTab(tab.key)}>
              <span style={{
                width:'20px', height:'20px', borderRadius:'50%',
                background: activeTab===tab.key ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.12)',
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                fontSize:'10px', fontWeight:900
              }}>{tab.letter}</span>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Simulation panel */}
        <div style={{
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'20px', padding:'28px', width:'100%'
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-12 }} transition={{ duration:0.25 }}>
              {activeTab==='ruler'    && <RulerLab />}
              {activeTab==='convert'  && <UnitConverter />}
              {activeTab==='estimate' && <EstimationSlider />}
              {activeTab==='error'    && <SpotError />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', marginTop:'20px', gap:'12px' }}>
          <button className="btn-ghost" onClick={() => navigate('/story')}>← Previous Station</button>
          <button className="btn-yellow" style={{ fontSize:'14px', padding:'12px 24px' }} onClick={handleNext}>
            Next Station →
          </button>
        </div>
      </div>
    </div>
  );
}
