import { useState, useEffect } from 'react';
import { Incident } from '../types/incident';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../contexts/AuthContext';

export function useIncidents() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Charger les incidents au montage du composant
      const loadedIncidents = incidentService.getIncidentsByTenant(user.email);
      setIncidents(loadedIncidents);
    }
  }, [user]);

  const updateIncidentStatus = (incidentId: string, status: Incident['status']) => {
    try {
      const updatedIncident = incidentService.updateIncident(incidentId, { status });
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId ? updatedIncident : incident
        )
      );
    } catch (error) {
      console.error('Error updating incident status:', error);
      throw error;
    }
  };

  const addIncident = (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newIncident = incidentService.createIncident(incident);
      setIncidents(prev => [...prev, newIncident]);
    } catch (error) {
      console.error('Error adding incident:', error);
    }
  };

  const deleteIncident = (incidentId: string) => {
    try {
      incidentService.deleteIncident(incidentId);
      setIncidents(prev => prev.filter(incident => incident.id !== incidentId));
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  return {
    incidents,
    selectedIncident,
    setSelectedIncident,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    updateIncidentStatus,
    addIncident,
    deleteIncident,
  };
}