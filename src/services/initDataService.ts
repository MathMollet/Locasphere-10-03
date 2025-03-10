import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { Property } from '../types/property';
import { User } from '../types/user';
import { Application } from '../types/application';
import { Tenant } from '../types/tenant';
import { Incident } from '../types/incident';

const USERS_KEY = 'izimo_users';
const PROPERTIES_KEY = 'izimo_properties';
const APPLICATIONS_KEY = 'izimo_applications';
const TENANTS_KEY = 'izimo_tenants';
const INCIDENTS_KEY = 'izimo_incidents';

export const initDataService = {
  initializeTestData() {
    // Créer l'admin
    const adminUser: User & { password: string } = {
      id: uuidv4(),
      email: 'admin@izimo.com',
      password: 'admin123',
      firstName: 'Stéphane',
      lastName: 'FARIGOULE',
      role: 'admin',
      notificationPreferences: {
        email: true,
        push: true
      }
    };

    // Créer quelques propriétaires
    const owners: (User & { password: string })[] = [
      {
        id: uuidv4(),
        email: 'pierre.dupont@example.com',
        password: 'password123',
        firstName: 'Pierre',
        lastName: 'Dupont',
        role: 'owner',
        notificationPreferences: { email: true, push: true }
      },
      {
        id: uuidv4(),
        email: 'marie.martin@example.com',
        password: 'password123',
        firstName: 'Marie',
        lastName: 'Martin',
        role: 'owner',
        notificationPreferences: { email: true, push: true }
      }
    ];

    // Créer quelques locataires
    const tenants: (User & { password: string })[] = [
      {
        id: uuidv4(),
        email: 'jean.durand@example.com',
        password: 'password123',
        firstName: 'Jean',
        lastName: 'Durand',
        role: 'tenant',
        notificationPreferences: { email: true, push: true }
      },
      {
        id: uuidv4(),
        email: 'sophie.petit@example.com',
        password: 'password123',
        firstName: 'Sophie',
        lastName: 'Petit',
        role: 'tenant',
        notificationPreferences: { email: true, push: true }
      }
    ];

    // Sauvegarder tous les utilisateurs
    const allUsers = [adminUser, ...owners, ...tenants];
    storage.set(USERS_KEY, allUsers);

    // Créer des biens immobiliers
    const properties: Property[] = [
      {
        id: uuidv4(),
        ownerId: owners[0].id,
        reference: 'IZIMO-001',
        name: 'Appartement Centre Ville',
        type: 'apartment',
        address: '15 rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        surface: 65,
        rentAmount: 1500,
        status: 'available',
        description: 'Bel appartement rénové en plein centre',
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
        ],
        isFurnished: true,
        isSharedLiving: false,
        constructionYear: '1980',
        numberOfRooms: 3,
        numberOfBedrooms: 2,
        numberOfBathrooms: 1,
        energyClass: 'C',
        gesClass: 'D',
        baseRent: 1400,
        charges: 100,
        deposit: 1500,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        ownerId: owners[1].id,
        reference: 'IZIMO-002',
        name: 'Studio Quartier Latin',
        type: 'apartment',
        address: '25 rue Mouffetard',
        city: 'Paris',
        postalCode: '75005',
        surface: 30,
        rentAmount: 900,
        status: 'rented',
        description: 'Studio idéal pour étudiant',
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
        ],
        isFurnished: true,
        isSharedLiving: false,
        constructionYear: '1960',
        numberOfRooms: 1,
        numberOfBedrooms: 1,
        numberOfBathrooms: 1,
        energyClass: 'D',
        gesClass: 'E',
        baseRent: 850,
        charges: 50,
        deposit: 900,
        createdAt: new Date().toISOString()
      }
    ];

    storage.set(PROPERTIES_KEY, properties);

    // Créer des candidatures
    const applications: Application[] = [
      {
        id: uuidv4(),
        propertyId: properties[0].id,
        ownerId: properties[0].ownerId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        applicant: {
          firstName: tenants[0].firstName,
          lastName: tenants[0].lastName,
          email: tenants[0].email,
          phone: '0612345678',
          currentSituation: 'employed',
          monthlyIncome: 3000
        },
        documents: [],
        message: 'Je suis très intéressé par votre appartement.'
      }
    ];

    storage.set(APPLICATIONS_KEY, applications);

    // Créer des locataires
    const tenantsData: Tenant[] = [
      {
        id: tenants[1].id,
        firstName: tenants[1].firstName,
        lastName: tenants[1].lastName,
        email: tenants[1].email,
        phone: '0687654321',
        propertyId: properties[1].id,
        documents: [],
        rentStartDate: '2024-01-01',
        status: 'active'
      }
    ];

    storage.set(TENANTS_KEY, tenantsData);

    // Créer des incidents
    const incidents: Incident[] = [
      {
        id: uuidv4(),
        propertyId: properties[1].id,
        tenantId: tenantsData[0].id,
        startDate: new Date().toISOString(),
        room: 'kitchen',
        type: 'plumbing',
        status: 'reported',
        title: 'Fuite sous l\'évier',
        description: 'Il y a une fuite importante sous l\'évier de la cuisine',
        photos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [
          {
            id: uuidv4(),
            authorId: tenantsData[0].id,
            authorName: `${tenantsData[0].firstName} ${tenantsData[0].lastName}`,
            content: 'La fuite s\'aggrave, il y a de plus en plus d\'eau.',
            createdAt: new Date().toISOString()
          }
        ]
      }
    ];

    storage.set(INCIDENTS_KEY, incidents);

    return {
      success: true,
      message: 'Données de test initialisées avec succès',
      stats: {
        users: allUsers.length,
        properties: properties.length,
        applications: applications.length,
        tenants: tenantsData.length,
        incidents: incidents.length
      }
    };
  }
};