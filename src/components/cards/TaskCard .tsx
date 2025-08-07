import type { Task } from "../../types";
import React from 'react';
import { AlertCircle, Calendar, Check, Edit2, Tag, Trash2, User } from 'lucide-react';
import { useTask } from "../../hooks/useTask";
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  variant?: 'default' | 'compact';
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, variant = 'default' }) => {
  const { dispatch } = useTask();

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: task.id });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border p-3 shadow-sm transition-all hover:shadow-md ${
        task.completed ? 'border-green-200 bg-green-50' : isOverdue ? 'border-red-200' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {task.completed && <Check className="w-2 h-2" />}
            </button>
            <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.taskName}
            </h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md ${
      task.completed ? 'border-green-200 bg-green-50' : isOverdue ? 'border-red-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleComplete}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>
          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.taskName}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{task.category}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{task.assignedUser}</span>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${
              isOverdue ? 'text-red-600 font-medium' : 
              isToday ? 'text-orange-600 font-medium' : 'text-gray-600'
            }`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && ' (Overdue)'}
              {isToday && ' (Today)'}
            </span>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Assigned: {new Date(task.assignedOn).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};