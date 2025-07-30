import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Task, Column } from '@/lib/types';
import { 
  CheckCircle2, Circle, Focus, Trash2
} from 'lucide-react';

const initialTasks: Record<string, Task> = {
  'task-1': {
    id: 'task-1',
    title: 'High Priority Task',
    description: 'Create a description for your task.',
    status: 'todo',
    createdAt: new Date(),
    pomodoroSessions: 0,
    priority: 'high'
  },
  'task-2': {
    id: 'task-2',
    title: 'Lock In with a Pomodoro Timer',
    description: 'Currently working on task.',
    status: 'doing',
    createdAt: new Date(),
    pomodoroSessions: 2,
    priority: 'medium'
  },
  'task-3': {
    id: 'task-3',
    title: 'Completed Task',
    description: 'Congratulations! You can now delete this task or keep it for visualization.',
    status: 'done',
    createdAt: new Date(),
    pomodoroSessions: 1,
    priority: 'low'
  }
};

const initialColumns: Record<string, Column> = {
  todo: { 
    id: 'todo', 
    title: 'To Do', 
    taskIds: ['task-1'], 
    color: 'from-pink-300 to-pink-400', 
    icon: Circle 
  },
  doing: { 
    id: 'doing', 
    title: 'In Progress', 
    taskIds: ['task-2'], 
    color: 'from-pink-400 to-pink-600', 
    icon: Focus 
  },
  done: { 
    id: 'done', 
    title: 'Completed', 
    taskIds: ['task-3'], 
    color: 'from-emerald-500 to-emerald-600', 
    icon: CheckCircle2 
  },
  trash: { 
    id: 'trash', 
    title: 'Trash', 
    taskIds: [], 
    color: 'from-red-500 to-red-600', 
    icon: Trash2 
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState(initialColumns);
  const [focusStreak, setFocusStreak] = useState(3);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTasks = { ...tasks };
    updatedTasks[draggableId] = {
      ...updatedTasks[draggableId],
      status: destination.droppableId as Task['status']
    };

    const sourceColumn = { ...columns[source.droppableId] };
    const destColumn = { ...columns[destination.droppableId] };

    sourceColumn.taskIds.splice(source.index, 1);
    destColumn.taskIds.splice(destination.index, 0, draggableId);

    setTasks(updatedTasks);
    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn
    });

    if (destination.droppableId === 'done') {
      setFocusStreak(prev => prev + 1);
    }
  };

  const addTask = (title: string, description: string, priority: Task['priority']) => {
    if (!title.trim()) return;

    const taskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: taskId,
      title,
      description: description.trim() || undefined,
      status: 'todo',
      createdAt: new Date(),
      pomodoroSessions: 0,
      priority
    };

    setTasks(prev => ({ ...prev, [taskId]: newTask }));
    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        taskIds: [...prev.todo.taskIds, taskId]
      }
    }));
  };

  const deleteTask = (taskId: string) => {
    const task = tasks[taskId];
    if (!task) return;

    // Remove from tasks
    const updatedTasks = { ...tasks };
    delete updatedTasks[taskId];

    // Remove from column
    const columnId = task.status;
    const updatedColumns = { ...columns };
    updatedColumns[columnId] = {
      ...updatedColumns[columnId],
      taskIds: updatedColumns[columnId].taskIds.filter(id => id !== taskId)
    };

    setTasks(updatedTasks);
    setColumns(updatedColumns);
  };

  const moveTaskToInProgress = (taskId: string) => {
    const task = tasks[taskId];
    if (!task || task.status !== 'todo') return;

    // Update task status
    const updatedTasks = { ...tasks };
    updatedTasks[taskId] = {
      ...updatedTasks[taskId],
      status: 'doing'
    };

    // Move from todo to doing column
    const updatedColumns = { ...columns };
    updatedColumns.todo = {
      ...updatedColumns.todo,
      taskIds: updatedColumns.todo.taskIds.filter(id => id !== taskId)
    };
    updatedColumns.doing = {
      ...updatedColumns.doing,
      taskIds: [...updatedColumns.doing.taskIds, taskId]
    };

    setTasks(updatedTasks);
    setColumns(updatedColumns);
  };

  const moveTaskToTodo = (taskId: string) => {
    const task = tasks[taskId];
    if (!task || task.status === 'todo') return;

    // Update task status
    const updatedTasks = { ...tasks };
    updatedTasks[taskId] = {
      ...updatedTasks[taskId],
      status: 'todo'
    };

    // Remove from current column
    const currentStatus = task.status;
    const updatedColumns = { ...columns };
    updatedColumns[currentStatus] = {
      ...updatedColumns[currentStatus],
      taskIds: updatedColumns[currentStatus].taskIds.filter(id => id !== taskId)
    };
    
    // Add to todo column
    updatedColumns.todo = {
      ...updatedColumns.todo,
      taskIds: [...updatedColumns.todo.taskIds, taskId]
    };

    setTasks(updatedTasks);
    setColumns(updatedColumns);
  };

  const moveTaskToCompleted = (taskId: string) => {
    const task = tasks[taskId];
    if (!task || task.status === 'done') return;

    // Update task status
    const updatedTasks = { ...tasks };
    updatedTasks[taskId] = {
      ...updatedTasks[taskId],
      status: 'done'
    };

    // Move from current column to done column
    const currentColumn = task.status;
    const updatedColumns = { ...columns };
    updatedColumns[currentColumn] = {
      ...updatedColumns[currentColumn],
      taskIds: updatedColumns[currentColumn].taskIds.filter(id => id !== taskId)
    };
    updatedColumns.done = {
      ...updatedColumns.done,
      taskIds: [...updatedColumns.done.taskIds, taskId]
    };

    setTasks(updatedTasks);
    setColumns(updatedColumns);
    setFocusStreak(prev => prev + 1);
  };

  const getTodayStats = () => ({
    completed: Object.values(tasks).filter(task => task.status === 'done').length,
    inProgress: Object.values(tasks).filter(task => task.status === 'doing').length,
    todo: Object.values(tasks).filter(task => task.status === 'todo').length
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPriorityDot = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  return {
    tasks,
    setTasks,
    columns,
    focusStreak,
    handleDragEnd,
    addTask,
    deleteTask,
    moveTaskToInProgress,
    moveTaskToTodo,
    moveTaskToCompleted,
    getTodayStats,
    getPriorityColor,
    getPriorityDot
  };
};