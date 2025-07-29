'use client';

import React from 'react';
import { Play, Pause, RotateCcw, Settings, Timer, Zap, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task } from '@/lib/types';

interface PomodoroTimerProps {
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
  currentTask: Task | null;
  startTimer: (taskId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateTimerSettings: () => void;
  formatTime: (seconds: number) => string;
  getProgress: () => number;
  tasks: Record<string, Task>;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
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
  getProgress,
  tasks
}) => {
  React.useEffect(() => {
    if (sessionCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [sessionCompleted]);

  return (
    //pomodoro timer card
    
    <div className=" rounded-2xl shadow-lg bg-white/20 backdrop-blur-xl p-6 mb-8">

      <div className="flex items-center justify-between mb-6">
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-pink-400 via-pink-600 to-rose-500 rounded-xl text-white">
            <Timer size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pomodoro Timer</h2>
            <p className="text-sm text-gray-600">
              {currentSession === 'work' ? 'Focus Time' : 'Break Time'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1 text-orange-600 mb-1">
              <Zap size={16} />
              <span className="text-lg font-bold">{sessionsToday}</span>
            </div>
            <p className="text-xs text-gray-500">Today</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 text-emerald-600 mb-1">
              <Coffee size={16} />
              <span className="text-lg font-bold">{focusStreak}</span>
            </div>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
          
          <button
            title="showTimer"
            onClick={() => setShowTimerSettings(!showTimerSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {showTimerSettings && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Timer Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Duration (minutes)
              </label>
              <input
                title="work"
                type="number"
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                title="break"
                type="number"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="30"
              />
            </div>
          </div>
          <button
            onClick={updateTimerSettings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Settings
          </button>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="relative inline-block">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={currentSession === 'work' ? '#3b82f6' : '#10b981'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600">
                {currentSession === 'work' ? 'Work' : 'Break'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {currentTask && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-1">Currently working on:</p>
          <h3 className="font-semibold text-blue-900">{currentTask.title}</h3>
          {currentTask.description && (
            <p className="text-sm text-blue-700 mt-1">{currentTask.description}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => isRunning ? pauseTimer() : startTimer()}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
            ${isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 shadow-lg hover:shadow-red-200' 
              : 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-105 shadow-lg hover:shadow-pink-200'
            }
          `}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {currentSession === 'work' && !currentTaskId && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            💡 Select a task from the board below to track your Pomodoro session!
          </p>
        </div>
      )}

      {sessionCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {currentSession === 'break' ? 'Work Session Complete!' : 'Break Time Over!'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentSession === 'break' 
                ? "Great focus! Time for a well-deserved break." 
                : "Break's over! Ready to get back to work?"
              }
            </p>
            <div className="text-4xl mb-2">
              {currentSession === 'break' ? '☕' : '🚀'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};