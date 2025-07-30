'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Task, Column } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Plus, Target, TrendingUp, CheckCircle2, Trash2 } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  focusStreak: number;
  handleDragEnd: (result: DropResult) => void;
  addTask: (title: string, description: string, priority: Task['priority']) => void;
  deleteTask: (taskId: string) => void;
  getTodayStats: () => { completed: number; inProgress: number; todo: number };
  getPriorityColor: (priority: Task['priority']) => string;
  getPriorityDot: (priority: Task['priority']) => string;
  startTimer: (taskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  columns,
  focusStreak,
  handleDragEnd,
  addTask,
  deleteTask,
  getTodayStats,
  getPriorityColor,
  getPriorityDot,
  startTimer
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');

  const stats = getTodayStats();

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    addTask(newTaskTitle, newTaskDescription, newTaskPriority);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-pink-300 to-pink-400 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] rounded-xl text-white">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-pink-400">Task Board</h2>
            <p className="text-pink-600">Organize and track your productivity</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-300 rounded-full" />
              <span className="text-pink-600">{stats.todo} Todo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full" />
              <span className="text-pink-600">{stats.inProgress} In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-pink-600">{stats.completed} Completed</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-300 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] text-white rounded-lg  hover:bg-pink-400 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      {showAddTask && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Add task description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                title="priority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 via-pink-600 to-rose-500 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {Object.values(columns).filter(column => column.id !== 'trash').map((column) => (
            <div key={column.id} className="bg-pink-50/90 rounded-xl p-4 h-fit">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-gradient-to-r ${column.color} rounded-lg text-white`}>
                  <column.icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-900">{column.title}</h3>
                  <p className="text-xs text-rose-500">{column.taskIds.length} tasks</p>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[200px] transition-all duration-200 rounded-lg
                      ${snapshot.isDraggingOver ? 'bg-pink-50 border-2 border-pink-200 border-dashed' : ''}
                    `}
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      if (!task) return null;

                      return (
                        <div key={task.id} className="relative group">
                          <TaskCard
                            task={task}
                            index={index}
                            getPriorityColor={getPriorityColor}
                            getPriorityDot={getPriorityDot}
                          />
                          
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {task.status === 'todo' && (
                              <button
                                type="button"
                                onClick={() => startTimer(task.id)}
                                className="bg-pink-500 text-white p-1 rounded-md hover:bg-pink-600"
                                title="Start Pomodoro for this task"
                              >
                                <Target size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Delete this task? This cannot be undone.')) {
                                  deleteTask(task.id);
                                }
                              }}
                              className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600"
                              title="Delete task"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {stats.completed > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Great progress today! 🎉
              </h3>
              <p className="text-gray-600">
                You completed {stats.completed} task{stats.completed > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};