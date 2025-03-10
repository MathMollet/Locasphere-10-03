import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import IncidentCard from '../components/incidents/IncidentCard';
import CreateIncidentModal from '../components/incidents/CreateIncidentModal';
import IncidentDetailsModal from '../components/incidents/IncidentDetailsModal';
import { useIncidents } from '../hooks/useIncidents';
import { useProperties } from '../hooks/useProperties';
import { useAuth } from '../contexts/AuthContext';
import { incidentService } from '../services/incidentService';
import { tenantService } from '../services/tenantService';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Incident } from '../types/incident';

export default function TenantIncidents() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<string | null>(null);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const { 
    incidents, 
    addIncident,
    selectedIncident,
    setSelectedIncident,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    updateIncidentStatus,
    deleteIncident
  } = useIncidents();
  const { properties } = useProperties();
  const { user } = useAuth();

  const handleCreateIncident = (incidentData: any) => {
    if (!user?.email) return;
    
    // Trouver le bien associé au locataire
    const tenant = tenantService.getTenants().find(t => t.id === user.email || t.email === user.email);
    if (!tenant) return;

    const incident = {
      ...incidentData,
      tenantId: tenant.id,
      propertyId: tenant.propertyId,
      status: 'reported', // Forcer le statut à "reported" pour un nouvel incident
    };

    addIncident(incident);
    setIsCreateModalOpen(false);
  };

  const handleEditIncident = (incident: Incident) => {
    setEditingIncident(incident);
    setIsCreateModalOpen(true);
  };

  const handleUpdateStatus = (incidentId: string, status: Incident['status']) => {
    updateIncidentStatus(incidentId, status);
    setIsDetailsModalOpen(false);
    setSelectedIncident(null);
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
    }
  };

  const getPropertyForIncident = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  // Filtrer les incidents pour n'afficher que ceux du locataire connecté
  const filteredIncidents = incidents.filter(incident => 
    incident.tenantId === user?.email || incident.tenantId === user?.id
  );

  return (
    <div className="p-8">
      <PageHeader
        title="Mes incidents"
        description="Suivez l'état de vos incidents signalés"
        action={{
          label: "Déclarer un incident",
          icon: PlusCircle,
          onClick: () => setIsCreateModalOpen(true)
        }}
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" key="incidents-grid">
        {filteredIncidents.length === 0 ? (
          <div className="lg:col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun incident signalé pour le moment
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              property={getPropertyForIncident(incident.propertyId)}
              onDelete={handleDeleteClick}
              onUpdateStatus={handleUpdateStatus}
              onEdit={handleEditIncident}
              onViewDetails={(incident) => {
                setSelectedIncident(incident);
                setIsDetailsModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingIncident(null);
        }}
        incident={editingIncident}
        onSubmit={handleCreateIncident}
      />

      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          property={getPropertyForIncident(selectedIncident.propertyId)}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedIncident(null);
          }}
          onUpdateStatus={(status) => handleUpdateStatus(selectedIncident.id, status)}
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