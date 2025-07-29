'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, Column } from '@/lib/types';
import { DropResult } from '@hello-pangea/dnd';

interface TaskContextType {
  tasks: Record<string, Task>;
  setTasks: React.Dispatch<React.SetStateAction<Record<string, Task>>>;
  columns: Record<string, Column>;
  focusStreak: number;
  handleDragEnd: (result: DropResult) => void;
  addTask: (title: string, description: string, priority: Task['priority']) => void;
  deleteTask: (taskId: string) => void;
  moveTaskToInProgress: (taskId: string) => void;
  getTodayStats: () => { completed: number; inProgress: number; todo: number };
  getPriorityColor: (priority: Task['priority']) => string;
  getPriorityDot: (priority: Task['priority']) => string;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskHookData = useTasks();

  return (
    <TaskContext.Provider value={taskHookData}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}