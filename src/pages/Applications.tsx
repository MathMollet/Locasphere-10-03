import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProperties } from '../hooks/useProperties';
import { applicationService } from '../services/applicationService';
import { Application } from '../types/application';
import PageHeader from '../components/common/PageHeader';
import ApplicationCard from '../components/applications/ApplicationCard';
import ApplicationDetailsModal from '../components/applications/ApplicationDetailsModal';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function Applications() {
  const { user } = useAuth();
  const { properties } = useProperties();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  // Charger les candidatures au montage du composant
  useEffect(() => {
    if (user) {
      const ownerApplications = applicationService.getApplicationsByOwner(user.id);
      setApplications(ownerApplications);
    }
  }, [user]);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (applicationId: string, status: Application['status']) => {
    applicationService.updateApplicationStatus(applicationId, status);
    // Mettre à jour la liste des candidatures
    if (user) {
      const updatedApplications = applicationService.getApplicationsByOwner(user.id);
      setApplications(updatedApplications);
    }
    setIsDetailsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDeleteClick = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (applicationToDelete) {
      applicationService.deleteApplication(applicationToDelete);
      if (user) {
        const updatedApplications = applicationService.getApplicationsByOwner(user.id);
        setApplications(updatedApplications);
      }
      setIsDeleteModalOpen(false);
      setApplicationToDelete(null);
    }
  };

  const getPropertyForApplication = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Candidatures"
        description="Gérez les candidatures pour vos biens"
      />

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune candidature reçue pour le moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              property={getPropertyForApplication(application.propertyId)}
              onViewDetails={() => handleViewDetails(application)}
              onDelete={handleDeleteClick}
              currentUser={user}
            />
          ))}
        </div>
      )}

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          property={getPropertyForApplication(selectedApplication.propertyId)}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedApplication(null);
          }}
          onUpdateStatus={(status) => handleUpdateStatus(selectedApplication.id, status)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setApplicationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer la candidature"
        message="Êtes-vous sûr de vouloir supprimer définitivement cette candidature ? Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}