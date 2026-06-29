import React from 'react';

/* 
  The mascot is a friendly ruler character — a golden ruler with a face.
  Rendered as an SVG inline so it looks sharp at any size and matches 
  the fox-style mascot from the reference (circular avatar with expression).
*/
export default function Mascot({ size = 48, mood = 'happy', className = '' }) {
  const moods = {
    happy:     { eyes: '^^',  mouth: '⌣', bg: '#f5a623' },
    thinking:  { eyes: '~_',  mouth: '…', bg: '#7c3aed' },
    excited:   { eyes: '⊙⊙', mouth: 'D',  bg: '#f5a623' },
    wonder:    { eyes: '??',  mouth: 'o',  bg: '#a78bfa' },
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48"
      className={`flex-shrink-0 ${className}`} aria-hidden="true">
      {/* Circle body */}
      <circle cx="24" cy="24" r="22" fill={moods[mood]?.bg || '#f5a623'} />
      {/* Ruler stripes */}
      <rect x="8"  y="20" width="32" height="8" rx="2" fill="rgba(255,255,255,0.25)" />
      <line x1="14" y1="20" x2="14" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="20" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="26" y1="20" x2="26" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="32" y1="20" x2="32" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="18" cy="15" r="3" fill="white" />
      <circle cx="30" cy="15" r="3" fill="white" />
      <circle cx="19" cy="16" r="1.5" fill="#1a1040" />
      <circle cx="31" cy="16" r="1.5" fill="#1a1040" />
      {/* Smile */}
      <path d="M18 34 Q24 39 30 34" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
