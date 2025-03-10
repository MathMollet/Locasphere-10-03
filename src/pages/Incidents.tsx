import React, { useState, useEffect } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';
import { useAuth } from '../contexts/AuthContext';
import { incidentService } from '../services/incidentService';
import IncidentCard from '../components/incidents/IncidentCard';
import IncidentDetailsModal from '../components/incidents/IncidentDetailsModal';
import PageHeader from '../components/common/PageHeader';
import { Incident } from '../types/incident';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function Incidents() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<string | null>(null);
  const {
    updateIncidentStatus,
    deleteIncident
  } = useIncidents();
  const { properties } = useProperties();
  const { tenants } = useTenants();

  useEffect(() => {
    if (user) {
      // Charger les incidents pour les biens du propriétaire
      const ownerProperties = properties.filter(p => p.ownerId === user.id);
      const ownerIncidents = ownerProperties.flatMap(property => 
        incidentService.getIncidentsByProperty(property.id)
      );
      setIncidents(ownerIncidents);
    }
  }, [user, properties]);

  const handleViewDetails = (incident: any) => {
    setSelectedIncident(incident);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (incidentId: string) => {
    setIncidentToDelete(incidentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (incidentToDelete) {
      deleteIncident(incidentToDelete);
      setIsDeleteModalOpen(false);
      setIncidentToDelete(null);
      // Recharger les incidents
      if (user) {
        const ownerProperties = properties.filter(p => p.ownerId === user.id);
        const ownerIncidents = ownerProperties.flatMap(property => 
          incidentService.getIncidentsByProperty(property.id)
        );
        setIncidents(ownerIncidents);
      }
    }
  };

  const getPropertyForIncident = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  const getTenantForIncident = (tenantId: string) => {
    return tenants.find(t => t.id === tenantId || t.email === tenantId);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Incidents signalés"
        description="Suivez et gérez les incidents signalés par vos locataires"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" key="incidents-grid">
        {incidents.length === 0 ? (
          <div className="lg:col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun incident signalé pour le moment
            </p>
          </div>
        ) : (
          incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              property={getPropertyForIncident(incident.propertyId)}
              tenant={getTenantForIncident(incident.tenantId)}
              onDelete={handleDeleteClick}
              onUpdateStatus={updateIncidentStatus}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          property={getPropertyForIncident(selectedIncident.propertyId)}
          tenant={getTenantForIncident(selectedIncident.tenantId)}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedIncident(null);
          }}
          onUpdateStatus={(status) => {
            updateIncidentStatus(selectedIncident.id, status);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIncidentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'incident"
        message="Êtes-vous sûr de vouloir supprimer définitivement cet incident ? Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}