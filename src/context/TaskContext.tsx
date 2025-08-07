import React, { createContext, useContext, useReducer } from 'react';
import { TaskState, TaskAction } from '../types';

export const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
} | null>(null);

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



export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      {children}
    </TaskContext.Provider>
  );
};