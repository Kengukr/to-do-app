import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { TodoList } from '../types';
import { Participant } from '../types';
// import { Tasks } from '../components/Tasks';


export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');

  useEffect(() => {
    const q = query(collection(db, 'todoLists'), where('participants', 'array-contains', { email: currentUser?.email, role: 'admin' }));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: TodoList[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as TodoList),
        id: doc.id,
      }));
      setLists(result);
    });
    return unsubscribe;
  }, [currentUser]);

  const createList = async () => {
    if (!newListName.trim()) return;
    const newDoc = await addDoc(collection(db, 'todoLists'), {
      name: newListName,
      ownerId: currentUser?.uid,
      createdAt: new Date(),
      participants: [
        {
          email: currentUser?.email,
          role: 'admin',
          userId: currentUser?.uid,
        },
      ],
    });
    setNewListName('');
    setActiveListId(newDoc.id);
    setRole('admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">To-Do App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Привіт, {currentUser?.name}!</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Вийти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Мої списки</h2>

          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              className="border p-2 flex-1"
              placeholder="Назва нового списку"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button
              onClick={createList}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Створити
            </button>
          </div>

          <ul className="space-y-2">
            {lists.map((list) => (
              <li
                key={list.id}
                onClick={() => {
                  setActiveListId(list.id);
                  const userRole = list.participants.find(p => p.email === currentUser?.email)?.role;
                  setRole(userRole === 'admin' ? 'admin' : 'viewer');
                }}
                className={`p-2 rounded cursor-pointer ${activeListId === list.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              >
                {list.name}
              </li>
            ))}
          </ul>
        </div>

        
      </main>
    </div>
  );
};