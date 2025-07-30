'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePetals } from '@/contexts/PetalsContext';

export const PetalsToggle: React.FC = () => {
  const { petalsEnabled, togglePetals } = usePetals();

  return (
    <button
      type="button"
      onClick={togglePetals}
      className="relative px-3 py-2 -mr-3 bg-pink-200/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:bg-pink-100 transition-all duration-200 group"
      title={petalsEnabled ? "Hide cherry blossom petals" : "Show cherry blossom petals"}
    >
      <motion.div
        animate={{ 
          rotate: petalsEnabled ? 0 : 180,
          scale: petalsEnabled ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
        className={`text-lg transition-colors duration-200 ${
          petalsEnabled ? 'grayscale-0' : 'grayscale'
        }`}
      >
        🌸
      </motion.div>
      

    </button>
  );
};