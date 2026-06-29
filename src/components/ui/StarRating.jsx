import React from 'react';
import { motion } from 'framer-motion';

export default function StarRating({ stars = 0, maxStars = 3, size = 'lg' }) {
  const sizeClass = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-xl';

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: maxStars }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 300, damping: 20 }}
          className={`${sizeClass} ${i < stars ? 'filter drop-shadow-md' : 'grayscale opacity-30'}`}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}
