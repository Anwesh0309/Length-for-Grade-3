import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export const STEPS = ['wonder', 'story', 'simulate', 'play', 'reflect'];

export function GameProvider({ children }) {
  const [completed, setCompleted]       = useState(new Set());
  const [worldUnlocked, setWorldUnlocked] = useState(1);
  const [totalXP, setTotalXP]           = useState(0);
  const [totalStars, setTotalStars]     = useState(0);

  // ── Play-phase test-mode scoreboard ──────────────────────────────
  // Array of { worldId, worldName, correct, total, stars }
  const [worldScores, setWorldScores]   = useState([]);
  // running totals across all worlds for Reflect scoreboard
  const [playCorrect, setPlayCorrect]   = useState(0);
  const [playTotal,   setPlayTotal]     = useState(0);

  const markDone    = (step) => setCompleted(prev => new Set([...prev, step]));
  const addXP       = (n)    => setTotalXP(p => p + n);
  const addStars    = (n)    => setTotalStars(p => p + n);
  const unlockWorld = (n)    => setWorldUnlocked(prev => Math.max(prev, n));

  const recordWorldScore = ({ worldId, worldName, correct, total, stars }) => {
    setWorldScores(prev => {
      const existing = prev.findIndex(s => s.worldId === worldId);
      const entry = { worldId, worldName, correct, total, stars };
      if (existing >= 0) {
        const next = [...prev]; next[existing] = entry; return next;
      }
      return [...prev, entry];
    });
    setPlayCorrect(p => p + correct);
    setPlayTotal(p => p + total);
  };

  const resetGame = () => {
    setCompleted(new Set());
    setWorldUnlocked(1);
    setTotalXP(0);
    setTotalStars(0);
    setWorldScores([]);
    setPlayCorrect(0);
    setPlayTotal(0);
  };

  return (
    <GameContext.Provider value={{
      completed, markDone,
      worldUnlocked, unlockWorld,
      totalXP, addXP,
      totalStars, addStars,
      worldScores, recordWorldScore,
      playCorrect, playTotal,
      resetGame,
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
