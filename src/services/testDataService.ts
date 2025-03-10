import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { Application } from '../types/application';
import { Property } from '../types/property';
import { notificationService } from './notificationService';

const APPLICATIONS_STORAGE_KEY = 'izimo_applications';

export const testDataService = {
  generateTestApplications(properties: Property[]): void {
    const applications = storage.get(APPLICATIONS_STORAGE_KEY) || [];
    
    const testApplicants = [
      {
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@example.com',
        phone: '06 12 34 56 78',
        currentSituation: 'employed' as const,
        monthlyIncome: 3200,
        message: 'Bonjour, je suis très intéressée par votre bien. Je suis en CDI depuis 3 ans dans une entreprise de conseil.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=128&h=128&q=80'
      },
      {
        firstName: 'Thomas',
        lastName: 'Dubois',
        email: 'thomas.dubois@example.com',
        phone: '06 23 45 67 89',
        currentSituation: 'employed' as const,
        monthlyIncome: 2800,
        message: 'Je souhaite emménager dans votre bien. Je travaille dans le quartier et le logement correspond parfaitement à mes critères.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=128&h=128&q=80'
      },
      {
        firstName: 'Julie',
        lastName: 'Petit',
        email: 'julie.petit@example.com',
        phone: '06 34 56 78 90',
        currentSituation: 'self_employed' as const,
        monthlyIncome: 3500,
        message: 'Votre bien m\'intéresse beaucoup. Je suis freelance en développement web avec des revenus stables depuis 5 ans.',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&w=128&h=128&q=80'
      }
    ];

    // Supprimer toutes les candidatures existantes
    storage.set(APPLICATIONS_STORAGE_KEY, []);

    properties.forEach(property => {
      // Générer une candidature pour chaque test applicant
      testApplicants.forEach(applicant => {
        const newApplication: Application = {
          id: uuidv4(),
          propertyId: property.id,
          ownerId: property.ownerId,
          status: 'pending',
          desiredStartDate: new Date(2024, 5, 1).toISOString(), // Date de début souhaitée pour le test
          createdAt: new Date().toISOString(),
          applicant: {
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            email: applicant.email,
            phone: applicant.phone,
            currentSituation: applicant.currentSituation,
            monthlyIncome: applicant.monthlyIncome,
            avatarUrl: applicant.avatarUrl
          },
          documents: [
            {
              id: uuidv4(),
              type: 'id_card',
              name: 'Carte d\'identité',
              url: '#',
              uploadedAt: new Date().toISOString(),
            },
            {
              id: uuidv4(),
              type: 'payslip',
              name: 'Dernier bulletin de salaire',
              url: '#',
              uploadedAt: new Date().toISOString(),
            },
          ],
          message: applicant.message,
        };

        applications.push(newApplication);

        // Créer une notification pour chaque nouvelle candidature
        notificationService.createNotification({
          userId: property.ownerId,
          type: 'info',
          title: 'Nouvelle candidature',
          message: `${applicant.firstName} ${applicant.lastName} a envoyé un dossier pour ${property.name}`,
          link: '/dashboard/applications'
        });
      });
    });

    storage.set(APPLICATIONS_STORAGE_KEY, applications);
  }
};