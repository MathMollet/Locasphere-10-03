import React from 'react';
import { Search } from 'lucide-react';

interface FAQSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

export default function FAQSearch({
  searchTerm,
  onSearch,
  selectedCategory,
  categories,
  onCategoryChange
}: FAQSearchProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher une question..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="block w-48 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}