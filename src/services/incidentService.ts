import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { Incident } from '../types/incident';
import { notificationService } from './notificationService';

const INCIDENTS_STORAGE_KEY = 'izimo_incidents';

export const incidentService = {
  getIncidents(): Incident[] {
    const incidents = storage.get(INCIDENTS_STORAGE_KEY);
    return Array.isArray(incidents) ? incidents : [];
  },

  addComment(incidentId: string, comment: IncidentComment): Incident | null {
    const incidents = this.getIncidents();
    const index = incidents.findIndex(i => i.id === incidentId);
    
    if (index === -1) return null;
    
    const incident = incidents[index];
    const updatedIncident = {
      ...incident,
      comments: [...(incident.comments || []), comment],
      updatedAt: new Date().toISOString()
    };
    
    incidents[index] = updatedIncident;
    this.saveIncidents(incidents);
    
    // Envoyer une notification au propriétaire ou au locataire
    const properties = storage.get('izimo_properties') || [];
    const property = properties.find(p => p.id === incident.propertyId);
    
    if (property) {
      // Si l'auteur est le propriétaire, notifier le locataire
      if (comment.authorId === property.ownerId) {
        notificationService.createNotification({
          userId: incident.tenantId,
          type: 'info',
          title: 'Nouveau commentaire sur un incident',
          message: `Le propriétaire a commenté l'incident "${incident.title}"`,
          link: '/dashboard/tenant-incidents'
        });
      }
      // Si l'auteur est le locataire, notifier le propriétaire
      else {
        notificationService.createNotification({
          userId: property.ownerId,
          type: 'info',
          title: 'Nouveau commentaire sur un incident',
          message: `Le locataire a commenté l'incident "${incident.title}"`,
          link: '/dashboard/incidents'
        });
      }
    }
    
    return updatedIncident;
  },

  saveIncidents(incidents: Incident[]): void {
    storage.set(INCIDENTS_STORAGE_KEY, incidents);
  },

  createIncident(incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Incident {
    const incidents = this.getIncidents();
    
    // Si c'est une mise à jour (l'ID existe déjà)
    if ('id' in incidentData) {
      const existingIncident = incidents.find(i => i.id === incidentData.id);
      if (existingIncident) {
        return this.updateIncident(incidentData.id, incidentData);
      }
    }

    // Transformer les photos en format IncidentPhoto
    const photos = incidentData.photos.map(photo => ({
      id: uuidv4(),
      url: photo.url,
      uploadedAt: new Date().toISOString()
    }));

    const newIncident: Incident = {
      ...incidentData,
      photos,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    incidents.push(newIncident);
    this.saveIncidents(incidents);

    return newIncident;
  },

  updateIncident(id: string, updates: Partial<Incident>): Incident {
    const incidents = this.getIncidents();
    const index = incidents.findIndex(i => i.id === id);
    
    if (index === -1) {
      throw new Error('Incident non trouvé');
    }

    const oldStatus = incidents[index].status;
    
    const currentIncident = incidents[index];
    
    // Vérifier les règles de transition de statut
    if (updates.status) {
      const isValid = this.validateStatusTransition(oldStatus, updates.status);
      if (!isValid) {
        throw new Error(`Transition de statut non autorisée: ${oldStatus} -> ${updates.status}`);
      }
    }

    const updatedIncident = {
      ...currentIncident,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    
    incidents[index] = updatedIncident;
    this.saveIncidents(incidents);
    
    // Envoyer une notification au locataire lors du changement de statut
    if (oldStatus !== updatedIncident.status) {
      const properties = storage.get('izimo_properties') || [];
      const property = properties.find(p => p.id === updatedIncident.propertyId);
      const tenants = storage.get('izimo_tenants') || [];
      const tenant = tenants.find(t => t.id === updatedIncident.tenantId);
      
      if (tenant) {
        const statusMessages = {
          draft: 'L\'incident a été enregistré en brouillon',
          cancelled_tenant: 'L\'incident a été annulé par le locataire',
          reported: 'L\'incident a été signalé',
          cancelled_owner: 'L\'incident a été annulé par le propriétaire',
          in_charge: 'L\'incident a été pris en charge',
          in_progress: 'L\'incident est en cours de résolution',
          resolved: 'L\'incident a été résolu',
          closed: 'L\'incident a été clôturé'
        };

        notificationService.createNotification({
          userId: tenant.email,
          type: this.getNotificationTypeForStatus(updatedIncident.status),
          title: 'Mise à jour de l\'incident',
          message: `${statusMessages[updatedIncident.status]} - ${property?.name || 'Bien inconnu'} : ${updatedIncident.title}`,
          link: '/dashboard/tenant-incidents'
        });
      }
    }
    
    return updatedIncident;
  },

  getNotificationTypeForStatus(status: Incident['status']): 'success' | 'warning' | 'info' {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'success';
      case 'cancelled_owner':
      case 'cancelled_tenant':
        return 'warning';
      default:
        return 'info';
    }
  },

  validateStatusTransition(oldStatus: string, newStatus: string): boolean {
    const allowedTransitions = {
      draft: ['reported', 'cancelled_tenant'],
      reported: ['in_charge', 'cancelled_owner', 'cancelled_tenant'],
      in_charge: ['in_progress', 'cancelled_owner', 'cancelled_tenant'],
      in_progress: ['resolved', 'cancelled_owner', 'cancelled_tenant'],
      resolved: ['closed'],
      cancelled_owner: [],
      cancelled_tenant: [],
      closed: []
    };

    const allowed = allowedTransitions[oldStatus as keyof typeof allowedTransitions];
    return allowed ? allowed.includes(newStatus) : false;
  },

  getIncidentsByTenant(tenantId: string): Incident[] {
    const incidents = this.getIncidents();
    // Filtrer les incidents par l'ID ou l'email du locataire
    return incidents.filter(incident => 
      incident.tenantId === tenantId || 
      incident.tenantId === tenantId.toLowerCase()
    );
  },

  getIncidentsByProperty(propertyId: string): Incident[] {
    const incidents = this.getIncidents();
    return incidents.filter(incident => incident.propertyId === propertyId);
  },

  deleteIncident(id: string): void {
    const incidents = this.getIncidents().filter(i => i.id !== id);
    this.saveIncidents(incidents);
  }
};