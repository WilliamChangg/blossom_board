import { useState, useEffect, useRef } from 'react';
import { Task } from '@/lib/types';

interface UsePomodoroProps {
  tasks: Record<string, Task>;
  setTasks: React.Dispatch<React.SetStateAction<Record<string, Task>>>;
}

export const usePomodoro = ({ tasks, setTasks }: UsePomodoroProps) => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(8);
  const [focusStreak, setFocusStreak] = useState(3);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (timeLeft === 0 && isRunning) {
        setIsRunning(false);
        setSessionCompleted(true);
        
        if (currentSession === 'work' && currentTaskId) {
          setTasks(prev => ({
            ...prev,
            [currentTaskId]: {
              ...prev[currentTaskId],
              pomodoroSessions: prev[currentTaskId].pomodoroSessions + 1
            }
          }));
          setSessionsToday(prev => prev + 1);
        }
        
        const nextSession = currentSession === 'work' ? 'break' : 'work';
        const nextDuration = nextSession === 'work' ? workMinutes * 60 : breakMinutes * 60;
        setCurrentSession(nextSession);
        setTimeLeft(nextDuration);
        setTotalTime(nextDuration);
        
        setTimeout(() => setSessionCompleted(false), 3000);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, currentSession, currentTaskId, workMinutes, breakMinutes, setTasks]);

  const startTimer = (taskId?: string) => {
    if (taskId) {
      setCurrentTaskId(taskId);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = currentSession === 'work' ? workMinutes * 60 : breakMinutes * 60;
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const updateTimerSettings = () => {
    const duration = currentSession === 'work' ? workMinutes * 60 : breakMinutes * 60;
    setTimeLeft(duration);
    setTotalTime(duration);
    setShowTimerSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const currentTask = currentTaskId ? tasks[currentTaskId] : null;

  return {
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
  };
};