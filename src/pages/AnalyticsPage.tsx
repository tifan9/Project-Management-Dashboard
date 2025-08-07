import React from 'react';
import { BarChart3, Tag, User, List } from 'lucide-react';
import { StatCard } from '../components/cards/StatCard';
import { useTask } from '../hooks/useTask';
export const AnalyticsPage: React.FC = () => {
  const { state } = useTask();
  
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
