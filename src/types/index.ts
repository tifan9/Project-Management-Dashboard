export interface Task {
  id: string;
  taskName: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  dueDate: string;
  assignedUser: string;
  assignedOn: string;
  completed: boolean;
}

export interface TaskState {
  tasks: Task[];
}

export interface Filters {
  status: 'All' | 'Completed' | 'Incomplete';
  priority: 'All' | 'Low' | 'Medium' | 'High';
  category: string;
  dueDate: 'All' | 'Overdue' | 'Today' | 'Upcoming' | 'No Due Date';
  assignedUser: string;
}

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task };

export type Page = 'dashboard' | 'tasks' | 'analytics' | 'settings';
