import React, { useState } from 'react';
import { Scale, Calculator, Shield, FileText } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import ResourceCard from '../components/resources/ResourceCard';
import PageHeader from '../components/common/PageHeader';
import { ResourceCategory } from '../types/resource';

const categories: ResourceCategory[] = [
  {
    id: 'legal',
    name: 'Juridique',
    description: 'Réglementation et obligations légales',
    icon: Scale,
  },
  {
    id: 'fiscal',
    name: 'Fiscal',
    description: 'Fiscalité et déclarations',
    icon: Calculator,
  },
  {
    id: 'insurance',
    name: 'Assurance',
    description: 'Protection et garanties',
    icon: Shield,
  },
  {
    id: 'templates',
    name: 'Modèles',
    description: 'Documents types',
    icon: FileText,
  },
];

export default function Resources() {
  const { getResourcesByCategory } = useResources();
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory['id']>('legal');

  return (
    <div className="p-8">
      <PageHeader
        title="Ressources"
        description="Articles et modèles de documents pour vous aider dans votre gestion locative"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/50 ring-2 ring-indigo-600 dark:ring-indigo-400'
                  : 'bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 dark:bg-indigo-800'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    selectedCategory === category.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    selectedCategory === category.id
                      ? 'text-indigo-900 dark:text-indigo-100'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {getResourcesByCategory(selectedCategory).map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}