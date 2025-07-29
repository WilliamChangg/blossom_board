'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTaskContext } from '@/contexts/TaskContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { KanbanBoard } from '@/components/KanbanBoard';
import { ModernClock } from '@/components/ModernClock';
import { BackgroundSelector } from '@/components/BackgroundSelector';

export default function DashboardPage() {
  const router = useRouter();
  const { currentBackground, setBackground } = useBackground();
  
  const {
    tasks,
    columns,
    focusStreak,
    handleDragEnd,
    addTask,
    deleteTask,
    getTodayStats,
    getPriorityColor,
    getPriorityDot,
    moveTaskToInProgress
  } = useTaskContext();

  const todayStats = getTodayStats();

  const startTimerForTask = (taskId: string) => {
    // Move task to 'doing' status
    moveTaskToInProgress(taskId);
    // Navigate to pomodoro page with task ID
    router.push(`/pomodoro?taskId=${taskId}`);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay for Content Readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
      
      {/* Content Container */}
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Productivity Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Quick Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{todayStats.completed}</div>
                  <div className="text-sm text-slate-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{todayStats.inProgress}</div>
                  <div className="text-sm text-slate-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{focusStreak}</div>
                  <div className="text-sm text-slate-500">Day Streak</div>
                </div>
              </div>

              {/* Pomodoro Timer Button */}
              <button
                type="button"
                onClick={() => router.push('/pomodoro')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg"
              >
                <Timer size={20} />
                Pomodoro Timer
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modern Clock Component */}
        <ModernClock />

        {/* Kanban Board Component */}
        <KanbanBoard
          tasks={tasks}
          columns={columns}
          focusStreak={focusStreak}
          handleDragEnd={handleDragEnd}
          addTask={addTask}
          deleteTask={deleteTask}
          getTodayStats={getTodayStats}
          getPriorityColor={getPriorityColor}
          getPriorityDot={getPriorityDot}
          startTimer={startTimerForTask}
        />
      </div>

      {/* Background Selector */}
      <BackgroundSelector
        currentBackground={currentBackground}
        onBackgroundChange={setBackground}
      />
      </div>
    </div>
  );
}