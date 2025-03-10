import React, { useState } from 'react';
import { X, Users, Building2 } from 'lucide-react';
import { Tenant } from '../../types/tenant';
import { Application } from '../../types/application';

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (contactId: string, name: string, propertyName: string, role: 'tenant' | 'applicant') => void;
  tenants: Tenant[];
  applications: Application[];
  properties: { id: string; name: string; }[];
}

export default function CreateConversationModal({
  isOpen,
  onClose,
  onCreateConversation,
  tenants,
  applications,
  properties,
}: CreateConversationModalProps) {
  const [selectedType, setSelectedType] = useState<'tenant' | 'applicant'>('tenant');

  if (!isOpen) return null;

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || 'Bien inconnu';
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nouvelle conversation
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de contact
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedType('tenant')}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  selectedType === 'tenant'
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Users className={`h-6 w-6 mx-auto mb-2 ${
                  selectedType === 'tenant'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium text-center ${
                  selectedType === 'tenant'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Locataire
                </p>
              </button>
              <button
                onClick={() => setSelectedType('applicant')}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  selectedType === 'applicant'
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/50'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Building2 className={`h-6 w-6 mx-auto mb-2 ${
                  selectedType === 'applicant'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium text-center ${
                  selectedType === 'applicant'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Candidat
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {selectedType === 'tenant' ? (
              tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => onCreateConversation(
                    tenant.id,
                    `${tenant.firstName} ${tenant.lastName}`,
                    getPropertyName(tenant.propertyId),
                    'tenant'
                  )}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {tenant.firstName[0]}{tenant.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {tenant.firstName} {tenant.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getPropertyName(tenant.propertyId)}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              applications.map((application) => (
                <button
                  key={application.id}
                  onClick={() => onCreateConversation(
                    `applicant_${application.id}`,
                    `${application.applicant.firstName} ${application.applicant.lastName}`,
                    getPropertyName(application.propertyId),
                    'applicant'
                  )}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {application.applicant.firstName[0]}{application.applicant.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.applicant.firstName} {application.applicant.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getPropertyName(application.propertyId)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}