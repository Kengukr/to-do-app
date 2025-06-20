import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Базова валідація
    if (formData.password.length < 6) {
      setError('Пароль має бути мінімум 6 символів');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      setLoading(false);
      return;
    }

    try {
      console.log('Спроба реєстрації з:', {
        name: formData.name,
        email: formData.email,
        passwordLength: formData.password.length
      });
      
      await register(formData.email, formData.password, formData.name);
      console.log('Реєстрація успішна!');
    } catch (error: any) {
      console.error('Детальна помилка:', error);
      
      // Більш детальні повідомлення про помилки
      let errorMessage = 'Невідома помилка';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Цей email вже використовується';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Невірний формат email';
            break;
          case 'auth/weak-password':
            errorMessage = 'Пароль занадто слабкий';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Проблема з мережею. Перевірте інтернет';
            break;
          default:
            errorMessage = `Помилка: ${error.code} - ${error.message}`;
        }
      } else {
        errorMessage = error.message || 'Помилка реєстрації';
      }
      
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ім'я
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={2}
            placeholder="Введіть ім'я"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Введіть email"
            title="Email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Пароль (мінімум 6 символів)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
            title="Пароль (мінімум 6 символів)"
            placeholder="Введіть пароль"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Підтвердити пароль
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
            title="Підтвердити пароль"
            placeholder="Підтвердьте пароль"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Завантаження...' : 'Зареєструватися'}
        </button>
      </form>

      <p className="text-center mt-4">
        Вже маєте акаунт?{' '}
        <button
          onClick={onToggleMode}
          className="text-blue-500 hover:underline"
        >
          Увійти
        </button>
      </p>
    </div>
  );
};