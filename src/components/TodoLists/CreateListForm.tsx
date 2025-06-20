import React, { useState } from 'react';
import { createList } from '../../services/todoListService';
import { useAuth } from '../../contexts/AuthContext';

interface CreateListFormProps {
  onListCreated: () => void;
}

export const CreateListForm: React.FC<CreateListFormProps> = ({ onListCreated }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim()) return;

    setLoading(true);
    setError('');

    try {
      await createList(name.trim(), currentUser.uid);
      setName('');
      onListCreated();
    } catch (error: any) {
      console.error('Помилка створення списку:', error);
      setError('Не вдалося створити список');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Створити новий список</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва списку..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Створення...' : 'Створити'}
        </button>
      </form>
    </div>
  );
};