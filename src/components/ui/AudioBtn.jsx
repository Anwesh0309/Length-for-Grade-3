import React from 'react';
import { useAudio } from '../../context/AudioContext.jsx';
import { stopNarration } from '../../utils/audio.js';

export default function AudioBtn() {
  const { audioEnabled, toggleAudio } = useAudio();
  return (
    <button
      className="audio-btn"
      onClick={() => { if (audioEnabled) stopNarration(); toggleAudio(); }}
      aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
      title={audioEnabled ? 'Mute' : 'Unmute'}
    >
      {audioEnabled ? '🔊' : '🔇'}
    </button>
  );
}
