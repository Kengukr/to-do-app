import React, { useState, useEffect } from 'react';
import { TodoList } from '../../types';
import { getUserLists } from '../../services/todoListService';
import { useAuth } from '../../contexts/AuthContext';
import { CreateListForm } from './CreateListForm';
import { TodoListItem } from './TodoListItem';

interface TodoListsPageProps {
  onListSelect: (listId: string) => void;
}

export const TodoListsPage: React.FC<TodoListsPageProps> = ({ onListSelect }) => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const loadLists = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      const userLists = await getUserLists(currentUser.uid);
      setLists(userLists);
    } catch (error: any) {
      console.error('Помилка завантаження списків:', error);
      setError('Не вдалося завантажити списки');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadLists();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Завантаження списків...</div>
      </div>
    );
  }

  return (
    <div>
      <CreateListForm onListCreated={loadLists} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {lists.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            У вас поки немає списків завдань. Створіть перший!
          </div>
        ) : (
          lists.map((list) => (
            <TodoListItem
              key={list.id}
              list={list}
              onListUpdated={loadLists}
              onListDeleted={loadLists}
              onListClick={onListSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};