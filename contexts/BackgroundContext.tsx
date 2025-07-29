'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundContextType {
  currentBackground: string;
  setBackground: (background: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const defaultBackground = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80';

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