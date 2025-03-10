import React, { useState } from 'react';
import { FileText, Calendar, Phone, Mail, MessageSquare, Trash2, Building2, Briefcase, Euro, MapPin, Ruler, Users, Hash } from 'lucide-react';
import { Application } from '../../types/application';
import { Property } from '../../types/property';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { checkCriteriaMatching } from '../../utils/criteriaUtils';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import ContractSpaceModal from './ContractSpaceModal';
import CriteriaMatchingTag from './CriteriaMatchingTag';

interface ApplicationCardProps {
  application: Application;
  property: Property | undefined;
  onViewDetails: (application: Application) => void;
  onDelete?: (applicationId: string) => void;
  currentUser?: User;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400',
};

const statusLabels = {
  pending: 'En attente',
  accepted: 'Acceptée',
  rejected: 'Refusée',
  cancelled: 'Annulée',
};

export default function ApplicationCard({
  application,
  property,
  onViewDetails,
  onDelete,
  currentUser,
}: ApplicationCardProps) {
  const navigate = useNavigate();
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const handleCardClick = () => {
    onViewDetails(application);
  };

  const handleOpenChat = () => {
    // Empêcher la propagation pour éviter d'ouvrir les détails
    event?.stopPropagation();
    navigate(`/chat?applicant=applicant_${application.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 hover:shadow-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{property?.name}</h3>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {property?.address}, {property?.city}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {property && (
                <CriteriaMatchingTag 
                  matchingResult={checkCriteriaMatching(application, property)}
                  compact={true}
                />
              )}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                {statusLabels[application.status]}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {application.applicant.avatarUrl ? (
                <img
                  src={application.applicant.avatarUrl}
                  alt={`${application.applicant.firstName} ${application.applicant.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {application.applicant.firstName[0]}{application.applicant.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {application.applicant.firstName} {application.applicant.lastName}
                </h3>
                {property && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{property.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <p className="text-sm">Il y a {formatDistanceToNow(new Date(application.createdAt))}</p>
                {application.desiredStartDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Souhaite emménager le {new Date(application.desiredStartDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {application.documents.length} document{application.documents.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <span>{application.applicant.email}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2" />
              <span>{application.applicant.phone}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{
                application.applicant.currentSituation === 'employed' ? 'Salarié' :
                application.applicant.currentSituation === 'student' ? 'Étudiant' :
                application.applicant.currentSituation === 'self_employed' ? 'Auto-entrepreneur' :
                'Autre'
              }</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Euro className="h-4 w-4 mr-2" />
              <span>{application.applicant.monthlyIncome} €/mois</span>
            </div>
            {application.desiredStartDate && (
              <div className="flex items-center text-gray-600 dark:text-gray-400 col-span-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Souhaite emménager le {new Date(application.desiredStartDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {application.message && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {application.message}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChat();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/70"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </button>
            {application.status === 'accepted' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContractModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-900/50 px-3 py-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/70"
              >
                <Building2 className="h-4 w-4" />
                Espace contractuel
              </button>
            )}
            {application.status === 'rejected' && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(application.id);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/50 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/70"
                title="Supprimer la candidature"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      <ContractSpaceModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        application={application}
      />
    </>
  );
}