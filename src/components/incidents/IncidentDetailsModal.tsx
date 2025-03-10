import React, { useState } from 'react';
import { X, Calendar, Wrench, Clock, Euro, Building2, User, Download } from 'lucide-react';
import { Incident } from '../../types/incident';
import ConfirmationModal from '../common/ConfirmationModal';
import { formatDate } from '../../utils/dateUtils';
import { Property } from '../../types/property';
import IncidentComments from './IncidentComments';
import { useAuth } from '../../contexts/AuthContext';

interface IncidentDetailsModalProps {
  incident: Incident;
  property: Property | undefined;
  tenant: { firstName: string; lastName: string } | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (status: Incident['status']) => void;
}

const typeLabels = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  heating: 'Chauffage',
  appliance: 'Électroménager',
  structural: 'Structure',
  other: 'Autre',
};

const statusLabels = {
  cancelled_owner: 'Annulé propriétaire',
  in_charge: 'Pris en charge',
  in_progress: 'En cours de résolution',
  resolved: 'Résolu'
};

const statusMessages = {
  cancelled_tenant: 'Souhaitez-vous annuler cet incident ?',
  reported: 'Souhaitez-vous signaler cet incident au propriétaire ?',
  in_charge: 'Souhaitez vous passer l\'incident au statut "Pris en charge" ? Ce statut permet d\'informer votre locataire que vous allez traiter l\'incident',
  cancelled_owner: 'Souhaitez vous passer l\'incident au statut "Annulé propriétaire" ? Ce statut est pertinent si l\'incident remonté n\'est pas un réel incident.',
  in_progress: 'Souhaitez vous passer l\'incident au statut "En cours de résolution" ? Ce statut permet d\'informer votre locataire qu\'un rendez-vous technique à été pris par vos soin ou par un professionnel',
  resolved: 'Souhaitez vous passer l\'incident au statut "Résolu" ? Ce statut permet d\'informer votre locataire que l\'incident est résolu',
  closed: 'Confirmez-vous que l\'incident est bien résolu et peut être clôturé ?'
};

export default function IncidentDetailsModal({
  incident,
  property,
  tenant,
  isOpen,
  onClose,
  onUpdateStatus,
}: IncidentDetailsModalProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Incident['status'] | null>(null);
  const { user } = useAuth();

  const handleStatusChange = (status: Incident['status']) => {
    setSelectedStatus(status);
    setIsConfirmationOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedStatus) {
      onUpdateStatus(selectedStatus);
      setIsConfirmationOpen(false);
      setSelectedStatus(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Détails de l'incident
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div className="p-6 space-y-8">
            {/* Informations principales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {incident.title}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Bien concerné</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{property?.name}</p>
                  </div>
                </div>
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

            {/* Détails de l'incident */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Wrench className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Type d'incident</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{typeLabels[incident.type]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Date de signalement</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {incident.scheduledDate && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Date d'intervention prévue
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(incident.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {incident.estimatedCost && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Euro className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Coût estimé</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {incident.estimatedCost} €
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {incident.description}
              </p>
            </div>

            {/* Photos */}
            {incident.photos.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Photos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {incident.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt="Incident"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => window.open(photo.url, '_blank')}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <Download className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Résolution */}
            {incident.resolution && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Résolution</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {incident.resolution}
                </p>
              </div>
            )}

            {/* Commentaires */}
            {incident.status !== 'draft' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commentaires</h4>
                <IncidentComments
                  incident={incident}
                  onUpdateIncident={(updatedIncident) => {
                    onUpdateStatus(updatedIncident.status);
                  }}
                  currentUser={user}
                  disabled={incident.status === 'resolved'}
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <select
              value={selectedStatus || incident.status}
              onChange={(e) => handleStatusChange(e.target.value as Incident['status'])}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ConfirmationModal
      isOpen={isConfirmationOpen}
      onClose={() => {
        setIsConfirmationOpen(false);
        setSelectedStatus(null);
      }}
      onConfirm={handleConfirmStatusChange}
      title="Confirmation du changement de statut"
      message={selectedStatus ? statusMessages[selectedStatus] : ''}
      confirmLabel="Confirmer"
      cancelLabel="Annuler"
    />
    </>
  );
}