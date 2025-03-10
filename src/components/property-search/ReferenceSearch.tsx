import React, { useState } from 'react';
import { Search } from 'lucide-react';
import InputField from '../forms/InputField';
import { Property } from '../../types/property';

interface ReferenceSearchProps {
  onPropertyFound: (property: Property | null) => void;
  findPropertyByReference: (reference: string) => Property | null;
}

export default function ReferenceSearch({ onPropertyFound, findPropertyByReference }: ReferenceSearchProps) {
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedReference = reference.trim();
    
    if (!trimmedReference) {
      setError('Veuillez entrer une référence');
      onPropertyFound(null);
      return;
    }
    
    const property = findPropertyByReference(trimmedReference);
    
    if (property) {
      onPropertyFound(property);
    } else {
      setError('Aucun bien disponible trouvé avec cette référence. Vérifiez que la référence est correcte ou recherchez votre bien via la recherche par critère');
      onPropertyFound(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Référence du bien
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Entrez la référence du bien (ex: IZIMO-123456-ABC)"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Rechercher
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}