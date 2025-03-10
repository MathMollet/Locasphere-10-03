import { applicationService } from './applicationService';
import { tenantService } from './tenantService';
import { Property } from '../types/property';

export const adminService = {
  // Réinitialiser les données de test
  resetTestData(properties: Property[]) {
    // Supprimer toutes les candidatures
    applicationService.clearAllApplications();
    
    // Ajouter un locataire fictif par bien
    tenantService.addMockTenants(properties);
  }
};