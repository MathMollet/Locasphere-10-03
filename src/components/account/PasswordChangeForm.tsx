import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../forms/InputField';

export default function PasswordChangeForm() {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      const success = await changePassword(formData.currentPassword, formData.newPassword);
      if (success) {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError('Le mot de passe actuel est incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Votre mot de passe a été modifié avec succès
          </p>
        </div>
      )}

      <InputField
        label="Mot de passe actuel"
        type="password"
        value={formData.currentPassword}
        onChange={(value) => setFormData(prev => ({ ...prev, currentPassword: value }))}
        required
        disabled={isLoading}
      />

      <InputField
        label="Nouveau mot de passe"
        type="password"
        value={formData.newPassword}
        onChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
        required
        disabled={isLoading}
      />

      <InputField
        label="Confirmer le nouveau mot de passe"
        type="password"
        value={formData.confirmPassword}
        onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
        required
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
      </button>
    </form>
  );
}