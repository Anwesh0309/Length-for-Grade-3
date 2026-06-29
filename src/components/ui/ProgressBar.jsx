import React from 'react';
import { usePhase, PHASES } from '../../context/PhaseContext.jsx';

const PHASE_LABELS = [
  { key: PHASES.WONDER,   label: '🔮 Wonder', icon: '🔮' },
  { key: PHASES.INTRO,    label: '📖 Story',  icon: '📖' },
  { key: PHASES.LEARN,    label: '🧪 Learn',  icon: '🧪' },
  { key: PHASES.REFLECT,  label: '🪞 Reflect',icon: '🪞' },
  { key: PHASES.PRACTICE, label: '🎮 Play',   icon: '🎮' },
];

const PHASE_ORDER = [PHASES.LANDING, PHASES.WONDER, PHASES.INTRO, PHASES.LEARN, PHASES.REFLECT, PHASES.PRACTICE, PHASES.CELEBRATE];

export default function ProgressBar() {
  const { state } = usePhase();
  const currentIndex = PHASE_ORDER.indexOf(state.phase);

  return (
    <div className="flex items-center gap-1 flex-1 mr-4 overflow-x-auto no-scrollbar">
      {PHASE_LABELS.map((p, i) => {
        const phaseIndex = PHASE_ORDER.indexOf(p.key);
        const isDone = phaseIndex < currentIndex;
        const isCurrent = p.key === state.phase;
        return (
          <div key={p.key} className="flex items-center">
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-pill text-xs font-extrabold whitespace-nowrap transition-all
              ${isCurrent ? 'bg-amber-500 text-white shadow-glow scale-105' : ''}
              ${isDone ? 'bg-teal-100 text-teal-700' : ''}
              ${!isCurrent && !isDone ? 'bg-gray-100 text-gray-400' : ''}
            `}>
              <span>{p.icon}</span>
              <span className="hidden sm:inline">{p.label.split(' ')[1]}</span>
            </div>
            {i < PHASE_LABELS.length - 1 && (
              <div className={`w-4 h-0.5 mx-0.5 rounded ${isDone ? 'bg-teal-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
