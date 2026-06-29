import React, { createContext, useContext, useState } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleAudio = () => setAudioEnabled(prev => !prev);

  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
