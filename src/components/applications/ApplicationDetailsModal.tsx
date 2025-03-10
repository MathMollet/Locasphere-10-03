import React from 'react';
import { X, Download, Calendar, Phone, Mail, Building2, User, FileDown, Briefcase, Euro } from 'lucide-react';
import { Application } from '../../types/application';
import { Property } from '../../types/property';
import { checkCriteriaMatching } from '../../utils/criteriaUtils';
import CriteriaMatchingBadge from './CriteriaMatchingBadge';

const documentTypeLabels = {
  // Documents de candidature
  id_card: 'Carte d\'identité',
  employment_contract: 'Contrat de travail',
  payslip: 'Bulletin de salaire',
  tax_notice: 'Avis d\'imposition',
  proof_of_address: 'Justificatif de domicile',
};

interface ApplicationDetailsModalProps {
  application: Application;
  property: Property | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (status: Application['status']) => void;
  tenant?: { firstName: string; lastName: string };
}

export default function ApplicationDetailsModal({
  application,
  property,
  isOpen,
  onClose,
  onUpdateStatus,
  tenant,
}: ApplicationDetailsModalProps) {
  if (!isOpen) return null;

  const matchingResult = property ? checkCriteriaMatching(application, property) : null;

  const tenantDocuments = application.documents.filter(
    doc => !doc.type.startsWith('guarantor_')
  );

  const guarantorDocuments = application.documents.filter(
    doc => doc.type.startsWith('guarantor_')
  );

  const handleExportAllDocuments = () => {
    application.documents.forEach(doc => {
      window.open(doc.url, '_blank');
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dossier de candidature
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Candidature reçue le {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportAllDocuments}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                <FileDown className="h-4 w-4" />
                Exporter tous les documents
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div className="p-6 space-y-8">
            {/* Badge de correspondance des critères */}
            {matchingResult && (
              <CriteriaMatchingBadge matchingResult={matchingResult} />
            )}

            {/* Informations du candidat */}
            <div>
              <div className="flex items-start gap-4">
                {application.applicant.avatarUrl ? (
                  <img
                    src={application.applicant.avatarUrl}
                    alt={`${application.applicant.firstName} ${application.applicant.lastName}`}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600 dark:text-gray-300">
                      {application.applicant.firstName[0]}{application.applicant.lastName[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {application.applicant.firstName} {application.applicant.lastName}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{application.applicant.email}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{application.applicant.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations sur le bien */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {application.title}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Bien concerné</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{property?.name}</p>
                  </div>
                </div>
                {application.desiredStartDate && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Date souhaitée</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(application.desiredStartDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {tenant && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Locataire</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tenant.firstName} {tenant.lastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations du candidat */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{application.applicant.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{application.applicant.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Âge</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {application.applicant.age || 'Non renseigné'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Briefcase className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Situation</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {application.applicant.currentSituation === 'employed' ? 'Salarié' :
                     application.applicant.currentSituation === 'student' ? 'Étudiant' :
                     application.applicant.currentSituation === 'self_employed' ? 'Auto-entrepreneur' :
                     'Autre'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Euro className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Revenu mensuel</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {application.applicant.monthlyIncome} €/mois
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Garant</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {application.hasGuarantor ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>
            </div>

            {/* Présentation */}
            {application.applicant.presentation && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Présentation</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {application.applicant.presentation}
                  </p>
                </div>
              </div>
            )}

            {/* Message */}
            {application.message && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Message</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {application.message}
                </p>
              </div>
            )}

            {/* Documents */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h4>
              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {documentTypeLabels[doc.type]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ajouté le {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(doc.url, '_blank')}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onUpdateStatus('rejected')}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500"
            >
              Refuser
            </button>
            <button
              onClick={() => onUpdateStatus('accepted')}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-500"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}