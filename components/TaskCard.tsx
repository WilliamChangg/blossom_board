'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/lib/types';
import { Clock, Star } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  getPriorityColor: (priority: Task['priority']) => string;
  getPriorityDot: (priority: Task['priority']) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  getPriorityColor, 
  getPriorityDot 
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-4 mb-3 
            hover:shadow-md hover:border-pink-200 hover:bg-pink-50/30 
            cursor-grab active:cursor-grabbing
            ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105 bg-white/95 border-pink-300' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`} />
              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            {task.pomodoroSessions > 0 && (
              <div className="flex items-center gap-1 text-xs text-rose-500">
                <Clock size={12} />
                <span>{task.pomodoroSessions}</span>
              </div>
            )}
          </div>

          <h3 className="font-semibold text-rose-900 mb-2 group-hover:text-rose-800">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-rose-600 mb-3 line-clamp-2 group-hover:text-rose-700">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-rose-400">
            <span>
              {task.createdAt.toLocaleDateString()}
            </span>
            
            {task.status === 'done' && (
              <div className="flex items-center gap-1 text-pink-500">
                <Star size={12} className="fill-current" />
                <span className="text-pink-600">Done</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};