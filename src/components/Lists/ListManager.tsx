import React, { useEffect, useState } from 'react';
import { createList, getUserLists, deleteList, updateList } from '../../services/todoListService';
import { useAuth } from '../../contexts/AuthContext';
import { TodoList } from '../../types';
import { ParticipantForm } from './ParticipantForm';

export const ListManager: React.FC = () => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const [lists, setLists] = useState<TodoList[]>([]);
  const [newName, setNewName] = useState('');

  const fetchLists = async () => {
    if (currentUser) {
      const data = await getUserLists(currentUser.uid);
      setLists(data);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [currentUser]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createList(newName, currentUser!.uid);
    setNewName('');
    fetchLists();
  };

  const handleDelete = async (id: string) => {
    await deleteList(id);
    fetchLists();
  };

  const handleRename = async (id: string) => {
    const newTitle = prompt('Нова назва списку?');
    if (newTitle) {
      await updateList(id, newTitle);
      fetchLists();
    }
  };
  const isAdmin = currentUser?.uid === 'admin'; // Replace with actual admin check if needed

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Назва нового списку"
          className="px-3 py-2 border rounded w-full"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Створити
        </button>
      </div>

      <ul className="space-y-2">
        {lists.map(list => (
          <li key={list.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            <span>{list.name}</span>
            <div className="space-x-2">
              <button onClick={() => handleRename(list.id)} className="text-blue-500">Редагувати</button>
              <button onClick={() => handleDelete(list.id)} className="text-red-500">Видалити</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};