import React, { useState } from 'react';
import type { Page, Task } from '../types';
import { DashboardPage } from '../pages/DashboardPage';
import { TasksPage } from '../pages/TasksPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
// import { Sidebar } from './SideBar';
import { TaskForm } from './TaskForm';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
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