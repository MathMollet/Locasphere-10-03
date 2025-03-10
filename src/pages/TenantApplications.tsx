import React, { useState } from 'react';
import { Building2, Trash2, MapPin, Ruler, Home, Check, Calendar, Euro } from 'lucide-react';
import { useTenantApplications } from '../hooks/useTenantApplications';
import PageHeader from '../components/common/PageHeader';
import PropertyDetailsModal from '../components/property-search/PropertyDetailsModal';
import ContractSpaceModal from '../components/applications/ContractSpaceModal';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function TenantApplications() {
  const {
    applications,
    propertiesMap,
    isLoading,
    error,
    getPropertyForApplication,
    cancelApplication,
    deleteApplication
  } = useTenantApplications();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleViewProperty = (propertyId: string) => {
    const property = getPropertyForApplication(propertyId);
    if (property) {
      setSelectedPropertyId(propertyId);
      setIsPropertyModalOpen(true);
    } else {
      console.error('Property not found:', propertyId);
    }
  };

  const handleOpenContractSpace = (application: Application) => {
    setSelectedApplication(application);
    setIsContractModalOpen(true);
  };

  const handleCancelApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsCancelModalOpen(true);
  };

  const handleDeleteApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsDeleteModalOpen(true);
  };

  const confirmCancelApplication = () => {
    if (selectedApplicationId) {
      cancelApplication(selectedApplicationId);
      setIsCancelModalOpen(false);
      setSelectedApplicationId(null);
    }
  };

  const confirmDeleteApplication = () => {
    if (selectedApplicationId) {
      deleteApplication(selectedApplicationId);
      setIsDeleteModalOpen(false);
      setSelectedApplicationId(null);
    }
  };

  // Filtrer les candidatures selon le statut sélectionné
  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  if (isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="Mes candidatures"
          description="Suivez l'état de vos candidatures"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Acceptées</option>
          <option value="rejected">Refusées</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune candidature trouvée
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApplications.map((application) => {
            const property = getPropertyForApplication(application.propertyId);
            return (
              <div
                key={application.id}
                onClick={() => property && handleViewProperty(property.id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer h-full"
              >
                {property?.photos?.[0] && (
                  <div className="h-40">
                    <img
                      src={property.photos[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {property?.name || 'Bien non disponible'}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Candidature du {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                        : application.status === 'accepted'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400'
                    }`}>
                      {application.status === 'pending' ? 'En attente' :
                       application.status === 'accepted' ? 'Acceptée' :
                       application.status === 'rejected' ? 'Refusée' : 'Annulée'}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
                    <div className="flex items-center text-gray-500">
                      <Building2 className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        {property?.type === 'apartment' ? 'Appartement' :
                         property?.type === 'house' ? 'Maison' :
                         property?.type === 'commercial' ? 'Local commercial' : 'Autre'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      <span className="truncate" title={property?.address}>
                        {property?.address}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Ruler className="h-3.5 w-3.5 mr-1.5" />
                      <span>{property?.surface} m²</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Home className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        {property?.numberOfRooms} pièce{property?.numberOfRooms !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        {property?.isFurnished ? 'Meublé' : 'Non meublé'}
                      </span>
                    </div>
                    {property?.availableFrom && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>
                          Disponible le {new Date(property.availableFrom).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Euro className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        {property?.rentAmount + property?.charges} €/mois CC
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                      <Euro className="h-4 w-4 mr-1" />
                      <span className="text-lg font-semibold">
                        {property?.rentAmount + property?.charges}
                      </span>
                      <span className="text-sm text-gray-500">/mois CC</span>
                    </div>
                    <div className="flex gap-2">
                    {application.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelApplication(application.id);
                        }}
                        className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                      >
                        Annuler
                      </button>
                    )}
                    {application.status === 'accepted' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenContractSpace(application);
                        }}
                        className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100"
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        Espace contractuel
                      </button>
                    )}
                    {application.status === 'cancelled' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteApplication(application.id);
                        }}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPropertyId && propertiesMap[selectedPropertyId] && (
        <PropertyDetailsModal
          property={propertiesMap[selectedPropertyId]}
          isOpen={isPropertyModalOpen}
          onClose={() => {
            setIsPropertyModalOpen(false);
            setSelectedPropertyId(null);
          }}
          hideSubmitButton={true}
        />
      )}

      {selectedApplication && (
        <ContractSpaceModal
          isOpen={isContractModalOpen}
          onClose={() => {
            setIsContractModalOpen(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
        />
      )}

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancelApplication}
        title="Annuler la candidature"
        message="Êtes-vous sûr de vouloir annuler cette candidature ? Cette action est irréversible."
        confirmLabel="Annuler la candidature"
        cancelLabel="Retour"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteApplication}
        title="Supprimer la candidature"
        message="Êtes-vous sûr de vouloir supprimer définitivement cette candidature ? Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}