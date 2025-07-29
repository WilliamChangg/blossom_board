'use client';

import React, { useState, useEffect } from 'react';

export const ModernClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).replace(' ', '');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDay = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGradientByTime = () => {
    const hour = time.getHours();
    if (hour >= 6 && hour < 12) {
      return 'from-amber-200 via-orange-200 to-rose-200'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'from-blue-200 via-indigo-200 to-purple-200'; // Afternoon
    } else {
      return 'from-purple-200 via-violet-200 to-blue-200'; // Evening/Night
    }
  };

  const getTimeGradient = () => {
    const hour = time.getHours();
    if (hour >= 6 && hour < 12) {
      return 'from-amber-600 via-orange-600 to-rose-600'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'from-blue-600 via-indigo-600 to-purple-600'; // Afternoon
    } else {
      return 'from-purple-600 via-violet-600 to-blue-600'; // Evening/Night
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl shadow-2xl border border-white/30 p-8 mb-8 bg-gradient-to-br ${getGradientByTime()}`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />

      <div className="relative z-10 text-center">
        <div className="flex items-baseline justify-center gap-4 mb-3">
          <span 
            className={`text-5xl font-mono font-bold bg-gradient-to-r ${getTimeGradient()} bg-clip-text text-transparent tracking-wider drop-shadow-sm`}
          >
            {formatTime(time)}
          </span>
          
          <span className="text-xl font-semibold text-white/90 drop-shadow-sm">
            {getTimeOfDay()}
          </span>
        </div>
        
        <p className="text-white/80 font-medium text-lg drop-shadow-sm">
          {formatDate(time)}
        </p>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 blur-xl" />
      </div>
    </div>
  );
};