import React from 'react';
import { useAudio } from '../../context/AudioContext.jsx';
import { stopNarration } from '../../utils/audio.js';

export default function AudioToggle() {
  const { audioEnabled, toggleAudio } = useAudio();

  const handleToggle = () => {
    if (audioEnabled) stopNarration();
    toggleAudio();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-pill bg-white border-2 border-amber-200 hover:border-amber-400 transition-all shadow-sm font-extrabold text-sm"
      aria-label={audioEnabled ? 'Mute narration' : 'Unmute narration'}
      title={audioEnabled ? 'Mute' : 'Unmute'}
    >
      <span className="text-lg">{audioEnabled ? '🔊' : '🔇'}</span>
      <span className="hidden sm:inline text-inkMid">{audioEnabled ? 'Voice' : 'Muted'}</span>
    </button>
  );
}
