'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundContextType {
  currentBackground: string;
  setBackground: (background: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const defaultBackground = 'id=6e52e644-90fa-5831-852e-ca76135eec1d&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-29T07%3A06%3A43Z&ske=2025-07-30T07%3A06%3A43Z&sks=b&skv=2024-08-04&sig=gpwmGcupuDUE8sybsqE4KNm/Et682NI79UAda4Ekh';

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