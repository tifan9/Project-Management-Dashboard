import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <Layout />
    </TaskProvider>
  );
};

export default App;