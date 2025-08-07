import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import type { Filters, Task } from '../types';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/cards/TaskCard ';
import { useTaskContext } from '../hooks/useTaskContext';

interface TasksPageProps {
  onEditTask: (task: Task) => void;
  onAddTask: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ onEditTask, onAddTask }) => {
  const { state } = useTaskContext();
  const [filters, setFilters] = useState<Filters>({
    status: 'All',
    priority: 'All',
    category: 'All',
    dueDate: 'All',
    assignedUser: 'All'
  });

  const filterTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => {
      if (filters.status === 'Completed' && !task.completed) return false;
      if (filters.status === 'Incomplete' && task.completed) return false;
      if (filters.priority !== 'All' && task.priority !== filters.priority) return false;
      if (filters.category !== 'All' && task.category !== filters.category) return false;
      if (filters.assignedUser !== 'All' && task.assignedUser !== filters.assignedUser) return false;

      if (filters.dueDate !== 'All') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (filters.dueDate === 'No Due Date' && task.dueDate) return false;
        if (filters.dueDate !== 'No Due Date' && !task.dueDate) return false;
        
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          
          if (filters.dueDate === 'Overdue' && dueDate >= today) return false;
          if (filters.dueDate === 'Today' && dueDate.getTime() !== today.getTime()) return false;
          if (filters.dueDate === 'Upcoming' && dueDate <= today) return false;
        }
      }

      return true;
    });
  };

  const filteredTasks = filterTasks(state.tasks);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage all your team tasks</p>
        </div>
        <button
          onClick={onAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            All Tasks ({filteredTasks.length})
          </h2>
        </div>
        
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or add a new task</p>
          </div>
        )}
      </div>
    </div>
  );
};