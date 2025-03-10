import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../forms/InputField';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

export default function LoginForm() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-[480px] space-y-12 bg-white p-8 sm:p-12 rounded-xl shadow-sm">
          <div className="space-y-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Connexion à Izimo
            </h2>
            <p className="text-center text-gray-500">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder="exemple@email.com"
                disabled={isLoading}
              />

              <InputField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={setPassword}
                required
                placeholder="Votre mot de passe"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>

              <div className="text-sm text-center">
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 inline-block mt-2"
                >
                  Pas encore de compte ? S'inscrire
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