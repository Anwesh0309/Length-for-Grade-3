import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/ui/TopNav.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useAudio } from '../context/AudioContext.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { playWorldNarration, playCorrectNarration, playWrongNarration } from '../utils/narration.js';

// ── helpers ───────────────────────────────────────────────────────────
function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function sh(a) { return [...a].sort(() => Math.random() - 0.5); }
const WN = ['Emma','Oliver','Lily','Noah','Charlotte','Liam','Grace','Ethan','Ava','James'];
const rn = () => WN[ri(0, WN.length - 1)];

// ── Question diagram components ───────────────────────────────────────
function RulerDiagram({ cm, mm }) {
  const totalMm = cm * 10 + mm;
  const W = 260; const pxPerMm = (W - 20) / ((cm + 2) * 10);
  return (
    <svg width={W} height={52} viewBox={`0 0 ${W} 52`} style={{ display:'block', margin:'0 auto' }}>
      <rect x="10" y="16" width={W-20} height="24" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      {Array.from({ length: (cm+2)*10+1 }, (_, m) => {
        const x = 10 + m * pxPerMm;
        const isCm = m%10===0; const isFive = m%5===0;
        const h = isCm?18:isFive?12:6;
        return (
          <g key={m}>
            <line x1={x} y1={40} x2={x} y2={40-h} stroke="#92400e" strokeWidth={isCm?1.2:0.6} />
            {isCm&&<text x={x} y={14} textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="bold">{m/10}</text>}
          </g>
        );
      })}
      <rect x="10" y="8" width={totalMm*pxPerMm} height="7" rx="2" fill="#FBBF24" opacity="0.9" />
      <polygon points={`${10+totalMm*pxPerMm},5 ${10+totalMm*pxPerMm-4},0 ${10+totalMm*pxPerMm+4},0`} fill="#ef4444" />
    </svg>
  );
}

function ConversionDiagram({ from, to, fromVal, toVal }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', padding:'12px', background:'rgba(93,63,211,0.15)', borderRadius:'10px' }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', fontWeight:700 }}>{from}</p>
        <p style={{ fontSize:'28px', fontWeight:900, color:'#f5a623' }}>{fromVal}</p>
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)' }}>× 100 →</p>
        <p style={{ fontSize:'24px' }}>↔</p>
        <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)' }}>← ÷ 100</p>
      </div>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', fontWeight:700 }}>{to}</p>
        <p style={{ fontSize:'28px', fontWeight:900, color:'#22c55e' }}>{toVal}</p>
      </div>
    </div>
  );
}

function EstimationDiagram({ emoji, name, benchmarks }) {
  return (
    <div style={{ textAlign:'center', padding:'12px', background:'rgba(93,63,211,0.15)', borderRadius:'10px' }}>
      <p style={{ fontSize:'48px', marginBottom:'4px' }}>{emoji}</p>
      <p style={{ fontSize:'14px', fontWeight:800, color:'white', marginBottom:'8px' }}>{name}</p>
      <div style={{ display:'flex', justifyContent:'center', gap:'8px', flexWrap:'wrap' }}>
        {benchmarks.map(b => (
          <span key={b} style={{ fontSize:'11px', background:'rgba(255,255,255,0.08)', borderRadius:'6px', padding:'3px 8px', color:'rgba(255,255,255,0.7)', fontWeight:700 }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

function WordProblemDiagram({ text, values }) {
  return (
    <div style={{ padding:'12px', background:'rgba(93,63,211,0.15)', borderRadius:'10px' }}>
      <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', marginBottom:'6px', fontWeight:700 }}>📊 Break it down:</p>
      {values.map((v, i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 8px',
          background: i%2===0?'rgba(255,255,255,0.05)':'transparent', borderRadius:'6px', marginBottom:'2px' }}>
          <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', fontWeight:700 }}>{v.label}</span>
          <span style={{ fontSize:'13px', fontWeight:900, color:'#f5a623' }}>{v.val}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// WORLD DEFINITIONS — 10 worlds, 10 questions each = 100 total
// ══════════════════════════════════════════════════════════════════════
function genW1() { // Ruler Meadow — ruler reading + unit selection
  const qs = [];
  const objs=[['pencil','cm',17,3,'✏️'],['eraser','cm',5,5,'🧹'],['crayon','cm',9,0,'🖍️'],['book cover','cm',20,0,'📚'],['paper clip','cm',3,2,'📎']];
  for(let i=0;i<5;i++){
    const [nm,,c,m,em]=objs[i]; const ans=`${c} cm ${m} mm`;
    const opts=sh([ans,`${c+1} cm ${m} mm`,`${c} cm ${(m+3)%10} mm`,`${c-1<1?c+2:c-1} cm ${m} mm`]);
    qs.push({q:`What measurement does the ruler show for the ${nm}?`,opts,ans,hint:`Count big marks = cm (${c}), small marks = mm (${m})`,diagram:<RulerDiagram cm={c} mm={m}/>,type:'ruler'});
  }
  const unitObjs=[['a pencil','cm','✏️'],['a swimming pool','m','🏊'],['a door','m','🚪'],['an ant','mm','🐜'],['a football field','m','⚽']];
  for(let i=0;i<5;i++){
    const [obj,unit,em]=unitObjs[i];
    const opts=sh(['mm','cm','m','km']);
    qs.push({q:`Which unit is best for measuring ${obj} ${em}?`,opts,ans:unit,hint:`Think about how big ${obj} is. Small things use cm or mm; big things use m.`,diagram:<EstimationDiagram emoji={em} name={obj} benchmarks={['1 mm = ant width','1 cm = finger','1 m = door','1 km = road']}/>,type:'unit'});
  }
  return sh(qs).slice(0,10);
}

function genW2() { // Conversion Canyon — m→cm
  return Array.from({length:10},(_,i)=>{
    const m=ri(1,8),c=ri(10,90),ans=m*100+c;
    const opts=sh([ans,ans+10,ans-10,ans+100]).filter(x=>x>0).slice(0,4).map(String);
    return{q:`${m} m ${c} cm = _____ cm`,opts,ans:String(ans),hint:`Multiply: ${m} × 100 = ${m*100}, then add ${c}. Total = ${ans} cm`,diagram:<ConversionDiagram from="metres" to="centimetres" fromVal={`${m} m ${c} cm`} toVal={`${ans} cm`}/>,type:'convert'};
  });
}

function genW3() { // Estimation Island
  const items=[['pencil','✏️',17,50],['textbook','📖',30,60],['shoe','👟',24,50],['hand span','🤚',18,40],['desk height','🪑',75,120],['water bottle','🍼',25,50],['door height','🚪',200,250],['arm length','💪',60,100],['crayon','🖍️',9,20],['finger width','☝️',1,5]];
  return items.map(([nm,em,actual,max])=>{
    const wrong1=actual+ri(5,15),wrong2=actual-ri(5,12),wrong3=actual+ri(15,25);
    const opts=sh([actual,wrong1,wrong2<1?wrong3+5:wrong2,wrong3]).slice(0,4).map(x=>`${x} cm`);
    return{q:`Estimate the length of ${nm} ${em}`,opts,ans:`${actual} cm`,hint:`Use benchmarks: finger ≈ 1 cm, hand ≈ 15 cm, forearm ≈ 30 cm, door ≈ 200 cm`,diagram:<EstimationDiagram emoji={em} name={nm} benchmarks={['☝️ 1 cm','🤚 15 cm','💪 30 cm','🚪 200 cm']}/>,type:'estimate'};
  });
}

function genW4() { // Metre Mountain — mixed unit maths
  return Array.from({length:10},(_,i)=>{
    const m=ri(1,5),c=ri(5,95),total=m*100+c;
    if(i%2===0){
      const opts=sh([total,total+5,total-5,total+50]).filter(x=>x>0).slice(0,4).map(String);
      return{q:`Convert ${m} m ${c} cm to centimetres`,opts,ans:String(total),hint:`${m} m = ${m*100} cm, plus ${c} cm = ${total} cm`,diagram:<ConversionDiagram from={`${m} m ${c} cm`} to="cm" fromVal={`${m} m ${c} cm`} toVal={`${total} cm`}/>,type:'convert'};
    }else{
      const tm=ri(100,900);const mm=Math.floor(tm/100),rm=tm%100;const ans=`${mm} m ${rm} cm`;
      const opts=sh([ans,`${mm+1} m ${rm} cm`,`${mm} m ${rm+10} cm`,`${mm-1<0?mm+1:mm-1} m ${rm} cm`]);
      return{q:`Convert ${tm} cm to metres and centimetres`,opts,ans,hint:`Divide: ${tm} ÷ 100 = ${mm} m, remainder ${rm} cm`,diagram:<ConversionDiagram from="cm" to="m + cm" fromVal={`${tm} cm`} toVal={ans}/>,type:'convert'};
    }
  });
}

function genW5() { // Comparison Creek
  return Array.from({length:10},(_,i)=>{
    const n1=rn(),n2=rn();
    if(i%3===0){
      const a=ri(80,200),b=ri(80,200);
      const opts=[`${a} cm`,`${b} cm`];
      const ans=`${Math.max(a,b)} cm`;
      return{q:`Who jumped further?\n${n1}: ${a} cm or ${n2}: ${b} cm?`,opts:sh(opts),ans,hint:`Compare the numbers. ${Math.max(a,b)} > ${Math.min(a,b)}, so ${a>b?n1:n2} jumped further.`,diagram:<WordProblemDiagram text="" values={[{label:n1,val:`${a} cm`},{label:n2,val:`${b} cm`},{label:'Larger =',val:`${Math.max(a,b)} cm`}]}/>,type:'compare'};
    }else{
      const m=ri(1,3),c=ri(10,90),totalCm=m*100+c;
      const other=ri(50,300);
      const ans=totalCm>other?`${m} m ${c} cm`:`${other} cm`;
      const opts=sh([`${m} m ${c} cm`,`${other} cm`]);
      return{q:`Which is longer: ${m} m ${c} cm or ${other} cm?`,opts,ans,hint:`Convert ${m} m ${c} cm = ${totalCm} cm. Compare ${totalCm} vs ${other}.`,diagram:<WordProblemDiagram text="" values={[{label:`${m} m ${c} cm =`,val:`${totalCm} cm`},{label:'Compare with',val:`${other} cm`},{label:'Longer =',val:ans}]}/>,type:'compare'};
    }
  });
}

function genW6() { // Word Problem Woods
  return Array.from({length:10},(_,i)=>{
    const name=rn(); const a=ri(20,80); const b=ri(10,50);
    if(i%2===0){
      const ans=a+b;
      const opts=sh([ans,ans+10,ans-5,ans+5]).filter(x=>x>0).slice(0,4).map(String);
      return{q:`${name} has two pieces of ribbon.\nOne is ${a} cm and the other is ${b} cm.\nHow long are they altogether?`,opts,ans:String(ans),hint:`Add: ${a} + ${b} = ${ans} cm`,diagram:<WordProblemDiagram text="" values={[{label:'Ribbon 1',val:`${a} cm`},{label:'Ribbon 2',val:`${b} cm`},{label:'Total',val:`${ans} cm`}]}/>,type:'word'};
    }else{
      const total=ri(50,130),cut=ri(10,45);
      const ans2=total-cut;
      const opts2=sh([ans2,ans2+10,ans2-10,ans2+5]).filter(x=>x>0).slice(0,4).map(String);
      return{q:`${name} had ${total} cm of string.\nShe used ${cut} cm.\nHow much string is left?`,opts:opts2,ans:String(ans2),hint:`Subtract: ${total} - ${cut} = ${ans2} cm`,diagram:<WordProblemDiagram text="" values={[{label:'Started with',val:`${total} cm`},{label:'Used',val:`${cut} cm`},{label:'Left',val:`${ans2} cm`}]}/>,type:'word'};
    }
  });
}

function genW7() { // Conversion Castle — advanced both ways
  return Array.from({length:10},(_,i)=>{
    if(i<5){
      const m=ri(2,9); const ans=m*100;
      const opts=sh([ans,ans+10,ans+100,ans-100]).filter(x=>x>0).slice(0,4).map(String);
      return{q:`${m} metres = _____ centimetres`,opts,ans:String(ans),hint:`${m} × 100 = ${ans}`,diagram:<ConversionDiagram from="m" to="cm" fromVal={`${m} m`} toVal={`${ans} cm`}/>,type:'convert'};
    }else{
      const total=ri(100,900); const m=Math.floor(total/100),r=total%100;
      const ans=`${m} m ${r} cm`;
      const opts=sh([ans,`${m+1} m ${r} cm`,`${m} m ${r+10} cm`,`${m-1<0?m+1:m-1} m ${r} cm`]);
      return{q:`${total} centimetres = _____ m _____ cm`,opts,ans,hint:`${total} ÷ 100 = ${m} m, remainder ${r} cm`,diagram:<ConversionDiagram from="cm" to="m + cm" fromVal={`${total} cm`} toVal={ans}/>,type:'convert'};
    }
  });
}

function genW8() { // Perimeter Plaza
  const shapes=[
    {name:'square',sides:[5,5,5,5],emoji:'🔲'},
    {name:'rectangle',sides:[8,4,8,4],emoji:'▬'},
    {name:'triangle',sides:[6,7,8],emoji:'🔺'},
    {name:'square',sides:[10,10,10,10],emoji:'🔲'},
    {name:'rectangle',sides:[12,5,12,5],emoji:'▬'},
    {name:'triangle',sides:[9,9,9],emoji:'🔺'},
    {name:'rectangle',sides:[15,3,15,3],emoji:'▬'},
    {name:'square',sides:[7,7,7,7],emoji:'🔲'},
    {name:'triangle',sides:[10,12,8],emoji:'🔺'},
    {name:'rectangle',sides:[20,6,20,6],emoji:'▬'},
  ];
  return shapes.map(s=>{
    const ans=s.sides.reduce((a,b)=>a+b,0);
    const opts=sh([ans,ans+2,ans-2,ans+4]).filter(x=>x>0).slice(0,4).map(x=>`${x} cm`);
    return{q:`Find the perimeter of the ${s.name} ${s.emoji}.\nSides: ${s.sides.join(' cm, ')} cm`,opts,ans:`${ans} cm`,hint:`Add all sides: ${s.sides.join(' + ')} = ${ans} cm`,diagram:<WordProblemDiagram text="" values={s.sides.map((v,i)=>({label:`Side ${i+1}`,val:`${v} cm`})).concat([{label:'Perimeter',val:`${ans} cm`}])}/>,type:'perimeter'};
  });
}

function genW9() { // Mixed Mastery — blend of all types
  const pool=[];
  pool.push(...genW2().slice(0,3));
  pool.push(...genW5().slice(0,3));
  pool.push(...genW6().slice(0,2));
  pool.push(...genW3().slice(0,2));
  return sh(pool).slice(0,10);
}

function genW10() { // Length Legend Challenge — hardest
  return Array.from({length:10},(_,i)=>{
    const name=rn();
    if(i<4){
      const m1=ri(1,4),c1=ri(10,90),m2=ri(1,3),c2=ri(10,90);
      const total=(m1*100+c1)+(m2*100+c2); const rm=Math.floor(total/100),rc=total%100;
      const ans=`${rm} m ${rc} cm`;
      const opts=sh([ans,`${rm+1} m ${rc} cm`,`${rm} m ${rc+10} cm`,`${rm-1<0?rm+1:rm-1} m ${rc} cm`]);
      return{q:`${name} walked ${m1} m ${c1} cm then ${m2} m ${c2} cm.\nWhat is the total distance?`,opts,ans,hint:`Convert: ${m1*100+c1} + ${m2*100+c2} = ${total} cm = ${rm} m ${rc} cm`,diagram:<WordProblemDiagram text="" values={[{label:'Walk 1',val:`${m1} m ${c1} cm`},{label:'Walk 2',val:`${m2} m ${c2} cm`},{label:'Total',val:ans}]}/>,type:'advanced'};
    }else{
      const total=ri(200,500),cut1=ri(50,100),cut2=ri(30,80);
      const left=total-cut1-cut2; const ans=left>0?`${left} cm`:`${total-cut1} cm`;
      const opts=sh([ans,`${left+10} cm`,`${left-10} cm`,`${left+20} cm`]).filter(x=>x!==`${left} cm`||true).slice(0,4);
      return{q:`A rope is ${total} cm long.\n${name} cuts off ${cut1} cm, then ${cut2} cm.\nHow much is left?`,opts,ans,hint:`${total} - ${cut1} - ${cut2} = ${left} cm`,diagram:<WordProblemDiagram text="" values={[{label:'Original',val:`${total} cm`},{label:'Cut 1',val:`${cut1} cm`},{label:'Cut 2',val:`${cut2} cm`},{label:'Remaining',val:ans}]}/>,type:'advanced'};
    }
  });
}

const WORLDS = [
  { id:1,  name:'Ruler Meadow',        emoji:'📏', sub:'Ruler reading & unit selection', color:'#3b82f6', generate:genW1  },
  { id:2,  name:'Conversion Canyon',   emoji:'🔄', sub:'Metres to centimetres',          color:'#a855f7', generate:genW2  },
  { id:3,  name:'Estimation Island',   emoji:'🎯', sub:'Estimating lengths',             color:'#f59e0b', generate:genW3  },
  { id:4,  name:'Metre Mountain',      emoji:'⛰️', sub:'Mixed unit maths',               color:'#14b8a6', generate:genW4  },
  { id:5,  name:'Comparison Creek',    emoji:'⚖️', sub:'Compare & order lengths',        color:'#f43f5e', generate:genW5  },
  { id:6,  name:'Word Problem Woods',  emoji:'🌲', sub:'One & two step problems',         color:'#22c55e', generate:genW6  },
  { id:7,  name:'Conversion Castle',   emoji:'🏰', sub:'Advanced unit conversion',       color:'#8b5cf6', generate:genW7  },
  { id:8,  name:'Perimeter Plaza',     emoji:'🔲', sub:'Find perimeters of shapes',      color:'#ec4899', generate:genW8  },
  { id:9,  name:'Mixed Mastery',       emoji:'🌟', sub:'All topics combined',            color:'#f97316', generate:genW9  },
  { id:10, name:'Length Legend',       emoji:'🏆', sub:'Ultimate challenge!',            color:'#f5a623', generate:genW10 },
];

// ══════════════════════════════════════════════════════════════════════
// World Select Screen
// ══════════════════════════════════════════════════════════════════════
function WorldSelect({ onSelect, worldUnlocked }) {
  return (
    <div className="anim-fadeIn" style={{ width:'100%', maxWidth:'560px' }}>
      <div style={{ textAlign:'center', marginBottom:'24px' }}>
        <div style={{ fontSize:'36px', marginBottom:'8px' }}>🏆</div>
        <h2 style={{ fontSize:'26px', fontWeight:900, color:'white', marginBottom:'4px' }}>Choose Your World!</h2>
        <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>Beat each world to unlock the next. 10 questions per world!</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', overflowY:'auto', maxHeight:'calc(100vh - 260px)' }}>
        {WORLDS.map(w => {
          const unlocked = w.id <= worldUnlocked;
          return (
            <div key={w.id} className={`world-row ${unlocked?'unlocked':'locked'}`}
              onClick={() => unlocked && onSelect(w)}>
              <div style={{ width:'42px', height:'42px', borderRadius:'50%', flexShrink:0,
                background: unlocked ? w.color : 'rgba(255,255,255,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>
                {unlocked ? w.emoji : '🔒'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <p style={{ fontSize:'15px', fontWeight:800, color: unlocked?'white':'rgba(255,255,255,0.3)', margin:0 }}>
                    {w.id}. {w.name}
                  </p>
                  {unlocked && <span style={{ fontSize:'11px', background:`${w.color}25`, border:`1px solid ${w.color}50`, borderRadius:'999px', padding:'2px 8px', color:w.color, fontWeight:700 }}>10 Qs</span>}
                </div>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:600, margin:0 }}>{w.sub}</p>
              </div>
              {unlocked && <button className="btn-green" style={{ flexShrink:0, fontSize:'12px', padding:'7px 18px' }}>▶ PLAY</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Answer popup overlays — correct / wrong
// Auto-dismiss after 1 second, no button, matches reference screenshots
// ══════════════════════════════════════════════════════════════════════
function CorrectPop({ onNext, explanation }) {
  // Auto-dismiss after 1 second
  React.useEffect(() => {
    const t = setTimeout(onNext, 1000);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        background: '#22c55e',
        borderRadius: '20px',
        padding: '32px 36px',
        textAlign: 'center',
        minWidth: '220px',
        maxWidth: '300px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '10px', lineHeight: 1 }}>🎉</div>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: 'white', margin: '0 0 6px' }}>
          Correct! 🎉
        </h3>
        {explanation && (
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: 0 }}>
            {explanation}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function WrongPop({ correctAnswer, onNext }) {
  // Auto-dismiss after 1 second
  React.useEffect(() => {
    const t = setTimeout(onNext, 1000);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        background: '#ef4444',
        borderRadius: '20px',
        padding: '32px 36px',
        textAlign: 'center',
        minWidth: '220px',
        maxWidth: '300px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '10px', lineHeight: 1 }}>😢</div>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: 'white', margin: '0 0 6px' }}>
          Not quite!
        </h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, margin: 0 }}>
          Correct answer: {correctAnswer}
        </p>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// GamePlay — test mode (no hearts, auto-advance popups)
// ══════════════════════════════════════════════════════════════════════
function GamePlay({ world, onFinish }) {
  const { audioEnabled } = useAudio();
  const questions = useMemo(() => world.generate(), [world.id]);
  const [qIdx, setQIdx]       = useState(0);
  const [stars, setStars]     = useState(0);
  const [streak, setStreak]   = useState(1);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked]   = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint]   = useState(false);
  const [popup, setPopup]     = useState(null); // 'correct' | 'wrong'

  const q = questions[qIdx];
  const progress = (qIdx / questions.length) * 100;

  const handleNext = useCallback(() => {
    setPopup(null);
    if (qIdx >= questions.length - 1) {
      onFinish({
        stars,
        correct,
        total: questions.length,
        passed: true,
      });
      return;
    }
    setQIdx(i => i + 1);
    setPicked(null);
    setIsCorrect(null);
    setShowHint(false);
  }, [qIdx, questions.length, onFinish, stars, correct]);

  const handlePick = useCallback((opt) => {
    if (picked) return;
    const ok = opt === q.ans;
    setPicked(opt);
    setIsCorrect(ok);
    setShowHint(false);
    if (ok) {
      setStars(s => s + streak);
      setStreak(s => Math.min(s + 1, 5));
      setCorrect(c => c + 1);
    } else {
      setStreak(1);
    }
    stopNarration();
    if (audioEnabled) narrate(ok ? playCorrectNarration() : playWrongNarration(), true);
    setPopup(ok ? 'correct' : 'wrong');
  }, [picked, q, streak, audioEnabled]);

  return (
    <div style={{ width: '100%', maxWidth: '560px', position: 'relative' }}>
      <AnimatePresence>
        {popup === 'correct' && (
          <CorrectPop
            onNext={handleNext}
            explanation={`${q.ans}`}
          />
        )}
        {popup === 'wrong' && (
          <WrongPop
            correctAnswer={q.ans}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      {/* World label */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <span style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '999px', padding: '5px 16px', fontSize: '13px', fontWeight: 800, color: 'white',
        }}>
          {world.emoji} {world.name}
        </span>
      </div>

      {/* HUD — no hearts */}
      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px', padding: '10px 16px', marginBottom: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '16px' }}>⭐</span>
          <span style={{ fontSize: '17px', fontWeight: 900, color: 'white' }}>{stars}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '14px' }}>🔥</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#f97316' }}>{streak}x</span>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
          ✅ {correct}/{questions.length}
        </span>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '5px' }}>
        <span>Q {qIdx + 1}/{questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '5px', marginBottom: '16px' }}>
        <motion.div animate={{ width: `${progress}%` }} style={{ height: '5px', background: '#f5a623', borderRadius: '999px' }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={qIdx}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}
          style={{
            background: 'rgba(93,63,211,0.2)', border: '1px solid rgba(93,63,211,0.35)',
            borderRadius: '16px', padding: '20px', marginBottom: '14px',
          }}>

          {/* Diagram */}
          {q.diagram && (
            <div style={{ marginBottom: '14px' }}>{q.diagram}</div>
          )}

          <p style={{
            fontSize: '18px', fontWeight: 900, color: 'white', lineHeight: 1.45,
            marginBottom: '16px', textAlign: 'center', whiteSpace: 'pre-line',
          }}>
            {q.q}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {q.opts.map(opt => {
              let bg = 'rgba(93,63,211,0.3)'; let border = 'rgba(93,63,211,0.5)';
              if (picked) {
                if (opt === q.ans)    { bg = 'rgba(34,197,94,0.3)';  border = '#22c55e'; }
                else if (opt === picked) { bg = 'rgba(239,68,68,0.3)'; border = '#ef4444'; }
              }
              return (
                <button key={opt}
                  onClick={() => handlePick(opt)}
                  disabled={!!picked}
                  style={{
                    background: bg, border: `2px solid ${border}`,
                    borderRadius: '12px', padding: '16px 8px',
                    fontSize: '18px', fontWeight: 800, color: 'white',
                    cursor: picked ? 'default' : 'pointer',
                    transition: 'all 0.15s', textAlign: 'center',
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Hint button */}
          {!picked && (
            <button onClick={() => setShowHint(s => !s)}
              style={{
                marginTop: '12px', width: '100%',
                background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)',
                borderRadius: '10px', padding: '8px', fontSize: '13px', fontWeight: 700,
                color: 'rgba(245,166,35,0.8)', cursor: 'pointer',
              }}>
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
          {showHint && !picked && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '8px', background: 'rgba(245,166,35,0.1)',
                border: '1px solid rgba(245,166,35,0.3)', borderRadius: '10px',
                padding: '10px', fontSize: '13px', fontWeight: 700,
                color: 'rgba(255,255,255,0.85)', textAlign: 'center',
              }}>
              {q.hint}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// World Results
// ══════════════════════════════════════════════════════════════════════
function WorldResults({ result, world, onRetry, onNext, isLast }) {
  const pct = Math.round((result.correct / result.total) * 100);
  return (
    <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
      style={{ textAlign:'center', maxWidth:'420px', width:'100%' }}>
      <div style={{ fontSize:'64px', marginBottom:'12px' }}>{pct>=80?'🏆':pct>=60?'🌟':'💪'}</div>
      <h2 style={{ fontSize:'26px', fontWeight:900, color:'white', marginBottom:'8px' }}>
        {pct>=80?'World Complete!':pct>=60?'Good Effort!':'Keep Practising!'}
      </h2>

      {/* Score card */}
      <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:'14px', padding:'20px', marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'16px' }}>
          {[
            { icon:'✅', val:`${result.correct}/${result.total}`, label:'Correct' },
            { icon:'⭐', val:result.stars, label:'Stars' },
            { icon:'🎯', val:`${pct}%`, label:'Score' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <span style={{ fontSize:'24px' }}>{s.icon}</span>
              <p style={{ fontSize:'22px', fontWeight:900, color:'#f5a623', margin:'4px 0 0' }}>{s.val}</p>
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'999px', height:'8px' }}>
          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.2, ease:'easeOut'}}
            style={{ height:'8px', background: pct>=80?'#22c55e':pct>=60?'#f5a623':'#ef4444', borderRadius:'999px' }} />
        </div>
      </div>

      <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
        <button className="btn-ghost" onClick={onRetry}>↺ Retry</button>
        {result.passed && !isLast && (
          <button className="btn-yellow" onClick={onNext}>Next World →</button>
        )}
        {result.passed && isLast && (
          <button className="btn-yellow" onClick={onNext}>🎓 See Results →</button>
        )}
        {!result.passed && (
          <button className="btn-yellow" onClick={onRetry}>Try Again</button>
        )}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN Play page
// ══════════════════════════════════════════════════════════════════════
export default function Play() {
  const navigate = useNavigate();
  const { worldUnlocked, unlockWorld, addStars, addXP, markDone, recordWorldScore } = useGame();
  const { audioEnabled } = useAudio();
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelect = useCallback((w) => {
    stopNarration();
    if (audioEnabled) narrate(playWorldNarration(w.id), true);
    setSelectedWorld(w); setResult(null);
  }, [audioEnabled]);

  const handleFinish = useCallback((res) => {
    setResult(res);
    addStars(res.stars); addXP(res.stars * 10);
    recordWorldScore({ worldId: selectedWorld.id, worldName: selectedWorld.name, correct: res.correct, total: res.total, stars: res.stars });
    if (res.passed) unlockWorld(selectedWorld.id + 1);
  }, [selectedWorld, addStars, addXP, recordWorldScore, unlockWorld]);

  const handleNext = useCallback(() => {
    if (selectedWorld?.id >= WORLDS.length) {
      markDone('play'); navigate('/reflect');
    } else {
      setSelectedWorld(null); setResult(null);
    }
  }, [selectedWorld, markDone, navigate]);

  return (
    <div className="page-bg min-h-screen relative z-10">
      <TopNav />
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'68px 16px 16px' }}>
        {!selectedWorld && <WorldSelect worldUnlocked={worldUnlocked} onSelect={handleSelect} />}
        {selectedWorld && !result && <GamePlay world={selectedWorld} onFinish={handleFinish} />}
        {result && <WorldResults result={result} world={selectedWorld} onRetry={() => {setResult(null);}} onNext={handleNext} isLast={selectedWorld?.id >= WORLDS.length} />}
      </div>
    </div>
  );
}
