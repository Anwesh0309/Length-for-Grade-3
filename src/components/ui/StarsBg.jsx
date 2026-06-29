import React, { useMemo } from 'react';

const STAR_DATA = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  cx: ((i * 137.508) % 100).toFixed(2),
  cy: ((i * 97.3) % 100).toFixed(2),
  r: ((i % 3) + 1),
  dur: (2 + (i % 5)).toFixed(1),
  delay: ((i * 0.29) % 4).toFixed(2),
  opacity: (0.15 + (i % 4) * 0.15).toFixed(2),
}));

// A handful of larger accent dots (coloured)
const ACCENTS = [
  { cx: 8,  cy: 15, r: 3, color: '#f5a623', dur: 4 },
  { cx: 92, cy: 12, r: 2, color: '#7c3aed', dur: 3.5 },
  { cx: 15, cy: 85, r: 2, color: '#f5a623', dur: 5 },
  { cx: 85, cy: 80, r: 3, color: '#a78bfa', dur: 4.5 },
  { cx: 50, cy: 5,  r: 2, color: '#f5a623', dur: 3 },
  { cx: 72, cy: 92, r: 2, color: '#7c3aed', dur: 6 },
];

export default function StarsBg() {
  return (
    <svg
      className="stars-layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {STAR_DATA.map(s => (
        <circle key={s.id} cx={`${s.cx}%`} cy={`${s.cy}%`} r={`${s.r * 0.15}%`}
          fill="white" opacity={s.opacity}>
          <animate attributeName="opacity"
            values={`${s.opacity};${Math.min(1, parseFloat(s.opacity) + 0.6)};${s.opacity}`}
            dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {ACCENTS.map((a, i) => (
        <circle key={`a${i}`} cx={`${a.cx}%`} cy={`${a.cy}%`} r="0.35%" fill={a.color} opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.9;0.3"
            dur={`${a.dur}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
