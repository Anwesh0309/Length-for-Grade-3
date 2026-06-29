import React, { lazy, Suspense } from 'react';
import { PhaseProvider, usePhase, PHASES } from './context/PhaseContext.jsx';
import { AudioProvider } from './context/AudioContext.jsx';
import ProgressBar from './components/ui/ProgressBar.jsx';
import AudioToggle from './components/ui/AudioToggle.jsx';

const LandingPhase   = lazy(() => import('./components/phases/LandingPhase.jsx'));
const WonderPhase    = lazy(() => import('./components/phases/WonderPhase.jsx'));
const IntroPhase     = lazy(() => import('./components/phases/IntroPhase.jsx'));
const LearnPhase     = lazy(() => import('./components/phases/LearnPhase.jsx'));
const ReflectPhase   = lazy(() => import('./components/phases/ReflectPhase.jsx'));
const PracticePhase  = lazy(() => import('./components/phases/PracticePhase.jsx'));
const CelebratePhase = lazy(() => import('./components/phases/CelebratePhase.jsx'));

function PhaseRouter() {
  const { state } = usePhase();

  const phaseMap = {
    [PHASES.LANDING]:   <LandingPhase />,
    [PHASES.WONDER]:    <WonderPhase />,
    [PHASES.INTRO]:     <IntroPhase />,
    [PHASES.LEARN]:     <LearnPhase />,
    [PHASES.REFLECT]:   <ReflectPhase />,
    [PHASES.PRACTICE]:  <PracticePhase />,
    [PHASES.CELEBRATE]: <CelebratePhase />,
  };

  const showNav = state.phase !== PHASES.LANDING && state.phase !== PHASES.CELEBRATE;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream font-display">
      {showNav && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-amber-100">
          <ProgressBar />
          <AudioToggle />
        </div>
      )}
      {!showNav && state.phase !== PHASES.LANDING && (
        <div className="fixed top-4 right-4 z-50">
          <AudioToggle />
        </div>
      )}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <div className="text-6xl animate-bounce mb-4">📏</div>
            <p className="text-2xl font-extrabold text-amber-600">Loading Adventure...</p>
          </div>
        </div>
      }>
        {phaseMap[state.phase] || <LandingPhase />}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <PhaseProvider>
        <PhaseRouter />
      </PhaseProvider>
    </AudioProvider>
  );
}
