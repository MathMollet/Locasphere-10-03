import React from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import InputField from '../forms/InputField';

interface SearchFormProps {
  filters: {
    city: string;
    propertyTypes: string[];
    minPrice: string;
    maxPrice: string;
    minSurface: string;
    maxSurface: string;
    rooms: string;
    isFurnished: boolean | null;
    isSharedLiving: boolean | null;
    exterior: string[];
  };
  onFilterChange: (key: string, value: string) => void;
  onMultiSelectChange: (key: string, values: string[]) => void;
  onBooleanChange: (key: string, value: boolean | null) => void;
  onSearch: () => void;
}

const propertyTypeOptions = [
  { value: 'house', label: 'Maison' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'building', label: 'Immeuble' },
  { value: 'loft', label: 'Loft' }
];

const exteriorOptions = [
  { value: 'balcony', label: 'Balcon' },
  { value: 'terrace', label: 'Terrasse' },
  { value: 'garden', label: 'Jardin' },
  { value: 'patio', label: 'Patio' }
];

export default function SearchForm({ 
  filters, 
  onFilterChange, 
  onMultiSelectChange,
  onBooleanChange,
  onSearch 
}: SearchFormProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-4 w-full">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          title={isExpanded ? "Masquer les filtres" : "Afficher les filtres"}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        <div>
          <button
            type="submit"
            className="self-end px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Rechercher
          </button>
        </div>
      </div>

      <div className={`mt-4 flex flex-wrap gap-4 items-end ${isExpanded ? '' : 'hidden'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ville
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            placeholder="Ex: Paris"
            className="block w-40 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type de biens
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.propertyTypes.length === 0}
                onChange={() => onMultiSelectChange('propertyTypes', [])}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Tous</span>
            </label>
            {propertyTypeOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={filters.propertyTypes.includes(option.value)}
                  onChange={() => onMultiSelectChange('propertyTypes', [option.value])}
                  className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Loyer mensuel (charges comprises)
          </label>
          <div className="flex gap-2">
            <InputField
              label=""
              type="number"
              value={filters.minPrice}
              onChange={(value) => onFilterChange('minPrice', value)}
              placeholder="Min €"
              className="w-24"
            />
            <InputField
              label=""
              type="number"
              value={filters.maxPrice}
              onChange={(value) => onFilterChange('maxPrice', value)}
              placeholder="Max €"
              className="w-24"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Surface
          </label>
          <div className="flex gap-2">
            <InputField
              label=""
              type="number"
              value={filters.minSurface}
              onChange={(value) => onFilterChange('minSurface', value)}
              placeholder="Min m²"
              className="w-24"
            />
            <InputField
              label=""
              type="number"
              value={filters.maxSurface}
              onChange={(value) => onFilterChange('maxSurface', value)}
              placeholder="Max m²"
              className="w-24"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de pièces
          </label>
          <select
            value={filters.rooms}
            onChange={(e) => onFilterChange('rooms', e.target.value)}
            className="block w-32 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Tous</option>
            <option value="1">1 pièce</option>
            <option value="2">2 pièces</option>
            <option value="3">3 pièces</option>
            <option value="4">4 pièces</option>
            <option value="5">5 pièces et +</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meublé
          </label>
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.isFurnished === true}
                onChange={() => onBooleanChange('isFurnished', true)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.isFurnished === false}
                onChange={() => onBooleanChange('isFurnished', false)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.isFurnished === null}
                onChange={() => onBooleanChange('isFurnished', null)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Indifférent</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Colocation
          </label>
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.isSharedLiving === true}
                onChange={() => onBooleanChange('isSharedLiving', true)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.isSharedLiving === false}
                onChange={() => onBooleanChange('isSharedLiving', false)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.isSharedLiving === null}
                onChange={() => onBooleanChange('isSharedLiving', null)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Indifférent</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Extérieur
          </label>
          <div className="flex gap-2">
            {exteriorOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.exterior.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...filters.exterior, option.value]
                      : filters.exterior.filter(v => v !== option.value);
                    onMultiSelectChange('exterior', newValues);
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}