'use client';

import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  color: string;
}

export const CherryBlossomPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Create initial petals
    const initialPetals: Petal[] = [];
    for (let i = 0; i < 30; i++) {
      initialPetals.push(createPetal(i));
    }
    setPetals(initialPetals);

    // Animation loop
    const animationInterval = setInterval(() => {
      setPetals(prevPetals => 
        prevPetals.map(petal => {
          let newY = petal.y + petal.speed;
          let newX = petal.x + Math.sin(newY * 0.01) * petal.drift;
          let newRotation = petal.rotation + 2;

          // Reset petal when it goes off screen
          if (newY > window.innerHeight + 50) {
            return createPetal(petal.id);
          }

          // Keep petals within screen bounds horizontally
          if (newX < -50) newX = window.innerWidth + 50;
          if (newX > window.innerWidth + 50) newX = -50;

          return {
            ...petal,
            y: newY,
            x: newX,
            rotation: newRotation
          };
        })
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  const createPetal = (id: number): Petal => {
    const colors = ['#FFB7C5', '#FFC0CB', '#FFE4E6', '#FECACA', '#FDF2F8'];
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -50,
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4, // 4-12px
      speed: Math.random() * 2 + 1, // 1-3px per frame
      drift: Math.random() * 2 + 0.5, // horizontal drift
      opacity: Math.random() * 0.7 + 0.3, // 0.3-1.0
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}px`,
            top: `${petal.y}px`,
            transform: `rotate(${petal.rotation}deg)`,
            opacity: petal.opacity,
          }}
        >
          {/* Cherry blossom petal shape using CSS */}
          <div
            className="relative"
            style={{
              width: `${petal.size}px`,
              height: `${petal.size}px`,
            }}
          >
            {/* Petal shape - using multiple rounded divs to create a petal */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${petal.size * 0.8}px`,
                height: `${petal.size * 1.2}px`,
                backgroundColor: petal.color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(0deg)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: `${petal.size * 0.8}px`,
                height: `${petal.size * 1.2}px`,
                backgroundColor: petal.color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(72deg)',
                opacity: 0.8,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: `${petal.size * 0.8}px`,
                height: `${petal.size * 1.2}px`,
                backgroundColor: petal.color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(144deg)',
                opacity: 0.6,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: `${petal.size * 0.8}px`,
                height: `${petal.size * 1.2}px`,
                backgroundColor: petal.color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(216deg)',
                opacity: 0.4,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: `${petal.size * 0.8}px`,
                height: `${petal.size * 1.2}px`,
                backgroundColor: petal.color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(288deg)',
                opacity: 0.2,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};