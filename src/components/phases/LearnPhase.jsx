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
  { id: 'ruler',       title: "🔨 Station 1: The Carpenter's Workshop",  subtitle: 'Norway · Using a Ruler', color: 'from-orange-50 to-amber-50',    icon: '📏' },
  { id: 'garden',      title: '🌻 Station 2: The Giant\'s Garden',        subtitle: 'Brazil · Metres & Centimetres', color: 'from-green-50 to-teal-50', icon: '📐' },
  { id: 'estimation',  title: "🏜️ Station 3: The Explorer's Trail",       subtitle: 'Egypt · Estimating Length', color: 'from-yellow-50 to-orange-50',  icon: '🤚' },
  { id: 'conversion',  title: '🌉 Station 4: The Bridge Builder',          subtitle: 'Japan · Converting Units', color: 'from-blue-50 to-purple-50',    icon: '🔄' },
  { id: 'racetrack',   title: '🏟️ Station 5: The Race Track',              subtitle: 'Kenya · Comparing Lengths', color: 'from-coral-50 to-pink-50',  icon: '⚖️' },
  { id: 'wordproblem', title: '🌴 Station 6: Path to the Treasure',        subtitle: 'Measurement Island · Word Problems', color: 'from-purple-50 to-indigo-50', icon: '➕' },
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
    <div className={`min-h-screen w-full flex flex-col bg-gradient-to-b ${meta.color} pt-16 overflow-hidden`}>

      {/* Station header */}
      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
        <motion.div
          key={stationKey}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-pill px-4 py-1.5 shadow-card mb-2">
            <span className="text-lg">{meta.icon}</span>
            <span className="text-xs font-extrabold text-inkMid uppercase tracking-wider">{meta.subtitle}</span>
          </div>
          <h2 className="text-2xl font-black text-inkDark">{meta.title}</h2>
        </motion.div>
      </div>

      {/* Station progress dots */}
      <div className="flex justify-center gap-2 py-2">
        {STATIONS.map((s, i) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              i < state.currentStation ? 'bg-teal-500' :
              i === state.currentStation ? 'bg-amber-500 scale-125 shadow-glow' :
              'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Simulation area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stationKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Simulation />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
