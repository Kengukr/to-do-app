import React, { act, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { TodoListsPage } from './components/TodoLists/TodoListsPage';
import './index.css';
import { ParticipantForm } from './components/Lists/ParticipantForm';
import { TasksList } from './components/Tasks/TasksList';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {isLogin ? (
        <LoginForm onToggleMode={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onToggleMode={() => setIsLogin(true)} />
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
    // Поки що просто виводимо в консоль
    console.log('Вибрано список:', listId);
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">To-Do App</h1>
            {selectedListId && (
              <button
                onClick={handleBackToLists}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                ← Назад до списків
              </button>
            )}
          </div>
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

      <main className="max-w-7xl mx-auto p-4">
  {selectedListId ? (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Завдання для списку {selectedListId}</h2>
      <TasksList listId={selectedListId} />
    </div>
  ) : (
    <div>
      <h2 className="text-xl font-bold mb-6">Мої списки завдань</h2>
      <TodoListsPage onListSelect={handleListSelect} />
    </div>
  )}
</main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Dashboard /> : <AuthPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;