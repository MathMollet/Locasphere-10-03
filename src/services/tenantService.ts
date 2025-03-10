import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { Tenant } from '../types/tenant';
import { Property } from '../types/property';
import { Application } from '../types/application';

const TENANTS_STORAGE_KEY = 'izimo_tenants';

export const tenantService = {
  getTenants() {
    return storage.get(TENANTS_STORAGE_KEY) || [];
  },

  saveTenants(tenants: Tenant[]) {
    storage.set(TENANTS_STORAGE_KEY, tenants);
  },

  createTenant(tenant: Omit<Tenant, 'id'>) {
    const tenants = this.getTenants();
    const newTenant = {
      id: uuidv4(),
      ...tenant,
    };
    tenants.push(newTenant);
    this.saveTenants(tenants);
    return newTenant;
  },

  getTenantsByProperty(propertyId: string) {
    return this.getTenants().filter(tenant => tenant.propertyId === propertyId);
  },

  createTenantFromApplication(application: Application) {
    // Vérifier si un locataire existe déjà pour ce bien
    const tenants = this.getTenants();
    const existingTenant = tenants.find(t => 
      t.id === application.applicant.email && 
      t.propertyId === application.propertyId
    );
    
    if (existingTenant) {
      return existingTenant;
    }

    const newTenant: Tenant = {
      id: application.applicant.email, // Utiliser l'email comme ID pour correspondre à l'ID de l'utilisateur
      firstName: application.applicant.firstName,
      lastName: application.applicant.lastName,
      email: application.applicant.email,
      phone: application.applicant.phone,
      propertyId: application.propertyId,
      documents: application.documents.map(doc => ({
        ...doc,
        type: doc.type as any // Conversion du type de document
      })),
      rentStartDate: new Date().toISOString(),
      status: 'active',
      avatarUrl: application.applicant.avatarUrl
    };

    tenants.push(newTenant);
    this.saveTenants(tenants);

    return newTenant;
  },

  addMockTenants(properties) {
    // Supprimer les locataires existants
    this.saveTenants([]);

    // Créer un locataire fictif pour chaque bien
    properties.forEach((property, index) => {
      const mockTenant = {
        firstName: ['Marie', 'Thomas', 'Julie', 'Lucas'][index] || `Locataire ${index + 1}`,
        lastName: ['Lambert', 'Martin', 'Dubois', 'Petit'][index] || `Nom ${index + 1}`,
        email: `locataire${index + 1}@example.com`,
        phone: `06 ${String(Math.floor(10000000 + Math.random() * 90000000)).match(/.{2}/g)?.join(' ') || ''}`,
        propertyId: property.id,
        documents: [],
        rentStartDate: new Date(2024, index, 1).toISOString(),
        status: 'active',
        avatarUrl: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
        ][index] + '?auto=format&fit=facearea&w=128&h=128&q=80',
      };

      this.createTenant(mockTenant);
    });
  },

  clearAllTenants() {
    this.saveTenants([]);
  }
};