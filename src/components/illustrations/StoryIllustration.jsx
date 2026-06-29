import React from 'react';

/* 
  Each slide gets a unique, detailed inline SVG illustration.
  These replace external images — drawn in the style of the reference 
  app's cartoon classroom scenes.
*/

function SlideOne() {
  // Emma and Oliver in a library discovering the map — cartoonish, colourful
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
      {/* Sky/room background */}
      <defs>
        <linearGradient id="roomBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d1b6b" />
          <stop offset="100%" stopColor="#1a3a5c" />
        </linearGradient>
        <linearGradient id="woodFloor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#6B3F20" />
        </linearGradient>
      </defs>

      <rect width="400" height="220" fill="url(#roomBg)" />

      {/* Bookshelf back wall */}
      <rect x="0" y="0" width="400" height="160" fill="#1e1245" />
      {/* Shelf boards */}
      {[40, 85, 130].map(y => (
        <g key={y}>
          <rect x="0" y={y} width="400" height="7" fill="#5c3d20" />
          {[12, 44, 72, 106, 140, 172, 210, 248, 280, 320, 355].map((x, j) => (
            <rect key={j} x={x} y={y - 28 + (j % 3) * 4} width={22 + (j % 4) * 6} height={22 + (j % 3) * 6}
              rx="2" fill={['#e53e3e','#3182ce','#38a169','#d69e2e','#805ad5','#dd6b20','#e53e3e','#2b6cb0'][j % 8]}
              opacity="0.85" />
          ))}
        </g>
      ))}

      {/* Window */}
      <rect x="310" y="10" width="70" height="90" rx="6" fill="#1a4a6b" stroke="#4a9fd4" strokeWidth="2" />
      <line x1="345" y1="10" x2="345" y2="100" stroke="#4a9fd4" strokeWidth="1.5" />
      <line x1="310" y1="55" x2="380" y2="55" stroke="#4a9fd4" strokeWidth="1.5" />
      {/* Moon in window */}
      <circle cx="357" cy="38" r="12" fill="#FEF3C7" opacity="0.9" />
      <circle cx="362" cy="34" r="10" fill="#1a4a6b" opacity="0.8" />

      {/* Floor */}
      <rect x="0" y="160" width="400" height="60" fill="url(#woodFloor)" />
      {[0,1,2,3].map(i => <line key={i} x1={i*100} y1="160" x2={i*100+100} y2="220" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />)}

      {/* Table */}
      <rect x="100" y="148" width="200" height="14" rx="3" fill="#8B5E3C" />
      <rect x="112" y="162" width="14" height="30" fill="#7B4E2C" />
      <rect x="274" y="162" width="14" height="30" fill="#7B4E2C" />

      {/* Glowing treasure map on table */}
      <rect x="145" y="130" width="110" height="24" rx="4" fill="#FEF3C7" stroke="#f5a623" strokeWidth="2" />
      <ellipse cx="200" cy="142" rx="35" ry="6" fill="#f5a623" opacity="0.25" />
      <text x="200" y="146" textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold">📜 TREASURE MAP</text>

      {/* Candle */}
      <rect x="272" y="132" width="9" height="18" rx="2" fill="#FEF9C3" />
      <ellipse cx="276" cy="130" rx="5" ry="7" fill="#f97316" opacity="0.9" />
      <ellipse cx="276" cy="130" rx="2" ry="4" fill="#fde68a" />

      {/* Emma character (girl, pink top, dark hair with headband) */}
      <g transform="translate(130,90)">
        {/* Body */}
        <rect x="-16" y="30" width="32" height="40" rx="8" fill="#ec4899" />
        {/* Legs */}
        <rect x="-12" y="68" width="10" height="22" rx="4" fill="#fde68a" />
        <rect x="2"   y="68" width="10" height="22" rx="4" fill="#fde68a" />
        {/* Shoes */}
        <ellipse cx="-7"  cy="90" rx="7" ry="4" fill="#1a1040" />
        <ellipse cx="7"   cy="90" rx="7" ry="4" fill="#1a1040" />
        {/* Head */}
        <circle cx="0" cy="18" r="18" fill="#fde68a" />
        {/* Hair */}
        <path d="M-18,14 Q-15,-8 0,-10 Q15,-8 18,14 Q10,-4 0,-5 Q-10,-4 -18,14Z" fill="#1a1040" />
        {/* Headband */}
        <path d="M-18,14 Q0,8 18,14" stroke="#ec4899" strokeWidth="3" fill="none" />
        {/* Eyes */}
        <circle cx="-6" cy="18" r="3" fill="#1a1040" />
        <circle cx="6"  cy="18" r="3" fill="#1a1040" />
        <circle cx="-5" cy="17" r="1" fill="white" />
        <circle cx="7"  cy="17" r="1" fill="white" />
        {/* Smile */}
        <path d="M-5,26 Q0,30 5,26" stroke="#1a1040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Arm pointing at map */}
        <path d="M14,40 Q35,45 50,50" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>

      {/* Oliver character (boy, blue shirt, lighter skin) */}
      <g transform="translate(260,88)">
        {/* Body */}
        <rect x="-16" y="30" width="32" height="42" rx="8" fill="#3b82f6" />
        {/* Legs */}
        <rect x="-12" y="70" width="10" height="22" rx="4" fill="#93c5fd" />
        <rect x="2"   y="70" width="10" height="22" rx="4" fill="#93c5fd" />
        {/* Shoes */}
        <ellipse cx="-7"  cy="92" rx="7" ry="4" fill="#1a1040" />
        <ellipse cx="7"   cy="92" rx="7" ry="4" fill="#1a1040" />
        {/* Head */}
        <circle cx="0" cy="18" r="17" fill="#fde68a" />
        {/* Hair (brown, tousled) */}
        <path d="M-17,12 Q-10,-6 0,-8 Q10,-6 17,12 Q8,0 0,2 Q-8,0 -17,12Z" fill="#92400e" />
        {/* Eyes */}
        <circle cx="-5" cy="18" r="3" fill="#1a1040" />
        <circle cx="5"  cy="18" r="3" fill="#1a1040" />
        <circle cx="-4" cy="17" r="1" fill="white" />
        <circle cx="6"  cy="17" r="1" fill="white" />
        {/* Excited mouth */}
        <path d="M-5,25 Q0,31 5,25" stroke="#1a1040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Arm */}
        <path d="M-14,40 Q-35,44 -50,48" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>

      {/* ✨ sparkles near map */}
      <text x="170" y="125" fontSize="12">✨</text>
      <text x="215" y="122" fontSize="10">✦</text>
      <text x="230" y="128" fontSize="12">✨</text>
    </svg>
  );
}

function SlideTwo() {
  // Emma measuring a pencil with a ruler — bright classroom scene
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
      <defs>
        <linearGradient id="classroomBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f2a4a" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#classroomBg)" />

      {/* Chalkboard */}
      <rect x="30" y="20" width="220" height="120" rx="6" fill="#1a472a" stroke="#5c8a6a" strokeWidth="2" />
      {/* Chalk writing on board */}
      <text x="140" y="55"  textAnchor="middle" fontSize="14" fill="white" fontWeight="bold" fontFamily="serif">10 mm = 1 cm</text>
      <text x="140" y="80"  textAnchor="middle" fontSize="13" fill="#FCD34D" fontWeight="bold">100 cm = 1 m</text>
      <text x="140" y="105" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)">Always start from 0!</text>
      <line x1="50" y1="130" x2="230" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Desk */}
      <rect x="60" y="160" width="280" height="12" rx="3" fill="#8B5E3C" />
      <rect x="80"  y="172" width="12" height="28" fill="#7B4E2C" />
      <rect x="308" y="172" width="12" height="28" fill="#7B4E2C" />

      {/* Giant ruler on desk */}
      <rect x="70" y="144" width="260" height="18" rx="4" fill="#FEF3C7" stroke="#f5a623" strokeWidth="1.5" />
      {Array.from({ length: 27 }, (_, mm) => {
        const x = 78 + mm * 9.6;
        const isCm = mm % 10 === 0;
        const isFive = mm % 5 === 0;
        const h = isCm ? 12 : isFive ? 8 : 4;
        return (
          <g key={mm}>
            <line x1={x} y1={162} x2={x} y2={162 - h} stroke="#92400e" strokeWidth={isCm ? 1.5 : 0.8} />
            {isCm && <text x={x} y={141} textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">{mm / 10}</text>}
          </g>
        );
      })}

      {/* Pencil on ruler */}
      <rect x="78" y="140" width="134" height="6" rx="3" fill="#FBBF24" stroke="#92400e" strokeWidth="1" />
      <polygon points="212,140 212,146 220,143" fill="#ff6b35" />
      <rect x="78" y="140" width="8" height="6" rx="1" fill="#C0C0C0" />

      {/* Sam (carpenter) character — right side */}
      <g transform="translate(340,80)">
        <circle cx="0" cy="0"  r="20" fill="#fde68a" />
        <path d="M-20,-6 Q-12,-18 0,-20 Q12,-18 20,-6 Q10,-10 0,-8 Q-10,-10 -20,-6Z" fill="#92400e" />
        {/* Hard hat */}
        <path d="M-18,-6 Q0,-22 18,-6" fill="#FBBF24" />
        <rect x="-20" y="-8" width="40" height="5" rx="2" fill="#f5a623" />
        <circle cx="-8" cy="2" r="3" fill="#1a1040" />
        <circle cx="8"  cy="2" r="3" fill="#1a1040" />
        <path d="M-5,10 Q0,14 5,10" stroke="#1a1040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Body */}
        <rect x="-18" y="20" width="36" height="40" rx="8" fill="#f97316" />
        {/* Tool belt */}
        <rect x="-18" y="44" width="36" height="6" fill="#92400e" />
        <text x="-4" y="50" fontSize="8">🔨</text>
      </g>

      {/* Speech bubble from Sam */}
      <rect x="270" y="30" width="110" height="36" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="325" y="48" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">Always start</text>
      <text x="325" y="60" textAnchor="middle" fontSize="10" fill="#FCD34D" fontWeight="800">from ZERO! 📏</text>
      <polygon points="325,66 318,72 332,72" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function SlideThree() {
  // Oliver and Lily in a magical garden measuring a giant sunflower
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0e4d8a" />
          <stop offset="100%" stopColor="#1a6b3c" />
        </linearGradient>
        <radialGradient id="sunGrad">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="url(#skyGrad)" />

      {/* Sun */}
      <circle cx="340" cy="35" r="28" fill="url(#sunGrad)" opacity="0.9" />
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <line key={i}
          x1={340 + Math.cos(a*Math.PI/180)*30} y1={35 + Math.sin(a*Math.PI/180)*30}
          x2={340 + Math.cos(a*Math.PI/180)*40} y2={35 + Math.sin(a*Math.PI/180)*40}
          stroke="#fbbf24" strokeWidth="2.5" />
      ))}

      {/* Ground */}
      <ellipse cx="200" cy="195" rx="200" ry="30" fill="#166534" />
      <rect x="0" y="190" width="400" height="30" fill="#15803d" />

      {/* Giant sunflower */}
      <rect x="190" y="60" width="12" height="140" rx="4" fill="#22c55e" />
      {/* Leaves */}
      <ellipse cx="170" cy="120" rx="20" ry="10" fill="#16a34a" transform="rotate(-20,170,120)" />
      <ellipse cx="214" cy="100" rx="18" ry="9" fill="#16a34a" transform="rotate(15,214,100)" />
      {/* Flower head */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx={196 + Math.cos(i*30*Math.PI/180)*26} cy={55 + Math.sin(i*30*Math.PI/180)*26}
          rx="10" ry="5" fill="#fbbf24"
          transform={`rotate(${i*30},${196 + Math.cos(i*30*Math.PI/180)*26},${55 + Math.sin(i*30*Math.PI/180)*26})`} />
      ))}
      <circle cx="196" cy="55" r="18" fill="#92400e" />
      {/* Seeds */}
      {[[-5,-5],[0,-7],[5,-5],[7,0],[5,5],[0,7],[-5,5],[-7,0]].map(([dx,dy],i) => (
        <circle key={i} cx={196+dx} cy={55+dy} r="2" fill="#451a03" />
      ))}

      {/* Metre stick alongside flower */}
      <rect x="215" y="60" width="8" height="100" rx="2" fill="#FEF3C7" stroke="#f5a623" strokeWidth="1" />
      {[0,1,2].map(m => (
        <g key={m}>
          <line x1="215" y1={60 + m*34} x2="223" y2={60 + m*34} stroke="#92400e" strokeWidth="2" />
          <text x="226" y={64 + m*34} fontSize="8" fill="#fcd34d" fontWeight="bold">{m}m</text>
        </g>
      ))}

      {/* Oliver (left) */}
      <g transform="translate(80,130)">
        <circle cx="0" cy="-20" r="18" fill="#fde68a" />
        <path d="M-18,-26 Q0,-38 18,-26" fill="#92400e" />
        <circle cx="-6" cy="-22" r="2.5" fill="#1a1040" />
        <circle cx="6"  cy="-22" r="2.5" fill="#1a1040" />
        <path d="M-4,-14 Q0,-10 4,-14" stroke="#1a1040" strokeWidth="1.5" fill="none" />
        <rect x="-15" y="-2" width="30" height="36" rx="8" fill="#3b82f6" />
        <rect x="-10" y="32" width="8" height="20" rx="4" fill="#93c5fd" />
        <rect x="2"   y="32" width="8" height="20" rx="4" fill="#93c5fd" />
        {/* Arm up pointing at flower */}
        <path d="M14,8 Q40,-10 90,-30" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>

      {/* Lily (right of flower) */}
      <g transform="translate(300,130)">
        <circle cx="0" cy="-20" r="17" fill="#fde68a" />
        <path d="M-17,-26 Q-8,-40 0,-38 Q8,-40 17,-26" fill="#1a1040" />
        <circle cx="-5" cy="-22" r="2.5" fill="#1a1040" />
        <circle cx="5"  cy="-22" r="2.5" fill="#1a1040" />
        <path d="M-3,-13 Q0,-9 3,-13" stroke="#1a1040" strokeWidth="1.5" fill="none" />
        <rect x="-14" y="-2" width="28" height="36" rx="8" fill="#a855f7" />
        <rect x="-10" y="32" width="8" height="20" rx="4" fill="#fde68a" />
        <rect x="2"   y="32" width="8" height="20" rx="4" fill="#fde68a" />
        {/* Notebook */}
        <rect x="-28" y="8" width="16" height="20" rx="2" fill="white" opacity="0.9" />
        <line x1="-26" y1="14" x2="-14" y2="14" stroke="#3b82f6" strokeWidth="1" />
        <line x1="-26" y1="18" x2="-14" y2="18" stroke="#3b82f6" strokeWidth="1" />
        <text x="-24" y="28" fontSize="6" fill="#f5a623" fontWeight="bold">2m!</text>
      </g>

      {/* Labels */}
      <text x="240" y="78"  fontSize="9" fill="#fcd34d" fontWeight="bold">height =</text>
      <text x="240" y="90"  fontSize="10" fill="#fcd34d" fontWeight="900">2m 30cm</text>
    </svg>
  );
}

function SlideFour() {
  // Emma and Noah at a race track with a measuring tape
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
      <defs>
        <linearGradient id="stadiumBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3a5c" />
          <stop offset="100%" stopColor="#0a2010" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#stadiumBg)" />

      {/* Stadium stands */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={i*68} y="10" width="60" height="70" rx="4" fill={`rgba(${[93,63,211][i%2]},${[63,40,100][i%2]},${[211,160,255][i%2]},0.2)`} />
      ))}
      <text x="200" y="55" textAnchor="middle" fontSize="16" fill="white" opacity="0.3" fontWeight="bold">🏟️</text>

      {/* Track lane */}
      <rect x="0" y="140" width="400" height="50" rx="0" fill="#d97706" opacity="0.3" />
      <rect x="0" y="142" width="400" height="2" fill="white" opacity="0.5" />
      <rect x="0" y="186" width="400" height="2" fill="white" opacity="0.5" />
      {/* Lane markings */}
      {[50,100,150,200,250,300,350].map(x => (
        <rect key={x} x={x} y="142" width="2" height="44" rx="1" fill="white" opacity="0.2" />
      ))}

      {/* Measuring tape on ground */}
      <rect x="40" y="168" width="320" height="10" rx="3" fill="#fde68a" stroke="#f5a623" strokeWidth="1" />
      {[0,50,100,150,200,250,300].map((x,i) => (
        <g key={i}>
          <line x1={40+x} y1="168" x2={40+x} y2="162" stroke="#92400e" strokeWidth="2" />
          <text x={40+x} y="160" fontSize="7" fill="#fcd34d" fontWeight="bold" textAnchor="middle">{i}m</text>
        </g>
      ))}

      {/* Emma running (left) */}
      <g transform="translate(100,125)">
        <circle cx="0" cy="-15" r="16" fill="#fde68a" />
        <path d="M-16,-21 Q0,-32 16,-21" fill="#1a1040" />
        <rect x="-3" y="-18" width="6" height="3" rx="1" fill="#ec4899" />
        <circle cx="-5" cy="-17" r="2.5" fill="#1a1040" />
        <circle cx="5"  cy="-17" r="2.5" fill="#1a1040" />
        <path d="M-3,-8 Q0,-4 3,-8" stroke="#1a1040" strokeWidth="1.5" fill="none" />
        <rect x="-12" y="0" width="24" height="30" rx="6" fill="#ec4899" />
        {/* Running legs */}
        <path d="M-8,28 Q-12,44 -6,50" stroke="#fde68a" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M6,28 Q12,36 8,50" stroke="#fde68a" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Jump arrow */}
        <text x="-5" y="-36" fontSize="12">⬆️</text>
      </g>

      {/* Jump arc for Emma */}
      <path d="M100,155 Q130,100 150,135" stroke="#f5a623" strokeWidth="2" strokeDasharray="4,3" fill="none" />
      <text x="140" y="108" fontSize="10" fill="#f5a623" fontWeight="bold">145 cm</text>

      {/* Noah running (right) */}
      <g transform="translate(250,120)">
        <circle cx="0" cy="-15" r="16" fill="#fde68a" />
        <path d="M-16,-21 Q-8,-34 0,-32 Q8,-34 16,-21" fill="#92400e" />
        <circle cx="-5" cy="-17" r="2.5" fill="#1a1040" />
        <circle cx="5"  cy="-17" r="2.5" fill="#1a1040" />
        <path d="M-3,-8 Q0,-4 3,-8" stroke="#1a1040" strokeWidth="1.5" fill="none" />
        <rect x="-12" y="0" width="24" height="30" rx="6" fill="#3b82f6" />
        <path d="M-8,28 Q-15,40 -4,48" stroke="#fde68a" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M6,28 Q14,38 6,48" stroke="#fde68a" strokeWidth="7" strokeLinecap="round" fill="none" />
        <text x="-5" y="-36" fontSize="12">⬆️</text>
      </g>

      <path d="M250,150 Q285,90 310,130" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4,3" fill="none" />
      <text x="292" y="98" fontSize="10" fill="#a78bfa" fontWeight="bold">1m 52cm</text>

      {/* Question banner */}
      <rect x="60" y="198" width="280" height="20" rx="8" fill="rgba(245,166,35,0.25)" stroke="rgba(245,166,35,0.5)" strokeWidth="1" />
      <text x="200" y="212" textAnchor="middle" fontSize="10" fill="#fcd34d" fontWeight="800">
        Who jumped further? Convert to same unit!
      </text>
    </svg>
  );
}

export default function StoryIllustration({ slide = 0 }) {
  const slides = [SlideOne, SlideTwo, SlideThree, SlideFour];
  const Component = slides[slide % slides.length];
  return (
    <div className="story-img w-full" style={{ aspectRatio: '16/9' }}>
      <Component />
    </div>
  );
}
