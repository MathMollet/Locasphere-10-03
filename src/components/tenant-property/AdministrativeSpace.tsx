import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Property } from '../../types/property';
import { Tenant } from '../../types/tenant';

interface AdministrativeSpaceProps {
  tenant: Tenant;
  property: Property;
}

export default function AdministrativeSpace({ tenant }: AdministrativeSpaceProps) {
  const documents = [
    {
      id: 'rent_call_march',
      name: 'Appel de loyer - Mars 2024',
      date: '2024-03-01',
      type: 'rent_call'
    },
    {
      id: 'rent_receipt_march',
      name: 'Quittance de loyer - Mars 2024',
      date: '2024-03-31',
      type: 'rent_receipt'
    },
    {
      id: 'rent_call_february',
      name: 'Appel de loyer - Février 2024',
      date: '2024-02-01',
      type: 'rent_call'
    },
    {
      id: 'rent_receipt_february',
      name: 'Quittance de loyer - Février 2024',
      date: '2024-02-28',
      type: 'rent_receipt'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filtres par année */}
      <div className="flex gap-2">
        <select
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* Liste des documents */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Généré le {new Date(doc.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}