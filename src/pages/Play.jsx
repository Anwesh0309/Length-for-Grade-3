import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import { useGame } from '../context/GameContext.jsx';

/* ── Question generators ── */
function randInt(a, b) { return Math.floor(Math.random()*(b-a+1))+a; }
const names = ['Emma','Oliver','Lily','Noah','Charlotte','Liam','Grace','Ethan'];
const rname = () => names[Math.floor(Math.random()*names.length)];

function genWorld1() {
  // World 1: basic cm reading, simple unit selection, direct conversion
  const bank = [];
  for (let i=0; i<5; i++) {
    const cm = randInt(2,18), mm = randInt(0,9);
    const correct = `${cm} cm ${mm} mm`;
    const opts = [correct,`${cm+1} cm ${mm} mm`,`${cm} cm ${(mm+3)%10} mm`,`${cm-1<1?cm+2:cm-1} cm ${mm} mm`].sort(()=>Math.random()-0.5);
    bank.push({ q:`What is ${cm} cm and ${mm} mm written correctly?`, opts, ans: correct, type:'ruler' });
  }
  for (let i=0; i<4; i++) {
    const objs = [['a pencil','cm'],['a pool','m'],['a door','m'],['a finger','cm'],['a road','km'],['a book','cm']];
    const [obj,unit] = objs[i%objs.length];
    const all = ['mm','cm','m','km'];
    bank.push({ q:`Which unit measures ${obj}?`, opts: all.sort(()=>Math.random()-0.5), ans: unit, type:'unit' });
  }
  return bank.sort(()=>Math.random()-0.5).slice(0,8);
}

function genWorld2() {
  // World 2: conversion m→cm, cm→m, mixed
  const bank = [];
  for (let i=0; i<8; i++) {
    const type = i%3;
    if (type===0) {
      const m=randInt(1,8),cm=randInt(10,90);
      const ans = m*100+cm;
      const opts = [ans,ans+10,ans-10,ans+100].sort(()=>Math.random()-0.5).map(String);
      bank.push({ q:`${m} m ${cm} cm = ? cm`, opts, ans:String(ans), type:'convert' });
    } else if (type===1) {
      const m=randInt(2,9);
      const ans = m*100;
      const opts = [ans,ans+10,ans+100,ans-100].filter(x=>x>0).sort(()=>Math.random()-0.5).map(String);
      bank.push({ q:`${m} m = ? cm`, opts, ans:String(ans), type:'convert' });
    } else {
      const total=randInt(100,900);
      const m=Math.floor(total/100),rem=total%100;
      const ans=`${m} m ${rem} cm`;
      const opts=[ans,`${m+1} m ${rem} cm`,`${m} m ${rem+10} cm`,`${m-1<0?m+1:m-1} m ${rem} cm`].sort(()=>Math.random()-0.5);
      bank.push({ q:`${total} cm = ? m ? cm`, opts, ans, type:'convert' });
    }
  }
  return bank.slice(0,8);
}

function genWorld3() {
  // World 3: word problems + comparison
  const bank = [];
  for (let i=0; i<8; i++) {
    const type = i%3;
    if (type===0) {
      const a=randInt(20,80),b=randInt(10,50),name=rname();
      const ans = a+b;
      const opts=[ans,ans+10,ans-5,ans+5].sort(()=>Math.random()-0.5).map(String);
      bank.push({ q:`${name} has ${a} cm and ${b} cm of ribbon. How long altogether?`, opts, ans:String(ans), type:'word' });
    } else if (type===1) {
      const total=randInt(50,120),cut=randInt(10,40),name=rname();
      const ans=total-cut;
      const opts=[ans,ans+10,ans-10,ans+5].filter(x=>x>0).sort(()=>Math.random()-0.5).map(String);
      bank.push({ q:`${name} had ${total} cm of string, used ${cut} cm. How much left?`, opts, ans:String(ans), type:'word' });
    } else {
      const a=randInt(100,250),b=randInt(80,200);
      const bigger=Math.max(a,b),smaller=Math.min(a,b);
      const opts=[`${a} cm`,`${b} cm`];
      bank.push({ q:`Which is longer: ${a} cm or ${b} cm?`, opts, ans:`${bigger} cm`, type:'compare' });
    }
  }
  return bank.slice(0,8);
}

const WORLDS = [
  { id:1, name:'Ruler Meadow',     emoji:'📏', sub:'cm, mm · basic ruler reading', color:'#3b82f6', generate:genWorld1 },
  { id:2, name:'Conversion Canyon',emoji:'🔄', sub:'m ↔ cm · unit conversion', color:'#a855f7', generate:genWorld2 },
  { id:3, name:'Word Problem Peak', emoji:'🏔️', sub:'Word problems & comparing', color:'#f43f5e', generate:genWorld3 },
];

/* ── World Select Screen ── */
function WorldSelect({ onSelect, worldUnlocked }) {
  return (
    <div className="anim-fadeIn" style={{ width:'100%', maxWidth:'560px' }}>
      <div style={{ textAlign:'center', marginBottom:'32px' }}>
        <div style={{ fontSize:'36px', marginBottom:'8px' }}>🏆</div>
        <h2 style={{ fontSize:'26px', fontWeight:900, color:'white', marginBottom:'4px' }}>Choose Your World!</h2>
        <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)' }}>Beat each world to unlock the next. Earn stars and XP!</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {WORLDS.map(w => {
          const unlocked = w.id <= worldUnlocked;
          return (
            <div key={w.id}
              className={`world-row ${unlocked?'unlocked':'locked'}`}
              onClick={() => unlocked && onSelect(w)}
            >
              {/* Orb */}
              <div style={{
                width:'44px', height:'44px', borderRadius:'50%',
                background: unlocked ? w.color : 'rgba(255,255,255,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'22px', flexShrink:0
              }}>
                {unlocked ? w.emoji : '🔒'}
              </div>

              <div style={{ flex:1 }}>
                <p style={{ fontSize:'16px', fontWeight:800, color: unlocked?'white':'rgba(255,255,255,0.3)' }}>
                  {w.name}
                </p>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{w.sub}</p>
              </div>

              {unlocked && (
                <button className="btn-green" style={{ flexShrink:0, fontSize:'13px', padding:'8px 20px' }}>
                  ▶ PLAY
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── In-Game HUD + Questions ── */
function GamePlay({ world, onFinish }) {
  const questions = useMemo(() => world.generate(), [world]);
  const [qIdx, setQIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(1);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];
  const progress = ((qIdx) / questions.length) * 100;

  const handlePick = (opt) => {
    if (picked) return;
    const isCorrect = opt === q.ans;
    setPicked(opt);
    setCorrect(isCorrect);
    if (isCorrect) {
      setStars(s => s + streak);
      setStreak(s => Math.min(s + 1, 5));
    } else {
      setHearts(h => h - 1);
      setStreak(1);
    }
  };

  const handleNext = () => {
    if (hearts <= 0) { onFinish({ stars, passed: false }); return; }
    if (qIdx >= questions.length - 1) { onFinish({ stars, passed: true }); return; }
    setQIdx(i => i+1);
    setPicked(null);
    setCorrect(null);
  };

  if (done) return null;

  return (
    <div className="anim-fadeIn" style={{ width:'100%', maxWidth:'560px' }}>
      {/* World label */}
      <div style={{ textAlign:'center', marginBottom:'16px' }}>
        <span style={{
          background: 'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
          borderRadius:'999px', padding:'6px 18px', fontSize:'13px', fontWeight:800, color:'white'
        }}>
          {world.emoji} {world.name}
        </span>
      </div>

      {/* HUD bar */}
      <div style={{
        background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:'14px', padding:'12px 18px', marginBottom:'12px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        {/* Stars */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ fontSize:'18px' }}>⭐</span>
          <span style={{ fontSize:'18px', fontWeight:900, color:'white' }}>{stars}</span>
        </div>
        {/* Hearts */}
        <div style={{ display:'flex', gap:'4px' }}>
          {[0,1,2].map(i => (
            <span key={i} className={`heart${i>=hearts?' lost':''}`}>❤️</span>
          ))}
        </div>
        {/* Streak */}
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <span style={{ fontSize:'16px' }}>🔥</span>
          <span style={{ fontSize:'16px', fontWeight:800, color:'#f97316' }}>{streak}x</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom:'8px', display:'flex', justifyContent:'space-between',
        fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:700 }}>
        <span>Question {qIdx+1}/{questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="prog-bar-track" style={{ marginBottom:'20px' }}>
        <motion.div className="prog-bar-fill" animate={{ width:`${progress}%` }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={qIdx}
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}
          style={{
            background:'rgba(93,63,211,0.2)', border:'1px solid rgba(93,63,211,0.35)',
            borderRadius:'16px', padding:'28px', marginBottom:'20px', textAlign:'center'
          }}>
          <p style={{ fontSize:'22px', fontWeight:900, color:'white', lineHeight:1.4, marginBottom:'24px' }}>
            {q.q}
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {q.opts.map(opt => {
              let cls = 'answer-opt';
              if (picked) {
                if (opt===q.ans) cls += ' correct';
                else if (opt===picked) cls += ' wrong';
              }
              return (
                <button key={opt} className={cls}
                  onClick={() => handlePick(opt)}
                  style={{ fontSize:'20px' }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback + Next */}
      {picked && (
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          style={{ textAlign:'center' }}>
          <p style={{
            fontSize:'16px', fontWeight:800, marginBottom:'12px',
            color: correct ? '#22c55e' : '#ef4444'
          }}>
            {correct
              ? `🎉 Brilliant! +${streak} star${streak>1?'s':''}!`
              : `🤔 The answer was: ${q.ans}`
            }
          </p>
          <button className="btn-yellow" style={{ fontSize:'15px', padding:'12px 28px' }} onClick={handleNext}>
            {qIdx >= questions.length-1 ? '🏆 Finish!' : 'Next Question →'}
          </button>
        </motion.div>
      )}

      {/* Game over if no hearts */}
      {hearts <= 0 && picked && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ marginTop:'12px', textAlign:'center' }}>
          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.6)' }}>
            💡 No hearts left — tap Finish to try again!
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ── Results screen ── */
function Results({ result, worldName, onRetry, onNext, isLastWorld }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
      style={{ textAlign:'center', maxWidth:'400px', width:'100%' }}>
      <div style={{ fontSize:'64px', marginBottom:'16px' }}>{result.passed ? '🏆' : '💪'}</div>
      <h2 style={{ fontSize:'28px', fontWeight:900, color:'white', marginBottom:'8px' }}>
        {result.passed ? 'World Complete!' : 'Good Effort!'}
      </h2>
      <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.6)', marginBottom:'24px' }}>
        {worldName} · {result.stars} ⭐ earned
      </p>
      <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
        <button className="btn-ghost" onClick={onRetry}>↺ Try Again</button>
        {result.passed && !isLastWorld && (
          <button className="btn-yellow" onClick={onNext}>Next World →</button>
        )}
        {result.passed && isLastWorld && (
          <button className="btn-yellow" onClick={onNext}>🎓 Go to Reflect →</button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Play page ── */
export default function Play() {
  const navigate = useNavigate();
  const { worldUnlocked, unlockWorld, addStars, addXP, markDone } = useGame();
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelect = (w) => { setSelectedWorld(w); setResult(null); };

  const handleFinish = (res) => {
    setResult(res);
    addStars(res.stars);
    addXP(res.stars * 10);
    if (res.passed && selectedWorld) {
      unlockWorld(selectedWorld.id + 1);
    }
  };

  const handleNext = () => {
    if (selectedWorld?.id === 3) {
      markDone('play');
      navigate('/reflect');
    } else {
      setSelectedWorld(null);
      setResult(null);
    }
  };

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'72px 16px 24px' }}>

        {!selectedWorld && (
          <WorldSelect worldUnlocked={worldUnlocked} onSelect={handleSelect} />
        )}

        {selectedWorld && !result && (
          <GamePlay world={selectedWorld} onFinish={handleFinish} />
        )}

        {result && (
          <Results
            result={result}
            worldName={selectedWorld?.name || ''}
            onRetry={() => { setResult(null); }}
            onNext={handleNext}
            isLastWorld={selectedWorld?.id === 3}
          />
        )}
      </div>
    </div>
  );
}
