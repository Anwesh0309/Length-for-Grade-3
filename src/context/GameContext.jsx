import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export const STEPS = ['wonder', 'story', 'simulate', 'play', 'reflect'];

export function GameProvider({ children }) {
  const [completed, setCompleted] = useState(new Set());      // which steps done
  const [worldUnlocked, setWorldUnlocked] = useState(1);      // worlds 1,2,3
  const [totalXP, setTotalXP] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  const markDone = (step) => setCompleted(prev => new Set([...prev, step]));
  const addXP = (n) => setTotalXP(p => p + n);
  const addStars = (n) => setTotalStars(p => p + n);
  const unlockWorld = (n) => setWorldUnlocked(prev => Math.max(prev, n));

  return (
    <GameContext.Provider value={{
      completed, markDone,
      worldUnlocked, unlockWorld,
      totalXP, addXP,
      totalStars, addStars,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
