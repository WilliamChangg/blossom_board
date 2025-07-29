'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Circle, Focus } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskSelectorProps {
  tasks: Record<string, Task>;
  columns: Record<string, any>;
  onTaskSelect: (taskId: string) => void;
  currentTaskId: string | null;
  getPriorityColor: (priority: Task['priority']) => string;
  getPriorityDot: (priority: Task['priority']) => string;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  tasks,
  columns,
  onTaskSelect,
  currentTaskId,
  getPriorityColor,
  getPriorityDot
}) => {
  const todoTasks = columns.todo?.taskIds.map((id: string) => tasks[id]).filter(Boolean) || [];
  const doingTasks = columns.doing?.taskIds.map((id: string) => tasks[id]).filter(Boolean) || [];

  const allAvailableTasks = [...todoTasks, ...doingTasks];

  if (allAvailableTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Circle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">No Tasks Available</h3>
          <p className="text-slate-600 mb-6">
            Go back to the dashboard to create some tasks first.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Select a Task to Focus On</h3>
        <p className="text-slate-600">Choose from your available tasks to start a Pomodoro session</p>
      </div>

      {/* To Do Tasks */}
      {todoTasks.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg text-white">
              <Circle size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">To Do</h4>
              <p className="text-xs text-slate-500">{todoTasks.length} tasks</p>
            </div>
          </div>

          <div className="space-y-3">
            {todoTasks.map((task: any) => (
              <motion.div
                key={task.id}
                className={`group bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-200 ${
                  currentTaskId === task.id ? 'ring-2 ring-blue-400 border-blue-400' : 'border-gray-200'
                }`}
                onClick={() => onTaskSelect(task.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`} />
                      <h5 className="font-semibold text-slate-800">{task.title}</h5>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{task.createdAt.toLocaleDateString()}</span>
                      {task.pomodoroSessions > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{task.pomodoroSessions} sessions</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    title="start"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskSelect(task.id);
                    }}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      currentTaskId === task.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 group-hover:bg-blue-500 group-hover:text-white'
                    }`}
                  >
                    <Play size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Tasks */}
      {doingTasks.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <Focus size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">In Progress</h4>
              <p className="text-xs text-slate-500">{doingTasks.length} tasks</p>
            </div>
          </div>

          <div className="space-y-3">
            {doingTasks.map((task:any) => (
              <motion.div
                key={task.id}
                className={`group bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-200 ${
                  currentTaskId === task.id ? 'ring-2 ring-blue-400 border-blue-400' : 'border-gray-200'
                }`}
                onClick={() => onTaskSelect(task.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`} />
                      <h5 className="font-semibold text-slate-800">{task.title}</h5>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{task.createdAt.toLocaleDateString()}</span>
                      {task.pomodoroSessions > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{task.pomodoroSessions} sessions</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    title="stop"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskSelect(task.id);
                    }}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      currentTaskId === task.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 group-hover:bg-blue-500 group-hover:text-white'
                    }`}
                  >
                    <Play size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};