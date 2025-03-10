import React from 'react';
import { FileText, Download, Upload } from 'lucide-react';
import { Property } from '../../types/property';
import { Tenant } from '../../types/tenant';

interface LeaseDocumentProps {
  tenant: Tenant;
  property: Property;
}

export default function LeaseDocument({ tenant }: LeaseDocumentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Espace contractuel
      </h3>

      <div className="space-y-4">
        {/* Contrat de location */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Contrat de location
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signé le {new Date(tenant.rentStartDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Attestation d'assurance */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Attestation d'assurance
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                Document manquant
              </p>
            </div>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            <Upload className="h-4 w-4" />
            <span>Ajouter</span>
            <input type="file" className="hidden" accept=".pdf" />
          </label>
        </div>

        {/* Preuve de paiement caution */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Preuve de paiement caution
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                Document manquant
              </p>
            </div>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            <Upload className="h-4 w-4" />
            <span>Ajouter</span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        </div>

        {/* Preuve de paiement premier loyer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Preuve de paiement premier loyer
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                Document manquant
              </p>
            </div>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            <Upload className="h-4 w-4" />
            <span>Ajouter</span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        </div>

        {/* État des lieux d'entrée */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                État des lieux d'entrée
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Réalisé le {new Date(tenant.rentStartDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}