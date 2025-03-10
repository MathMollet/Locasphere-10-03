import { v4 as uuidv4 } from 'uuid';
import { Application } from '../types/application';
import { Property } from '../types/property';
import { User } from '../types/user';
import { notificationService } from './notificationService';
import { tenantFileService } from './tenantFileService';
import { storage } from '../utils/storage';

const LEASES_STORAGE_KEY = 'izimo_leases';

export const leaseService = {
  generateLease(application: Application, property: Property, owner: User): string {
    const today = new Date().toLocaleDateString('fr-FR');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Début dans 7 jours par défaut
    
    const lease = `
CONTRAT DE LOCATION

Entre les soussignés :

LE BAILLEUR
${owner.firstName} ${owner.lastName}
Email : ${owner.email}

ET

LE LOCATAIRE
${application.applicant.firstName} ${application.applicant.lastName}
Email : ${application.applicant.email}
Téléphone : ${application.applicant.phone}

Il a été convenu ce qui suit :

DÉSIGNATION DU BIEN
${property.name}
${property.address}
${property.postalCode} ${property.city}

Type : ${property.type === 'apartment' ? 'Appartement' : 'Maison'}
Surface : ${property.surface} m²
Nombre de pièces : ${property.numberOfRooms}
Nombre de chambres : ${property.numberOfBedrooms}
Nombre de salles de bain : ${property.numberOfBathrooms}
Meublé : ${property.isFurnished ? 'Oui' : 'Non'}

DURÉE
Le présent contrat est conclu pour une durée de ${property.isFurnished ? '1 an' : '3 ans'} 
à compter du ${startDate.toLocaleDateString('fr-FR')}.

LOYER ET CHARGES
Loyer mensuel hors charges : ${property.baseRent} €
Charges mensuelles : ${property.charges} €
Total mensuel charges comprises : ${property.baseRent + property.charges} €
Dépôt de garantie : ${property.deposit} €

SIGNATURES

Le Bailleur                                Le Locataire
${owner.firstName} ${owner.lastName}       ${application.applicant.firstName} ${application.applicant.lastName}

Fait à ${property.city}, le ${today}
    `.trim();

    return lease;
  },

  saveLease(application: Application, leaseContent: string): void {
    try {
      // Sauvegarder le bail dans le stockage
      const leases = storage.get(LEASES_STORAGE_KEY) || {};
      const leaseId = uuidv4();
      const lease = {
        id: leaseId,
        content: leaseContent,
        applicationId: application.id,
        createdAt: new Date().toISOString(),
        status: 'pending_signature'
      };
      
      leases[leaseId] = lease;
      storage.set(LEASES_STORAGE_KEY, leases);

      // Ajouter le bail aux documents du locataire
      tenantFileService.addDocument(application.applicant.email, {
        type: 'lease',
        name: 'Contrat de location.txt',
        url: `lease://${leaseId}`,
        uploadedAt: new Date().toISOString()
      });

      // Envoyer une notification au locataire
      notificationService.createNotification({
        userId: application.applicant.email,
        type: 'success',
        title: 'Bail disponible',
        message: 'Votre bail est disponible pour signature. Vous pouvez le consulter dans vos documents.',
        link: '/dashboard/tenant-file'
      });
    } catch (error) {
      console.error('Error saving lease:', error);
      throw new Error('Erreur lors de la sauvegarde du bail');
    }
  },

  getLease(leaseId: string): string | null {
    try {
      const leases = storage.get(LEASES_STORAGE_KEY) || {};
      return leases[leaseId]?.content || null;
    } catch (error) {
      console.error('Error getting lease:', error);
      return null;
    }
  }
};