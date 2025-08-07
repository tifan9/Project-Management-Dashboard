import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTask } from '../hooks/useTask';
export const SettingsPage: React.FC = () => {
  const { state } = useTask();
  
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