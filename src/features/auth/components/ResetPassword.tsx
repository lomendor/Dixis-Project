import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { resetPassword, error, loading } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>();
  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (token) {
      await resetPassword(token, data.password);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Επαναφορά Κωδικού</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Νέος Κωδικός
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            {...register('password', {
              required: 'Ο κωδικός είναι υποχρεωτικός',
              minLength: {
                value: 8,
                message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες'
              }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Επιβεβαίωση Κωδικού
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            {...register('confirmPassword', {
              required: 'Η επιβεβαίωση κωδικού είναι υποχρεωτική',
              validate: value => value === password || 'Οι κωδικοί δεν ταιριάζουν'
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Παρακαλώ περιμένετε...' : 'Αλλαγή Κωδικού'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; 