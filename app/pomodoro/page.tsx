'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, CheckCircle, Star, Trophy } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTaskContext } from '@/contexts/TaskContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { usePomodoroContext } from '@/contexts/PomodoroContext';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskSelector } from '@/components/TaskSelector';
import { BackgroundSelector } from '@/components/BackgroundSelector';
import { CherryBlossomPetals } from '@/components/CherryBlossomPetals';

function Search() {
const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams.get('taskId');
  const { currentBackground, setBackground } = useBackground();
  
  const {
    tasks,
    setTasks,
    columns,
    moveTaskToInProgress,
    moveTaskToTodo,
    moveTaskToCompleted,
    getPriorityColor,
    getPriorityDot,
    getTodayStats
  } = useTaskContext();

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
    clearCurrentTask,
    updateTimerSettings,
    formatTime,
    getProgress
  } = usePomodoroContext();

  // Auto-start timer for the selected task
  useEffect(() => {
    if (taskId && tasks[taskId] && !currentTaskId && !isRunning) {
      startTimer(taskId);
    }
  }, [taskId, tasks, currentTaskId, isRunning, startTimer]);

  const handleTaskSelect = (selectedTaskId: string) => {
    // Move task to in progress if it's in todo
    if (tasks[selectedTaskId]?.status === 'todo') {
      moveTaskToInProgress(selectedTaskId);
    }
    startTimer(selectedTaskId);
  };

  const [showCongratulations, setShowCongratulations] = useState(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState('');

  const handleTaskComplete = () => {
    if (currentTaskId && currentTask) {
      setCompletedTaskTitle(currentTask.title);
      setShowCongratulations(true);
      
      // Trigger confetti
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      
      // Complete the task and clear current task after a delay
      setTimeout(() => {
        moveTaskToCompleted(currentTaskId);
        clearCurrentTask();
        setShowCongratulations(false);
      }, 3000);
    }
  };

  const todayStats = getTodayStats();

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
      <div className="absolute inset-0 bg-pink-50/20 backdrop-blur-[1px]" />
      
      {/* Cherry Blossom Petals Animation */}
      <CherryBlossomPetals />
      
      {/* Content Container */}
      <div className="relative z-10">
      
      {/* Session Completion Celebration */}
      {sessionCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-4 rounded-xl shadow-2xl border border-pink-200/30"
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

      {/* Task Completion Congratulations */}
      <AnimatePresence>
        {showCongratulations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-200">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
                  </motion.div>
                ))}
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Congratulations! 🎉
              </h3>
              
              <p className="text-lg text-gray-600 mb-2">
                You've completed:
              </p>
              
              <p className="text-xl font-semibold text-pink-600 mb-4">
                "{completedTaskTitle}"
              </p>
              
              <p className="text-gray-500 text-sm">
                Great work! Your task has been moved to completed.
              </p>
              
              <div className="mt-6 text-6xl">🌟</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
              className="flex items-center gap-2 px-4 py-2 text-rose-600 bg-pink-50 hover:text-rose-800 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200/50"
            >
              <ArrowLeft size={20} className='-mr-1'/>
              Back to Dashboard
            </button>
            
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{todayStats.completed}</div>
                <div className="text-sm text-rose-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600">{sessionsToday}</div>
                <div className="text-sm text-rose-500">Focus Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-700">{focusStreak}</div>
                <div className="text-sm text-rose-500">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              Focus Session
            </h1>
            <p className="text-rose-600 text-lg">
              Stay focused and productive
            </p>
          </div>
        </motion.div>

        {/* Pomodoro Timer */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Pomodoro Timer */}
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
                clearCurrentTask={clearCurrentTask}
                updateTimerSettings={updateTimerSettings}
                formatTime={formatTime}
                getProgress={getProgress}
                tasks={tasks}
                moveTaskToTodo={moveTaskToTodo}
              />

              {/* Task Completed Button */}
              {currentTask && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleTaskComplete}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl hover:from-pink-500 hover:to-rose-600 transition-all duration-200 font-semibold shadow-lg hover:scale-105 hover:shadow-pink-200 border border-pink-300/30"
                  >
                    <CheckCircle size={20} />
                    Mark Task as Completed
                  </button>
                </div>
              )}

              {/* Task Selection */}
              <TaskSelector
                tasks={tasks}
                columns={columns}
                onTaskSelect={handleTaskSelect}
                currentTaskId={currentTaskId}
                getPriorityColor={getPriorityColor}
                getPriorityDot={getPriorityDot}
              />
            </motion.div>
          </div>
        </div>
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