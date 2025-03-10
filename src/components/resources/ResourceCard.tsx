import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Resource } from '../../types/resource';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {resource.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {resource.description}
            </p>
          </div>
          <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
            resource.type === 'article'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
          }`}>
            {resource.type === 'article' ? 'Article' : 'Modèle'}
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => window.open(resource.url, '_blank')}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/70"
          >
            {resource.type === 'article' ? (
              <>
                <FileText className="h-4 w-4" />
                Lire l'article
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Télécharger
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}