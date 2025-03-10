import React from 'react';
import { X, FileText, Download, Shield, CreditCard, ClipboardCheck } from 'lucide-react';
import { Application } from '../../types/application';

interface ContractSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
}

const contractDocuments = [
  {
    id: 'lease',
    name: 'Bail de location',
    icon: FileText,
    status: 'pending',
  },
  {
    id: 'insurance',
    name: 'Attestation d\'assurance',
    icon: Shield,
    status: 'pending',
  },
  {
    id: 'deposit',
    name: 'Justificatif paiement caution',
    icon: CreditCard,
    status: 'pending',
  },
  {
    id: 'first_rent',
    name: 'Justificatif paiement premier loyer',
    icon: CreditCard,
    status: 'pending',
  },
  {
    id: 'inventory',
    name: 'État des lieux d\'entrée',
    icon: ClipboardCheck,
    status: 'pending',
  },
];

export default function ContractSpaceModal({
  isOpen,
  onClose,
  application,
}: ContractSpaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Espace contractuel
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Documents contractuels pour {application.applicant.firstName} {application.applicant.lastName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents contractuels
              </h3>
              <div className="space-y-3">
                {contractDocuments.map((doc) => {
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.status === 'pending' ? 'En attente' : 'Document reçu'}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={doc.status === 'pending'}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}