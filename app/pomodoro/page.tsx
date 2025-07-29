'use client';

import React, { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTaskContext } from '@/contexts/TaskContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { BackgroundSelector } from '@/components/BackgroundSelector';

function Search() {
const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams.get('taskId');
  const { currentBackground, setBackground } = useBackground();
  
  const {
    tasks,
    setTasks,
    getTodayStats
  } = useTaskContext();

  const pomodoroHookProps = {
    tasks,
    setTasks
  };

  const {
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    timeLeft,
    totalTime,
    isRunning,
    currentSession,
    currentTaskId,
    showTimerSettings,
    setShowTimerSettings,
    sessionsToday,
    focusStreak,
    sessionCompleted,
    currentTask,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimerSettings,
    formatTime,
    getProgress
  } = usePomodoro(pomodoroHookProps);

  // Auto-start timer for the selected task
  useEffect(() => {
    if (taskId && tasks[taskId] && !currentTaskId && !isRunning) {
      startTimer(taskId);
    }
  }, [taskId, tasks, currentTaskId, isRunning, startTimer]);

  const todayStats = getTodayStats();

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
      {/* Session Completion Celebration */}
      {sessionCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold">Session Complete! 🎉</div>
              <div className="text-sm opacity-90">
                {currentSession === 'break' ? 'Time for work!' : 'Take a break!'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header with Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{todayStats.completed}</div>
                <div className="text-sm text-slate-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sessionsToday}</div>
                <div className="text-sm text-slate-500">Focus Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{focusStreak}</div>
                <div className="text-sm text-slate-500">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Focus Session
            </h1>
            <p className="text-slate-600 text-lg">
              Stay focused and productive
            </p>
          </div>
        </motion.div>

        {/* Centered Pomodoro Timer */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <PomodoroTimer
              workMinutes={workMinutes}
              setWorkMinutes={setWorkMinutes}
              breakMinutes={breakMinutes}
              setBreakMinutes={setBreakMinutes}
              timeLeft={timeLeft}
              totalTime={totalTime}
              isRunning={isRunning}
              currentSession={currentSession}
              currentTaskId={currentTaskId}
              showTimerSettings={showTimerSettings}
              setShowTimerSettings={setShowTimerSettings}
              sessionsToday={sessionsToday}
              focusStreak={focusStreak}
              sessionCompleted={sessionCompleted}
              currentTask={currentTask}
              startTimer={startTimer}
              pauseTimer={pauseTimer}
              resetTimer={resetTimer}
              updateTimerSettings={updateTimerSettings}
              formatTime={formatTime}
              getProgress={getProgress}
              tasks={tasks}
            />
          </div>
        </div>

        {!currentTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">No Task Selected</h3>
              <p className="text-slate-600 mb-6">
                Go back to the dashboard to select a task and start a focused work session.
              </p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gradient-to-r bg-pink-500 hover:bg-pink-600 text-white hover:scale-105 shadow-lg hover:shadow-pink-200 rounded-lg transition-colors font-medium"
              >
                Select a Task
              </button>
            </div>
          </motion.div>
        )}
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

export default function PomodoroPage() {
  return(
  <Suspense>
    <Search/>
  </Suspense>
  )
}