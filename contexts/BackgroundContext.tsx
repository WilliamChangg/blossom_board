'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundContextType {
  currentBackground: string;
  setBackground: (background: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const defaultBackground = '/cherry_blossom.png';

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [currentBackground, setCurrentBackground] = useState(defaultBackground);

  // Load background from localStorage on mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('productivity-background');
    if (savedBackground) {
      setCurrentBackground(savedBackground);
    }
  }, []);

  const setBackground = (background: string) => {
    setCurrentBackground(background);
    localStorage.setItem('productivity-background', background);
  };

  return (
    <BackgroundContext.Provider value={{ currentBackground, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}