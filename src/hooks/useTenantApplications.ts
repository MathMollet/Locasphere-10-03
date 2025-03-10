import { useState, useEffect } from 'react';
import { Application } from '../types/application';
import { Property } from '../types/property';
import { applicationService } from '../services/applicationService';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../contexts/AuthContext';

export function useTenantApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [propertiesMap, setPropertiesMap] = useState<Record<string, Property>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);
        const userApplications = applicationService.getApplicationsByApplicant(user.email);
        setApplications(userApplications);

        // Charger les propriétés associées
        const properties: Record<string, Property> = {};
        for (const app of userApplications) {
          const property = propertyService.getPropertyById(app.propertyId);
          if (property) {
            properties[app.propertyId] = property;
          }
        }
        setPropertiesMap(properties);
        setError(null);
      } catch (err) {
        console.error('Error loading applications:', err);
        setError('Erreur lors du chargement des candidatures');
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [user?.email]);

  const getPropertyForApplication = (propertyId: string): Property | undefined => {
    return propertiesMap[propertyId];
  };

  const cancelApplication = (applicationId: string) => {
    try {
      applicationService.cancelApplication(applicationId);
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'cancelled' } 
            : app
        )
      );
    } catch (error) {
      console.error('Error cancelling application:', error);
      throw error;
    }
  };

  const deleteApplication = (applicationId: string) => {
    try {
      applicationService.deleteApplication(applicationId);
      setApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };

  return {
    applications,
    propertiesMap,
    isLoading,
    error,
    getPropertyForApplication,
    cancelApplication,
    deleteApplication
  };
}