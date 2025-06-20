import React, { useState } from 'react';
import { TodoList } from '../../types';
import { updateList, deleteList } from '../../services/todoListService';

interface TodoListItemProps {
  list: TodoList;
  onListUpdated: () => void;
  onListDeleted: () => void;
  onListClick: (listId: string) => void;
}

export const TodoListItem: React.FC<TodoListItemProps> = ({ 
  list, 
  onListUpdated, 
  onListDeleted,
  onListClick 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(list.name);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    try {
      await updateList(list.id, newName.trim());
      setIsEditing(false);
      onListUpdated();
    } catch (error) {
      console.error('Помилка оновлення списку:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей список?')) return;

    setLoading(true);
    try {
      await deleteList(list.id);
      onListDeleted();
    } catch (error) {
      console.error('Помилка видалення списку:', error);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setNewName(list.name);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            autoFocus
            placeholder="Введіть нову назву списку"
            title="Назва списку"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !newName.trim()}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              disabled={loading}
            >
              Скасувати
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h4 
            className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"
            onClick={() => onListClick(list.id)}
          >
            {list.name}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => onListClick(list.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Відкрити
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              disabled={loading}
            >
              Редагувати
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              disabled={loading}
            >
              {loading ? 'Видалення...' : 'Видалити'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};