import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import {
  simRulerNarration, simConverterNarration,
  simSliderNarration, simSpotErrorNarration, simCompleteNarration,
} from '../utils/narration.js';

// ── helpers ──────────────────────────────────────────────────────────
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// station order — auto-advances through A→B→C→D
const STATION_ORDER = ['ruler', 'convert', 'estimate', 'error'];
const STATION_META = {
  ruler:    { label: 'Ruler Lab',    icon: '📏', letter: 'A', total: 3 },
  convert:  { label: 'Converter',   icon: '🔄', letter: 'B', total: 3 },
  estimate: { label: 'Slider',      icon: '🎯', letter: 'C', total: 5 },
  error:    { label: 'Spot Error',  icon: '🔍', letter: 'D', total: 3 },
};

// ══════════════════════════════════════════════════════════════════════
// TAB A — Ruler Lab  (3 fixed questions)
// ══════════════════════════════════════════════════════════════════════
const RULER_ITEMS = [
  { name: 'Pencil',    emoji: '✏️', cm: 14, mm: 3, color: '#FBBF24' },
  { name: 'Eraser',   emoji: '🧹', cm: 5,  mm: 5, color: '#FB7185' },
  { name: 'Crayon',   emoji: '🖍️', cm: 9,  mm: 0, color: '#34D399' },
];

function RulerLab({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [choices, setChoices] = useState([]);

  const item = RULER_ITEMS[idx];
  const correct = `${item.cm} cm ${item.mm} mm`;
  const totalMm = item.cm * 10 + item.mm;
  const W = 480; const pxPerMm = (W - 40) / ((item.cm + 3) * 10);

  useEffect(() => {
    setPicked(null);
    setChoices(shuffle([
      correct,
      `${item.cm + 1} cm ${item.mm} mm`,
      `${item.cm} cm ${(item.mm + 3) % 10} mm`,
      `${item.cm - 1 < 1 ? item.cm + 2 : item.cm - 1} cm ${item.mm} mm`,
    ]).slice(0, 4));
  }, [idx]);

  const handlePick = (c) => {
    if (picked) return;
    setPicked(c);
  };

  const handleNext = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= RULER_ITEMS.length) { onComplete(); return; }
    setIdx(nextIdx);
  };

  return (
    <div className="anim-slideUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>📏 Ruler Lab</h3>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
          {idx + 1} / {RULER_ITEMS.length}
        </span>
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
        Read the ruler and choose the correct measurement!
      </p>

      {/* Object */}
      <div style={{
        background: 'rgba(254,243,199,0.08)', border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '14px', padding: '16px', marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '36px' }}>{item.emoji}</span>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>{item.name}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Where does it end on the ruler?</p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <svg width={W} height={68} viewBox={`0 0 ${W} 68`} style={{ display: 'block' }}>
            <rect x="20" y="20" width={W - 40} height="30" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            {Array.from({ length: (item.cm + 3) * 10 + 1 }, (_, mm) => {
              const x = 20 + mm * pxPerMm;
              const isCm = mm % 10 === 0; const isFive = mm % 5 === 0;
              const h = isCm ? 22 : isFive ? 14 : 7;
              return (
                <g key={mm}>
                  <line x1={x} y1={50} x2={x} y2={50 - h} stroke="#92400e" strokeWidth={isCm ? 1.5 : 0.7} />
                  {isCm && <text x={x} y={17} textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold">{mm / 10}</text>}
                </g>
              );
            })}
            <rect x="20" y="10" width={totalMm * pxPerMm} height="9" rx="3" fill={item.color} opacity="0.9" />
            <polygon points={`${20 + totalMm * pxPerMm},6 ${20 + totalMm * pxPerMm - 5},0 ${20 + totalMm * pxPerMm + 5},0`} fill="#ef4444" />
          </svg>
        </div>
      </div>

      {/* Choices */}
      {!picked ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          {choices.map(c => (
            <button key={c} className="answer-opt" onClick={() => handlePick(c)}
              style={{ fontSize: '17px' }}>{c}</button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            background: picked === correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `2px solid ${picked === correct ? '#22c55e' : '#ef4444'}`,
            borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '12px'
          }}>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>{picked === correct ? '🎉' : '🤔'}</div>
          <p style={{ fontSize: '16px', fontWeight: 900, color: 'white', marginBottom: '4px' }}>
            {picked === correct ? 'Correct!' : `Answer: ${correct}`}
          </p>
          {picked !== correct && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
              💡 Count big marks = cm, small marks = mm
            </p>
          )}
          <button className="btn-yellow" style={{ fontSize: '14px', padding: '10px 24px' }} onClick={handleNext}>
            {idx + 1 >= RULER_ITEMS.length ? '✅ Station Complete!' : 'Next Question →'}
          </button>
        </motion.div>
      )}

      <div style={{ background: 'rgba(93,63,211,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>
          🔑 Always start from <strong style={{ color: '#f5a623' }}>0</strong> &nbsp;·&nbsp;
          <strong style={{ color: '#f5a623' }}>10 mm = 1 cm</strong>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TAB B — Converter  (3 questions)
// ══════════════════════════════════════════════════════════════════════
function makeConverterQuestions() {
  return [
    (() => { const m = randInt(1,6), c = randInt(10,90); return { q:`${m} m ${c} cm = _____ cm`, ans: m*100+c, hint:`${m} × 100 + ${c} = ${m*100+c}` }; })(),
    (() => { const m = randInt(2,9); return { q:`${m} m = _____ cm`, ans: m*100, hint:`${m} × 100 = ${m*100}` }; })(),
    (() => { const t = randInt(100,800); const m=Math.floor(t/100),r=t%100; return { q:`${t} cm = _____ m _____ cm`, ans:`${m} m ${r} cm`, hint:`${t} ÷ 100 = ${m} m, remainder ${r} cm`, isMixed:true, m, r }; })(),
  ];
}

function UnitConverter({ onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [questions] = useState(() => makeConverterQuestions());
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [result, setResult] = useState(null);
  const [metres, setMetres] = useState(2);
  const [cm, setCm] = useState(50);

  const q = questions[qIdx];
  const totalCm = metres * 100 + cm;

  const checkAnswer = () => {
    let ok = false;
    if (q.isMixed) { ok = parseInt(inputA) === q.m && parseInt(inputB) === q.r; }
    else { ok = parseInt(inputA) === q.ans; }
    setResult(ok ? 'correct' : 'wrong');
  };

  const next = () => {
    const n = qIdx + 1;
    if (n >= questions.length) { onComplete(); return; }
    setQIdx(n); setInputA(''); setInputB(''); setResult(null);
  };

  return (
    <div className="anim-slideUp">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <h3 style={{ fontSize:'18px', fontWeight:900, color:'white' }}>🔄 Unit Converter</h3>
        <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{qIdx+1} / {questions.length}</span>
      </div>

      {/* Live slider demo */}
      <div style={{ background:'rgba(93,63,211,0.15)', borderRadius:'12px', padding:'14px', marginBottom:'16px' }}>
        <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>
          Live Demo — drag to explore:
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:'12px', alignItems:'center', marginBottom:'8px' }}>
          <span style={{ fontSize:'28px', fontWeight:900, color:'#f5a623' }}>{metres} m</span>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'20px' }}>+</span>
          <span style={{ fontSize:'28px', fontWeight:900, color:'#a78bfa' }}>{cm} cm</span>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'20px' }}>=</span>
          <span style={{ fontSize:'28px', fontWeight:900, color:'#22c55e' }}>{totalCm} cm</span>
        </div>
        <input type="range" min="0" max="9" value={metres} onChange={e=>setMetres(+e.target.value)}
          style={{ width:'100%', accentColor:'#f5a623', marginBottom:'4px' }} />
        <input type="range" min="0" max="99" value={cm} onChange={e=>setCm(+e.target.value)}
          style={{ width:'100%', accentColor:'#a78bfa' }} />
      </div>

      {/* Quiz question */}
      <div style={{ background:'rgba(93,63,211,0.2)', border:'1px solid rgba(93,63,211,0.4)', borderRadius:'14px', padding:'20px', marginBottom:'14px', textAlign:'center' }}>
        <p style={{ fontSize:'22px', fontWeight:900, color:'white', marginBottom:'16px' }}>{q.q}</p>
        {q.isMixed ? (
          <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
            <input type="number" value={inputA} onChange={e=>{setInputA(e.target.value);setResult(null);}}
              placeholder="? m" disabled={!!result}
              style={{ width:'90px', background:'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.2)', borderRadius:'10px', padding:'10px', fontSize:'22px', fontWeight:900, color:'white', textAlign:'center', outline:'none' }} />
            <input type="number" value={inputB} onChange={e=>{setInputB(e.target.value);setResult(null);}}
              placeholder="? cm" disabled={!!result}
              style={{ width:'90px', background:'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.2)', borderRadius:'10px', padding:'10px', fontSize:'22px', fontWeight:900, color:'white', textAlign:'center', outline:'none' }} />
          </div>
        ) : (
          <input type="number" value={inputA} onChange={e=>{setInputA(e.target.value);setResult(null);}}
            onKeyDown={e=>e.key==='Enter'&&inputA&&checkAnswer()}
            placeholder="Your answer" disabled={!!result}
            style={{ width:'180px', background:'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.2)', borderRadius:'10px', padding:'12px', fontSize:'26px', fontWeight:900, color:'white', textAlign:'center', outline:'none' }} />
        )}
        {!result && (
          <button className="btn-yellow" style={{ marginTop:'14px', fontSize:'14px', padding:'10px 24px' }} onClick={checkAnswer} disabled={!inputA}>
            Check ✓
          </button>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
            style={{ background: result==='correct'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', border:`2px solid ${result==='correct'?'#22c55e':'#ef4444'}`, borderRadius:'12px', padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:'32px', marginBottom:'6px' }}>{result==='correct'?'🎉':'🤔'}</div>
            <p style={{ fontSize:'16px', fontWeight:900, color:'white', marginBottom:'4px' }}>
              {result==='correct' ? 'Correct!' : `Answer: ${q.ans}`}
            </p>
            {result==='wrong' && <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginBottom:'10px' }}>💡 {q.hint}</p>}
            <button className="btn-yellow" style={{ fontSize:'14px', padding:'10px 24px' }} onClick={next}>
              {qIdx+1>=questions.length?'✅ Station Complete!':'Next →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TAB C — Estimation Slider  (5 questions)
// ══════════════════════════════════════════════════════════════════════
const SLIDER_ITEMS = [
  { name:'pencil',       emoji:'✏️', actual:17, max:50 },
  { name:'textbook',     emoji:'📖', actual:30, max:60 },
  { name:'shoe',         emoji:'👟', actual:24, max:50 },
  { name:'water bottle', emoji:'🍼', actual:25, max:50 },
  { name:'forearm',      emoji:'💪', actual:30, max:60 },
];

function EstimationSlider({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [val, setVal] = useState(20);
  const [revealed, setRevealed] = useState(false);

  const item = SLIDER_ITEMS[idx];
  const diff = Math.abs(val - item.actual);
  const pct  = diff / item.actual;
  const stars = pct <= 0.05 ? 3 : pct <= 0.15 ? 2 : 1;

  useEffect(() => { setVal(Math.floor(item.max / 2)); setRevealed(false); }, [idx]);

  const next = () => {
    const n = idx + 1;
    if (n >= SLIDER_ITEMS.length) { onComplete(); return; }
    setIdx(n);
  };

  return (
    <div className="anim-slideUp">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <h3 style={{ fontSize:'18px', fontWeight:900, color:'white' }}>🎯 Estimation Slider</h3>
        <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{idx+1} / {SLIDER_ITEMS.length}</span>
      </div>
      <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'14px' }}>
        Estimate the length of each object, then reveal the answer!
      </p>

      <div style={{ background:'rgba(93,63,211,0.18)', border:'1px solid rgba(93,63,211,0.35)', borderRadius:'14px', padding:'20px', marginBottom:'14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'16px' }}>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:'11px', fontWeight:800, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>OBJECT</p>
            <p style={{ fontSize:'44px' }}>{item.emoji}</p>
            <p style={{ fontSize:'15px', fontWeight:800, color:'white' }}>{item.name}</p>
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:'11px', fontWeight:800, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>ESTIMATE</p>
            <p style={{ fontSize:'44px', fontWeight:900, color:'#f5a623' }}>{val} cm</p>
          </div>
        </div>
        <input type="range" min={1} max={item.max} value={val}
          onChange={e=>{setVal(+e.target.value);setRevealed(false);}}
          disabled={revealed}
          style={{ width:'100%', accentColor:'#f5a623', height:'8px', marginBottom:'14px' }} />
        <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginBottom:'14px', flexWrap:'wrap' }}>
          {[['☝️','~1 cm'],['🤚','~15cm'],['💪','~30cm']].map(([ic,lb]) => (
            <div key={lb} style={{ background:'rgba(255,255,255,0.06)', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{ic} {lb}</div>
          ))}
        </div>

        {!revealed ? (
          <button className="btn-yellow" style={{ width:'100%', padding:'12px', fontSize:'15px' }} onClick={()=>setRevealed(true)}>
            🔍 Reveal True Length!
          </button>
        ) : (
          <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}>
            <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'14px', marginBottom:'12px', textAlign:'center' }}>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'4px' }}>Actual length:</p>
              <p style={{ fontSize:'32px', fontWeight:900, color:'#22c55e' }}>{item.actual} cm</p>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', marginTop:'4px' }}>
                {'⭐'.repeat(stars)}{'☆'.repeat(3-stars)} — {diff===0?'Exact!':diff<=2?'Near perfect!':diff<=5?'Great!':diff<=8?'Good try!':'Keep practising!'}
              </p>
              {/* comparison bars */}
              <div style={{ marginTop:'10px', textAlign:'left' }}>
                <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'4px' }}>Your estimate vs actual:</p>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'6px', height:'12px', marginBottom:'4px', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#f5a623', borderRadius:'6px', width:`${(val/item.max)*100}%`, transition:'width 0.4s' }} />
                </div>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'6px', height:'12px', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#22c55e', borderRadius:'6px', width:`${(item.actual/item.max)*100}%` }} />
                </div>
              </div>
            </div>
            <button className="btn-yellow" style={{ width:'100%', padding:'12px', fontSize:'15px' }} onClick={next}>
              {idx+1>=SLIDER_ITEMS.length?'✅ Station Complete!':'Next Object →'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TAB D — Spot the Error  (3 questions, fixed "Wrong" button)
// ══════════════════════════════════════════════════════════════════════
const SPOT_PROBLEMS = [
  { q:'2 m 50 cm = 25 cm',   isCorrect:false, explain:'2 m = 200 cm, so 2 m 50 cm = 250 cm (not 25 cm)' },
  { q:'1 m 30 cm = 130 cm',  isCorrect:true,  explain:'✅ Correct! 1 × 100 + 30 = 130 cm' },
  { q:'400 cm = 4 m',        isCorrect:true,  explain:'✅ Correct! 400 ÷ 100 = 4 m' },
  { q:'3 m 5 cm = 35 cm',    isCorrect:false, explain:'3 m = 300 cm, so 3 m 5 cm = 305 cm (not 35 cm)' },
  { q:'750 cm = 75 m',       isCorrect:false, explain:'750 ÷ 100 = 7.5 m = 7 m 50 cm (not 75 m)' },
  { q:'6 m 20 cm = 620 cm',  isCorrect:true,  explain:'✅ Correct! 6 × 100 + 20 = 620 cm' },
];

function SpotError({ onComplete }) {
  // pick 3 problems: first always false, second always true, third random
  const [problems] = useState(() => {
    const falseOnes = SPOT_PROBLEMS.filter(p => !p.isCorrect);
    const trueOnes  = SPOT_PROBLEMS.filter(p => p.isCorrect);
    return shuffle([
      falseOnes[randInt(0, falseOnes.length - 1)],
      trueOnes[randInt(0, trueOnes.length - 1)],
      SPOT_PROBLEMS[randInt(0, SPOT_PROBLEMS.length - 1)],
    ]);
  });
  const [idx, setIdx]   = useState(0);
  const [picked, setPicked] = useState(null); // true = user said Correct, false = user said Wrong

  const p = problems[idx];
  // userPickedCorrect: true means user clicked "✅ Correct", false means "❌ Wrong"
  const userWasRight = picked !== null ? (picked === p.isCorrect) : null;

  const handlePick = (userSaysCorrect) => {
    if (picked !== null) return;
    setPicked(userSaysCorrect);
  };

  const next = () => {
    const n = idx + 1;
    if (n >= problems.length) { onComplete(); return; }
    setIdx(n); setPicked(null);
  };

  return (
    <div className="anim-slideUp">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <h3 style={{ fontSize:'18px', fontWeight:900, color:'white' }}>🔍 Spot the Error</h3>
        <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{idx+1} / {problems.length}</span>
      </div>
      <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'16px' }}>
        Is this measurement conversion <strong style={{ color:'#22c55e' }}>CORRECT</strong> or <strong style={{ color:'#ef4444' }}>WRONG</strong>?
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
          style={{ background:'rgba(93,63,211,0.22)', border:'1px solid rgba(93,63,211,0.4)', borderRadius:'16px', padding:'28px', textAlign:'center', marginBottom:'14px' }}>

          <p style={{ fontSize:'28px', fontWeight:900, color:'white', marginBottom:'6px' }}>{p.q}</p>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', marginBottom:'24px' }}>Problem {idx+1} of {problems.length}</p>

          {picked === null ? (
            <div style={{ display:'flex', gap:'14px', justifyContent:'center' }}>
              {/* ✅ Correct button */}
              <button
                style={{ background:'rgba(34,197,94,0.25)', border:'2px solid #22c55e', color:'white',
                  fontWeight:800, fontSize:'16px', padding:'14px 28px', borderRadius:'999px', cursor:'pointer',
                  transition:'all 0.15s' }}
                onMouseOver={e=>e.currentTarget.style.background='rgba(34,197,94,0.4)'}
                onMouseOut={e=>e.currentTarget.style.background='rgba(34,197,94,0.25)'}
                onClick={() => handlePick(true)}>
                ✅ Correct
              </button>
              {/* ❌ Wrong button */}
              <button
                style={{ background:'rgba(239,68,68,0.25)', border:'2px solid #ef4444', color:'white',
                  fontWeight:800, fontSize:'16px', padding:'14px 28px', borderRadius:'999px', cursor:'pointer',
                  transition:'all 0.15s' }}
                onMouseOver={e=>e.currentTarget.style.background='rgba(239,68,68,0.4)'}
                onMouseOut={e=>e.currentTarget.style.background='rgba(239,68,68,0.25)'}
                onClick={() => handlePick(false)}>
                ❌ Wrong
              </button>
            </div>
          ) : (
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}>
              <div style={{
                background: userWasRight ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                border: `2px solid ${userWasRight ? '#22c55e' : '#ef4444'}`,
                borderRadius:'12px', padding:'16px', marginBottom:'14px'
              }}>
                <div style={{ fontSize:'32px', marginBottom:'8px' }}>{userWasRight ? '🎉' : '🤔'}</div>
                <p style={{ fontSize:'16px', fontWeight:900, color:'white', marginBottom:'6px' }}>
                  {userWasRight ? 'Well spotted!' : 'Not quite!'}
                </p>
                <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.75)' }}>{p.explain}</p>
              </div>
              <button className="btn-yellow" style={{ padding:'10px 28px', fontSize:'14px' }} onClick={next}>
                {idx+1>=problems.length ? '✅ Station Complete!' : 'Next →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Completion overlay — shown after all 4 stations done
// ══════════════════════════════════════════════════════════════════════
function CompletionOverlay({ onGoToPlay }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
      style={{ position:'fixed', inset:0, background:'rgba(10,6,32,0.92)', zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ textAlign:'center', maxWidth:'480px', width:'100%' }}>
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, type:'spring', stiffness:200 }}
          style={{ fontSize:'80px', marginBottom:'20px' }}>🏆</motion.div>
        <h2 style={{ fontSize:'32px', fontWeight:900, color:'white', marginBottom:'12px' }}>
          All Stations Complete!
        </h2>
        <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:'28px' }}>
          Congratulations! You have completed all 4 simulation stations.<br />
          Now you are entering <strong style={{ color:'#f5a623' }}>Test Mode</strong> — 10 different worlds with 10 questions each.<br />
          All the best! 🌟
        </p>
        <button className="btn-yellow" style={{ fontSize:'18px', padding:'16px 40px' }} onClick={onGoToPlay}>
          🎮 Enter Test Mode →
        </button>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN Simulate page — auto-advance A→B→C→D, no Next Station button
// ══════════════════════════════════════════════════════════════════════
export default function Simulate() {
  const navigate = useNavigate();
  const { markDone } = useGame();
  const { audioEnabled } = useAudio();
  const [stationIdx, setStationIdx] = useState(0);    // 0=ruler 1=convert 2=estimate 3=error
  const [showCompletion, setShowCompletion] = useState(false);

  const stationKey = STATION_ORDER[stationIdx];
  const stationNarrations = [simRulerNarration, simConverterNarration, simSliderNarration, simSpotErrorNarration];

  // Play narration ONLY when station changes, after stopping previous
  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(stationNarrations[stationIdx](), true);
    return () => stopNarration();
  }, [stationIdx, audioEnabled]);

  const handleStationComplete = useCallback(() => {
    const next = stationIdx + 1;
    if (next >= STATION_ORDER.length) {
      stopNarration();
      if (audioEnabled) narrate(simCompleteNarration(), true);
      setShowCompletion(true);
    } else {
      setStationIdx(next);
    }
  }, [stationIdx, audioEnabled]);

  const handleGoToPlay = () => {
    stopNarration();
    markDone('simulate');
    navigate('/play');
  };

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />
      {showCompletion && <CompletionOverlay onGoToPlay={handleGoToPlay} />}

      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', padding:'68px 16px 20px', maxWidth:'660px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'16px' }}>
          <h2 style={{ fontSize:'22px', fontWeight:900, color:'white', marginBottom:'2px' }}>✏️ Simulate</h2>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Explore and discover — no wrong answers!</p>
        </div>

        {/* Station tab indicators (read-only, auto-advance) */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap', justifyContent:'center' }}>
          {STATION_ORDER.map((key, i) => {
            const meta = STATION_META[key];
            const isActive = i === stationIdx;
            const isDone   = i < stationIdx;
            return (
              <div key={key}
                style={{
                  display:'flex', alignItems:'center', gap:'5px',
                  padding:'7px 14px', borderRadius:'999px', fontSize:'13px', fontWeight:700,
                  background: isActive ? '#f5a623' : isDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#1a1040' : isDone ? '#22c55e' : 'rgba(255,255,255,0.4)',
                  border: isDone ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent',
                  transition: 'all 0.3s',
                }}>
                <span style={{ width:'18px', height:'18px', borderRadius:'50%', background: isActive?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.1)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:900 }}>
                  {isDone ? '✓' : meta.letter}
                </span>
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                <span style={{ fontSize:'11px', opacity:0.7 }}>({meta.total})</span>
              </div>
            );
          })}
        </div>

        {/* Simulation panel */}
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'24px', width:'100%' }}>
          <AnimatePresence mode="wait">
            <motion.div key={stationKey}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-14 }} transition={{ duration:0.28 }}>
              {stationKey === 'ruler'    && <RulerLab    onComplete={handleStationComplete} />}
              {stationKey === 'convert'  && <UnitConverter onComplete={handleStationComplete} />}
              {stationKey === 'estimate' && <EstimationSlider onComplete={handleStationComplete} />}
              {stationKey === 'error'    && <SpotError    onComplete={handleStationComplete} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back to story only */}
        <div style={{ marginTop:'16px', width:'100%' }}>
          <button className="btn-ghost" style={{ fontSize:'13px', padding:'9px 20px' }} onClick={() => navigate('/story')}>
            ← Back to Story
          </button>
        </div>
      </div>
    </div>
  );
}
