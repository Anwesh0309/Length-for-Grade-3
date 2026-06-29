import React, { createContext, useContext, useReducer } from 'react';

export const PHASES = {
  LANDING: 'landing',
  WONDER: 'wonder',
  INTRO: 'intro',
  LEARN: 'learn',
  REFLECT: 'reflect',
  PRACTICE: 'practice',
  CELEBRATE: 'celebrate',
};

export const STATIONS = [
  'ruler',
  'garden',
  'estimation',
  'conversion',
  'racetrack',
  'wordproblem',
];

const initialState = {
  phase: PHASES.LANDING,
  currentStation: 0,
  stationsCompleted: [],
  tokens: 0,
  practiceScore: { correct: 0, total: 0 },
  stars: 0,
  streakCount: 0,
  audioEnabled: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NEXT_PHASE': {
      const phases = Object.values(PHASES);
      const currentIndex = phases.indexOf(state.phase);
      const nextPhase = action.phase || phases[Math.min(currentIndex + 1, phases.length - 1)];
      return { ...state, phase: nextPhase, currentStation: 0 };
    }
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'COMPLETE_STATION': {
      const newCompleted = [...state.stationsCompleted];
      if (!newCompleted.includes(action.station)) {
        newCompleted.push(action.station);
      }
      const nextStation = state.currentStation + 1;
      if (nextStation >= STATIONS.length) {
        return {
          ...state,
          stationsCompleted: newCompleted,
          phase: PHASES.REFLECT,
          currentStation: 0,
        };
      }
      return {
        ...state,
        stationsCompleted: newCompleted,
        currentStation: nextStation,
      };
    }
    case 'EARN_TOKEN':
      return { ...state, tokens: state.tokens + (action.amount || 1) };
    case 'RECORD_ANSWER': {
      const isCorrect = action.correct;
      const newScore = {
        correct: state.practiceScore.correct + (isCorrect ? 1 : 0),
        total: state.practiceScore.total + 1,
      };
      const newStreak = isCorrect ? state.streakCount + 1 : 0;
      let stars = 0;
      if (newScore.total === 12) {
        if (newScore.correct >= 11) stars = 3;
        else if (newScore.correct >= 8) stars = 2;
        else if (newScore.correct >= 5) stars = 1;
      }
      return {
        ...state,
        practiceScore: newScore,
        streakCount: newStreak,
        stars: stars || state.stars,
      };
    }
    case 'FINISH_PRACTICE': {
      const { correct, total } = state.practiceScore;
      let stars = 0;
      if (correct >= 11) stars = 3;
      else if (correct >= 8) stars = 2;
      else if (correct >= 5) stars = 1;
      return { ...state, stars, phase: PHASES.CELEBRATE };
    }
    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };
    case 'RESTART':
      return { ...initialState };
    default:
      return state;
  }
}

const PhaseContext = createContext(null);

export function PhaseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PhaseContext.Provider value={{ state, dispatch }}>
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error('usePhase must be used within PhaseProvider');
  return ctx;
}
