import React, { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasksByList, updateTask } from '../../services/taskService';
import { Task } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface TaskManagerProps {
  listId: string;
  isAdmin: boolean;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ listId, isAdmin }) => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const loadTasks = async () => {
    const data = await getTasksByList(listId);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, [listId]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createTask(listId, title, desc, currentUser!.uid);
    setTitle('');
    setDesc('');
    loadTasks();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed: !completed });
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    await deleteTask(id);
    loadTasks();
  };

  return (
    <div className="mt-4">
      {isAdmin && (
        <div className="space-y-2 mb-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва" className="w-full border p-2 rounded" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Опис" className="w-full border p-2 rounded" />
          <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">Додати завдання</button>
        </div>
      )}
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="bg-gray-50 p-4 rounded flex justify-between items-center">
            <div>
              <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
              <p className="text-gray-600 text-sm">{task.description}</p>
            </div>
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id, task.completed)}
                  title={task.completed ? "Позначити як невиконане" : "Позначити як виконане"}
                  aria-label={task.completed ? "Позначити як невиконане" : "Позначити як виконане"}
                />
                <span className="sr-only">
                  {task.completed ? "Позначити як невиконане" : "Позначити як виконане"}
                </span>
              </label>
              {isAdmin && (
                <button onClick={() => handleDelete(task.id)} className="text-red-500">Видалити</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};