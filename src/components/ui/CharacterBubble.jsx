import React from 'react';
import { motion } from 'framer-motion';

const CHARACTER_DATA = {
  maya:      { emoji: '👧', color: 'bg-amber-50 border-amber-300',  name: 'Maya',  textColor: 'text-amber-800' },
  jake:      { emoji: '👦', color: 'bg-teal-50 border-teal-300',    name: 'Jake',  textColor: 'text-teal-800' },
  sofia:     { emoji: '👧🏻', color: 'bg-purple-50 border-purple-300', name: 'Sofia', textColor: 'text-purple-800' },
  sam:       { emoji: '🧑‍🔨', color: 'bg-orange-50 border-orange-300', name: 'Sam',   textColor: 'text-orange-800' },
  lena:      { emoji: '👩‍🌾', color: 'bg-green-50 border-green-300',  name: 'Lena',  textColor: 'text-green-800' },
  omar:      { emoji: '🧑‍🦱', color: 'bg-yellow-50 border-yellow-300', name: 'Omar',  textColor: 'text-yellow-800' },
  chen:      { emoji: '👨‍🔧', color: 'bg-blue-50 border-blue-300',    name: 'Chen',  textColor: 'text-blue-800' },
  aisha:     { emoji: '👩🏾‍🏃', color: 'bg-coral-50 border-coral-300', name: 'Aisha', textColor: 'text-red-800' },
  marco:     { emoji: '🏃', color: 'bg-indigo-50 border-indigo-300', name: 'Marco', textColor: 'text-indigo-800' },
};

export default function CharacterBubble({ character = 'maya', text, position = 'left', emotion = 'happy' }) {
  const data = CHARACTER_DATA[character] || CHARACTER_DATA.maya;
  const isLeft = position === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex items-start gap-3 max-w-xl ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-14 h-14 rounded-full ${data.color} border-2 flex items-center justify-center text-3xl shadow-md`}>
        {data.emoji}
      </div>

      {/* Bubble */}
      <div className={`relative ${data.color} border-2 rounded-bubble p-4 shadow-card flex-1`}>
        <p className={`text-sm font-extrabold ${data.textColor} mb-1`}>{data.name}</p>
        <p className="text-base font-bold text-inkDark leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
