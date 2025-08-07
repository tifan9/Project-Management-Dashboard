import React, { createContext, useContext, useReducer, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Calendar, User, Tag, AlertCircle, Home, List, BarChart3, Settings } from 'lucide-react';

// Types
interface Task {
  id: string;
  taskName: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  dueDate: string;
  assignedUser: string;
  assignedOn: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
}

interface Filters {
  status: 'All' | 'Completed' | 'Incomplete';
  priority: 'All' | 'Low' | 'Medium' | 'High';
  category: string;
  dueDate: 'All' | 'Overdue' | 'Today' | 'Upcoming' | 'No Due Date';
  assignedUser: string;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task };

type Page = 'dashboard' | 'tasks' | 'analytics' | 'settings';

// Context
const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
} | null>(null);

// Reducer
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return { tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'TOGGLE_COMPLETE':
      return {
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      };
    case 'UPDATE_TASK':
      return {
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    default:
      return state;
  }
};

// Custom Hook
const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

// Components
const Sidebar: React.FC<{ currentPage: Page; setCurrentPage: (page: Page) => void }> = ({ 
  currentPage, 
  setCurrentPage 
}) => {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'tasks' as Page, label: 'Tasks', icon: List },
    { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">TaskTracker</h1>
        <p className="text-gray-400 text-sm">Project Management</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const TaskForm: React.FC<{ editingTask?: Task; onClose: () => void }> = ({ editingTask, onClose }) => {
  const { dispatch } = useTaskContext();
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'completed'>>({
    taskName: editingTask?.taskName || '',
    priority: editingTask?.priority || 'Medium',
    category: editingTask?.category || 'Frontend',
    dueDate: editingTask?.dueDate || '',
    assignedUser: editingTask?.assignedUser || '',
    assignedOn: editingTask?.assignedOn || new Date().toISOString().split('T')[0]
  });

  const categories = ['Frontend', 'Backend', 'Meeting', 'Design', 'Testing', 'Documentation'];
  const priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  const handleSubmit = () => {
    if (!formData.taskName.trim()) return;

    const task: Task = {
      id: editingTask?.id || Date.now().toString(),
      ...formData,
      completed: editingTask?.completed || false
    };

    dispatch({
      type: editingTask ? 'UPDATE_TASK' : 'ADD_TASK',
      payload: task
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input
              type="text"
              value={formData.taskName}
              onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned User</label>
              <input
                type="text"
                value={formData.assignedUser}
                onChange={(e) => setFormData({ ...formData, assignedUser: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Team member name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned On</label>
              <input
                type="date"
                value={formData.assignedOn}
                onChange={(e) => setFormData({ ...formData, assignedOn: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void; variant?: 'default' | 'compact' }> = ({ 
  task, 
  onEdit, 
  variant = 'default' 
}) => {
  const { dispatch } = useTaskContext();

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

const FilterBar: React.FC<{ filters: Filters; setFilters: (filters: Filters) => void }> = ({ 
  filters, 
  setFilters 
}) => {
  const { state } = useTaskContext();
  
  const uniqueCategories = Array.from(new Set(state.tasks.map(task => task.category)));
  const uniqueUsers = Array.from(new Set(state.tasks.map(task => task.assignedUser)));

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters['status'] })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value as Filters['priority'] })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <select
            value={filters.dueDate}
            onChange={(e) => setFilters({ ...filters, dueDate: e.target.value as Filters['dueDate'] })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            <option value="Overdue">Overdue</option>
            <option value="Today">Today</option>
            <option value="Upcoming">Upcoming</option>
            <option value="No Due Date">No Due Date</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned User</label>
          <select
            value={filters.assignedUser}
            onChange={(e) => setFilters({ ...filters, assignedUser: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({
  title,
  value,
  icon,
  color
}) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Pages
const DashboardPage: React.FC<{ onEditTask: (task: Task) => void }> = ({ onEditTask }) => {
  const { state } = useTaskContext();
  
  const completedCount = state.tasks.filter(task => task.completed).length;
  const overdueCount = state.tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  ).length;
  const todayCount = state.tasks.filter(task =>
    task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString() && !task.completed
  ).length;

  const recentTasks = state.tasks
    .sort((a, b) => new Date(b.assignedOn).getTime() - new Date(a.assignedOn).getTime())
    .slice(0, 5);

  const highPriorityTasks = state.tasks.filter(task => task.priority === 'High' && !task.completed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your team's progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={state.tasks.length}
          icon={<List className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon={<Check className="w-6 h-6 text-green-600" />}
          color="text-green-600"
        />
        <StatCard
          title="Due Today"
          value={todayCount}
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          color="text-orange-600"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} variant="compact" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks yet</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">High Priority Tasks</h3>
          <div className="space-y-3">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.slice(0, 5).map(task => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} variant="compact" />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No high priority tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TasksPage: React.FC<{ onEditTask: (task: Task) => void; onAddTask: () => void }> = ({ 
  onEditTask, 
  onAddTask 
}) => {
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

const AnalyticsPage: React.FC = () => {
  const { state } = useTaskContext();
  
  const categoryStats = state.tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityStats = state.tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const userStats = state.tasks.reduce((acc, task) => {
    if (!acc[task.assignedUser]) {
      acc[task.assignedUser] = { total: 0, completed: 0 };
    }
    acc[task.assignedUser].total++;
    if (task.completed) acc[task.assignedUser].completed++;
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const completionRate = state.tasks.length > 0 
    ? Math.round((state.tasks.filter(task => task.completed).length / state.tasks.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights into your team's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completion Rate"
          value={completionRate}
          icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="Total Categories"
          value={Object.keys(categoryStats).length}
          icon={<Tag className="w-6 h-6 text-green-600" />}
          color="text-green-600"
        />
        <StatCard
          title="Team Members"
          value={Object.keys(userStats).length}
          icon={<User className="w-6 h-6 text-purple-600" />}
          color="text-purple-600"
        />
        <StatCard
          title="Avg Tasks/User"
          value={Object.keys(userStats).length > 0 ? Math.round(state.tasks.length / Object.keys(userStats).length) : 0}
          icon={<List className="w-6 h-6 text-orange-600" />}
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / state.tasks.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-right">{count} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Priority</h3>
          <div className="space-y-3">
            {Object.entries(priorityStats).map(([priority, count]) => {
              const color = priority === 'High' ? 'bg-red-600' : 
                           priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600';
              return (
                <div key={priority} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{priority}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${(count / state.tasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem] text-right">{count} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Team Member</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Total Tasks</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Completed</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Completion Rate</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userStats).map(([user, stats]) => {
                const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <tr key={user} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-800">{user}</td>
                    <td className="py-3 px-4 text-gray-600">{stats.total}</td>
                    <td className="py-3 px-4 text-gray-600">{stats.completed}</td>
                    <td className="py-3 px-4 text-gray-600">{rate}%</td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { state } = useTaskContext();
  
  const [teamMembers, setTeamMembers] = useState<string[]>(
    Array.from(new Set(state.tasks.map(task => task.assignedUser)))
  );
  const [newMember, setNewMember] = useState('');
  
  const [categories, setCategories] = useState<string[]>(
    Array.from(new Set(state.tasks.map(task => task.category)))
  );
  const [newCategory, setNewCategory] = useState('');

  const addTeamMember = () => {
    if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
      setTeamMembers([...teamMembers, newMember.trim()]);
      setNewMember('');
    }
  };

  const removeTeamMember = (member: string) => {
    setTeamMembers(teamMembers.filter(m => m !== member));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your team and project settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>
          <div className="space-y-3 mb-4">
            {teamMembers.map(member => (
              <div key={member} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">{member}</span>
                <button
                  onClick={() => removeTeamMember(member)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Add team member"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
            />
            <button
              onClick={addTeamMember}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
          <div className="space-y-3 mb-4">
            {categories.map(category => (
              <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <button
                  onClick={() => removeCategory(category)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add category"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{state.tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{teamMembers.length}</div>
            <div className="text-sm text-gray-600">Active Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Project Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Layout Component
const Layout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onEditTask={handleEditTask} />;
      case 'tasks':
        return <TasksPage onEditTask={handleEditTask} onAddTask={handleAddTask} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onEditTask={handleEditTask} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 p-6">
        {renderPage()}
        {showForm && (
          <TaskForm editingTask={editingTask} onClose={handleCloseForm} />
        )}
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const initialState: TaskState = {
    tasks: [
      {
        id: '1',
        taskName: 'Implement user authentication',
        priority: 'High',
        category: 'Backend',
        dueDate: '2025-08-10',
        assignedUser: 'Alice Johnson',
        assignedOn: '2025-08-01',
        completed: false
      },
      {
        id: '2',
        taskName: 'Design dashboard wireframes',
        priority: 'Medium',
        category: 'Design',
        dueDate: '2025-08-08',
        assignedUser: 'Bob Smith',
        assignedOn: '2025-08-02',
        completed: true
      },
      {
        id: '3',
        taskName: 'Setup CI/CD pipeline',
        priority: 'High',
        category: 'Backend',
        dueDate: '2025-08-03',
        assignedUser: 'Charlie Brown',
        assignedOn: '2025-07-30',
        completed: false
      },
      {
        id: '4',
        taskName: 'Write unit tests',
        priority: 'Medium',
        category: 'Testing',
        dueDate: '2025-08-12',
        assignedUser: 'Alice Johnson',
        assignedOn: '2025-08-05',
        completed: false
      },
      {
        id: '5',
        taskName: 'Update documentation',
        priority: 'Low',
        category: 'Documentation',
        dueDate: '2025-08-15',
        assignedUser: 'Bob Smith',
        assignedOn: '2025-08-06',
        completed: true
      },
      {
        id: '6',
        taskName: 'Client meeting preparation',
        priority: 'High',
        category: 'Meeting',
        dueDate: '2025-08-09',
        assignedUser: 'Charlie Brown',
        assignedOn: '2025-08-07',
        completed: false
      }
    ]
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      <Layout />
    </TaskContext.Provider>
  );
};

export default App;