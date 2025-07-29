import React from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
  pomodoroSessions: number;
  priority: 'low' | 'medium' | 'high';
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface PomodoroState {
  workMinutes: number;
  breakMinutes: number;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  currentSession: 'work' | 'break';
  currentTaskId: string | null;
  showTimerSettings: boolean;
  sessionsToday: number;
  focusStreak: number;
}

export interface TaskStats {
  completed: number;
  inProgress: number;
  todo: number;
}