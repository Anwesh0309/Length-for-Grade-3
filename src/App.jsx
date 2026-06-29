import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext.jsx';
import { GameProvider } from './context/GameContext.jsx';
import StarsBg from './components/ui/StarsBg.jsx';
import AudioBtn from './components/ui/AudioBtn.jsx';

const Home     = lazy(() => import('./pages/Home.jsx'));
const Wonder   = lazy(() => import('./pages/Wonder.jsx'));
const Story    = lazy(() => import('./pages/Story.jsx'));
const Simulate = lazy(() => import('./pages/Simulate.jsx'));
const Play     = lazy(() => import('./pages/Play.jsx'));
const Reflect  = lazy(() => import('./pages/Reflect.jsx'));

const Loader = () => (
  <div className="page-bg min-h-screen flex items-center justify-center">
    <div className="text-center anim-popIn">
      <div className="text-7xl mb-4 anim-float">📏</div>
      <p className="text-xl font-extrabold text-yellow-400">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <StarsBg />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/wonder"   element={<Wonder />} />
            <Route path="/story"    element={<Story />} />
            <Route path="/simulate" element={<Simulate />} />
            <Route path="/play"     element={<Play />} />
            <Route path="/reflect"  element={<Reflect />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <AudioBtn />
      </GameProvider>
    </AudioProvider>
  );
}
