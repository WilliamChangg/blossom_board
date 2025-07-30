'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PetalsContextType {
  petalsEnabled: boolean;
  togglePetals: () => void;
}

const PetalsContext = createContext<PetalsContextType | undefined>(undefined);

export function PetalsProvider({ children }: { children: ReactNode }) {
  const [petalsEnabled, setPetalsEnabled] = useState(true);

  // Load petals preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('cherry-blossom-petals');
    if (savedPreference !== null) {
      setPetalsEnabled(JSON.parse(savedPreference));
    }
  }, []);

  const togglePetals = () => {
    const newState = !petalsEnabled;
    setPetalsEnabled(newState);
    localStorage.setItem('cherry-blossom-petals', JSON.stringify(newState));
  };

  return (
    <PetalsContext.Provider value={{ petalsEnabled, togglePetals }}>
      {children}
    </PetalsContext.Provider>
  );
}

export function usePetals() {
  const context = useContext(PetalsContext);
  if (context === undefined) {
    throw new Error('usePetals must be used within a PetalsProvider');
  }
  return context;
}