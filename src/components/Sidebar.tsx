import type { Page } from "../types";
import { Home, List, BarChart3, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

type SidebarProps = {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'tasks' as Page, label: 'Tasks', icon: List },
    { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-transparent backdrop-blur bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 min-h-screen p-4 fixed top-0 left-0 z-50 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:block`}
        style={{ height: '100vh' }}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-2">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <Menu className="w-6 h-6 rotate-180" />
          </button>
        </div>
        <div className="mb-8 items-center">
          <h1 className="text-2xl font-bold">MiTracker</h1>
          <p className="text-gray-400 text-sm">Project Management</p>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
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
    </>
  );
}