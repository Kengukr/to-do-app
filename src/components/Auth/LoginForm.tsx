import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const auth = useAuth();
  if (!auth) {
    throw new Error('AuthContext is undefined. Make sure you are using LoginForm inside an AuthProvider.');
  }
  const { login } = auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Обробка різних типів помилок Firebase
      let errorMessage = 'Помилка входу. Перевірте дані.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Користувач з таким email не знайдений.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Неправильний пароль.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Неправильний формат email.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Забагато спроб входу. Спробуйте пізніше.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Проблеми з мережею. Перевірте інтернет з\'єднання.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Акаунт відключено.';
            break;
          default:
            errorMessage = `Помилка: ${error.message}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Вхід</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Введіть email"
            title="Email"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Введіть пароль"
            title="Пароль"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Завантаження...' : 'Увійти'}
        </button>
      </form>

      <p className="text-center mt-4">
        Немає акаунту?{' '}
        <button
          onClick={onToggleMode}
          className="text-blue-500 hover:underline"
          disabled={loading}
        >
          Зареєструватися
        </button>
      </p>
    </div>
  );
};