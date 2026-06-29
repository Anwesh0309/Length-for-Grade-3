import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase, STATIONS } from '../../context/PhaseContext.jsx';
import RulerSimulation from '../simulations/RulerSimulation.jsx';
import GardenSimulation from '../simulations/GardenSimulation.jsx';
import EstimationSimulation from '../simulations/EstimationSimulation.jsx';
import ConversionSimulation from '../simulations/ConversionSimulation.jsx';
import RaceTrackSimulation from '../simulations/RaceTrackSimulation.jsx';
import WordProblemSimulation from '../simulations/WordProblemSimulation.jsx';

const STATION_META = [
  {
    id: 'ruler',
    title: "Carpenter's Workshop",
    subtitle: '🔨 Norway · Using a Ruler',
    bg: 'from-[#3D1E00] to-[#6B3B00]',
    accent: 'border-amber-500',
    icon: '📏',
    tag: 'Station 1 of 6',
  },
  {
    id: 'garden',
    title: "The Giant's Garden",
    subtitle: '🌻 Brazil · Metres & cm',
    bg: 'from-[#003D1E] to-[#005C2E]',
    accent: 'border-teal-500',
    icon: '📐',
    tag: 'Station 2 of 6',
  },
  {
    id: 'estimation',
    title: "The Explorer's Trail",
    subtitle: '🏜️ Egypt · Estimating Length',
    bg: 'from-[#3D2800] to-[#6B4500]',
    accent: 'border-yellow-500',
    icon: '🤚',
    tag: 'Station 3 of 6',
  },
  {
    id: 'conversion',
    title: 'The Bridge Builder',
    subtitle: '🌉 Japan · Converting Units',
    bg: 'from-[#001A3D] to-[#00275C]',
    accent: 'border-blue-500',
    icon: '🔄',
    tag: 'Station 4 of 6',
  },
  {
    id: 'racetrack',
    title: 'The Race Track',
    subtitle: '🏟️ Kenya · Comparing Lengths',
    bg: 'from-[#3D0018] to-[#5C0025]',
    accent: 'border-pink-500',
    icon: '⚖️',
    tag: 'Station 5 of 6',
  },
  {
    id: 'wordproblem',
    title: 'Path to the Treasure',
    subtitle: '🌴 Measurement Island · Word Problems',
    bg: 'from-[#1A003D] to-[#2A0060]',
    accent: 'border-purple-500',
    icon: '➕',
    tag: 'Station 6 of 6',
  },
];

const SIMULATION_MAP = {
  ruler:       RulerSimulation,
  garden:      GardenSimulation,
  estimation:  EstimationSimulation,
  conversion:  ConversionSimulation,
  racetrack:   RaceTrackSimulation,
  wordproblem: WordProblemSimulation,
};

export default function LearnPhase() {
  const { state } = usePhase();
  const stationKey = STATIONS[state.currentStation] || 'ruler';
  const meta = STATION_META[state.currentStation] || STATION_META[0];
  const Simulation = SIMULATION_MAP[stationKey] || RulerSimulation;

  return (
    <div className={`h-screen w-full flex flex-col bg-gradient-to-b ${meta.bg} pt-14 overflow-hidden`}>

      {/* Station header band */}
      <div className={`flex-shrink-0 border-b ${meta.accent} border-opacity-30 bg-black/20 px-4 py-2`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={stationKey} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }} transition={{ duration: 0.3 }}>
                <p className="text-white/50 text-xs font-extrabold uppercase tracking-widest">{meta.tag}</p>
                <h2 className="text-xl font-black text-white leading-tight">{meta.subtitle}</h2>
                <p className="text-lg font-extrabold text-white/80">{meta.title}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Station dots */}
          <div className="flex gap-1.5 flex-shrink-0">
            {STATIONS.map((s, i) => (
              <div key={s}
                className={`rounded-full transition-all duration-300 ${
                  i < state.currentStation
                    ? 'w-3 h-3 bg-teal-400'
                    : i === state.currentStation
                      ? 'w-4 h-4 bg-amber-400 shadow-glow scale-110'
                      : 'w-3 h-3 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Simulation fills remaining height, scrollable internally */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">
          <motion.div
            key={stationKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="h-full"
          >
            <Simulation />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
