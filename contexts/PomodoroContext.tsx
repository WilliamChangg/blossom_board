'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTaskContext } from '@/contexts/TaskContext';

interface PomodoroContextType {
  workMinutes: number;
  setWorkMinutes: (minutes: number) => void;
  breakMinutes: number;
  setBreakMinutes: (minutes: number) => void;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  currentSession: 'work' | 'break';
  currentTaskId: string | null;
  showTimerSettings: boolean;
  setShowTimerSettings: (show: boolean) => void;
  sessionsToday: number;
  focusStreak: number;
  sessionCompleted: boolean;
  currentTask: any;
  startTimer: (taskId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  clearCurrentTask: () => void;
  updateTimerSettings: () => void;
  formatTime: (seconds: number) => string;
  getProgress: () => number;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { tasks, setTasks } = useTaskContext();
  
  const pomodoroData = usePomodoro({ tasks, setTasks });

  return (
    <PomodoroContext.Provider value={pomodoroData}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
}