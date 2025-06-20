import React, { useEffect, useState } from 'react';
import { Task } from '../../types';
import { getTasksByList, createTask, updateTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

interface TasksListProps {
  listId: string;
}

export const TasksList: React.FC<TasksListProps> = ({ listId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasks = await getTasksByList(listId);
      setTasks(tasks);
    } catch {
      setError('Не вдалося завантажити завдання');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [listId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentUser) return;

    try {
      await createTask(listId, newTaskTitle.trim(), '', currentUser.uid);
      setNewTaskTitle('');
      loadTasks();
    } catch {
      setError('Не вдалося додати завдання');
    }
  };

  const toggleCompleted = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      loadTasks();
    } catch {
      setError('Не вдалося оновити завдання');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити завдання?')) return;
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch {
      setError('Не вдалося видалити завдання');
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Нове завдання..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={!newTaskTitle.trim()}
        >
          Додати
        </button>
      </form>

      {loading ? (
        <p>Завантаження завдань...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">Завдань ще немає</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-3 rounded border ${
                task.completed ? 'bg-green-100 border-green-400 line-through text-gray-500' : 'bg-gray-100 border-gray-300'
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task)}
                />
                {task.title}
              </label>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-600 hover:text-red-800 text-sm"
                title="Видалити завдання"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
