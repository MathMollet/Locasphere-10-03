import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../forms/InputField';
import { UserRole } from '../../types/user';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

export default function RegisterForm() {
  const { register, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'owner' as UserRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-12 bg-white p-8 sm:p-12 rounded-xl shadow-sm">
          <div className="space-y-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Créer un compte Izimo
            </h2>
            <p className="text-center text-gray-500">
              Rejoignez notre communauté de propriétaires et locataires
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                  label="Nom"
                  value={formData.lastName}
                  onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                  disabled={isLoading}
                  required
                />
                <InputField
                  label="Prénom"
                  value={formData.firstName}
                  onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                disabled={isLoading}
                required
                placeholder="exemple@email.com"
              />
              
              <InputField
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                disabled={isLoading}
                required
                placeholder="Votre mot de passe"
              />
              
              <InputField
                label="Confirmer le mot de passe"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                disabled={isLoading}
                required
                placeholder="Confirmez votre mot de passe"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Type de compte
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'owner' }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'owner'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <span className={`text-lg font-medium ${formData.role === 'owner' ? 'text-indigo-600' : 'text-gray-900'}`}>
                      Propriétaire
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'tenant' }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'tenant'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <span className={`text-lg font-medium ${formData.role === 'tenant' ? 'text-indigo-600' : 'text-gray-900'}`}>
                      Locataire
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </button>

              <div className="text-sm text-center">
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Déjà un compte ? Se connecter
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}