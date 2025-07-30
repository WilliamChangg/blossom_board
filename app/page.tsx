'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTaskContext } from '@/contexts/TaskContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { usePomodoroContext } from '@/contexts/PomodoroContext';
import { usePetals } from '@/contexts/PetalsContext';
import { KanbanBoard } from '@/components/KanbanBoard';
import { ClockWeatherCard } from '@/components/ClockWeatherCard';
import { BackgroundSelector } from '@/components/BackgroundSelector';
import { CherryBlossomPetals } from '@/components/CherryBlossomPetals';
import { PetalsToggle } from '@/components/PetalsToggle';

export default function DashboardPage() {
  const router = useRouter();
  const { currentBackground, setBackground } = useBackground();
  const { petalsEnabled } = usePetals();
  
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

  const {
    isRunning,
    currentTask,
    timeLeft,
    formatTime,
    currentSession
  } = usePomodoroContext();

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
      style={currentBackground.startsWith('linear-gradient') 
        ? { background: currentBackground }
        : {
            backgroundImage: `url(${currentBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
      }
    >
      {/* Background Overlay for Content Readability */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      
      {/* Cherry Blossom Petals Animation */}
      {petalsEnabled && <CherryBlossomPetals />}
      
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
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text  bg-pink-300 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
                  🌸 Blossom Board
                </h1>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Timer Status Indicator */}
              {isRunning && currentTask && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg"
                >
                  <div className="relative">
                    <Timer size={18} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">{formatTime(timeLeft)}</div>
                    <div className="text-xs opacity-90">
                      {currentSession === 'work' ? 'Work' : 'Break'} • {currentTask.title}
                    </div>
                  </div>
                </motion.div>
              )}

              <PetalsToggle />
              
              <div className="flex items-center gap-3">
                {/* Pomodoro Timer Button */}
                <button
                  type="button"
                  onClick={() => router.push('/pomodoro')}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] text-white rounded-xl transition-all duration-200 font-semibold shadow-lg ${
                    isRunning && currentTask
                      ? 'from-emerald-400 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:via-emerald-600 hover:to-emerald-600'
                      : 'from-pink-300 to-pink-400 hover:from-pink-400  hover:to-pink-500'
                  }`}
                >
                  <Timer size={20} />
                  {isRunning && currentTask ? 'Pomodoro Timer' : 'Pomodoro Timer'}
                </button>
                
                {/* Petals Toggle */}
                
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clock and Weather Card */}
        <ClockWeatherCard />

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