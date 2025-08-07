import { useState } from "react";
import type { Task } from "../types";
import { X } from "lucide-react";
import { useTaskContext } from "../hooks/useTaskContext";

interface TaskFormProps {
  editingTask?: Task;
  onClose: () => void;
}
export const TaskForm: React.FC<TaskFormProps> = ({ editingTask, onClose }) => {
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
    <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white border-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
