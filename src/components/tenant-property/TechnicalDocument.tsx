import React from 'react';
import { FileText, Download, Wrench, Zap, Thermometer } from 'lucide-react';
import { Property } from '../../types/property';

interface TechnicalDocumentProps {
  property: Property;
}

export default function TechnicalDocument({ property }: TechnicalDocumentProps) {
  const technicalDocuments = [
    {
      id: 'dpe',
      name: 'Diagnostic de Performance Énergétique',
      icon: Thermometer,
      date: '2024-01-15',
      type: 'energy',
      class: property.energyClass,
    },
    {
      id: 'electricity',
      name: 'Diagnostic électrique',
      icon: Zap,
      date: '2024-01-15',
      type: 'security',
    },
    {
      id: 'maintenance',
      name: 'Carnet d\'entretien',
      icon: Wrench,
      date: '2024-01-15',
      type: 'maintenance',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Documents techniques
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicalDocuments.map((doc) => {
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {doc.name}
                  </p>
                  {doc.type === 'energy' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Classe {doc.class}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mis à jour le {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
                <Download className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}