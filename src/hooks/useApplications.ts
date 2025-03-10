import { useState } from 'react';
import { Application } from '../types/application';

const initialApplications: Application[] = [
  {
    id: '1',
    propertyId: '1',
    status: 'pending',
    createdAt: '2024-03-15T10:00:00Z',
    applicant: {
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@example.com',
      phone: '06 12 34 56 78',
      currentSituation: 'employed',
      monthlyIncome: 3200,
      employer: 'Entreprise ABC',
      employmentContract: 'cdi',
    },
    documents: [
      {
        id: 'd1',
        type: 'id_card',
        name: 'Carte d\'identité',
        url: '#',
        uploadedAt: '2024-03-15T10:00:00Z',
      },
      {
        id: 'd2',
        type: 'payslip',
        name: 'Bulletin de salaire',
        url: '#',
        uploadedAt: '2024-03-15T10:00:00Z',
      },
    ],
    message: 'Bonjour, je suis très intéressée par votre bien. Je suis en CDI depuis 3 ans.',
  },
  {
    id: '2',
    propertyId: '1',
    status: 'pending',
    createdAt: '2024-03-14T15:30:00Z',
    applicant: {
      firstName: 'Lucas',
      lastName: 'Dubois',
      email: 'lucas.dubois@example.com',
      phone: '06 98 76 54 32',
      currentSituation: 'student',
      monthlyIncome: 1800,
      employer: 'Stage Corp',
      employmentContract: 'cdd',
    },
    documents: [
      {
        id: 'd1',
        type: 'id_card',
        name: 'Carte d\'identité',
        url: '#',
        uploadedAt: '2024-03-14T15:30:00Z',
      },
    ],
    message: 'Je suis étudiant en master et je recherche un logement pour la rentrée.',
  },
];

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, status }
          : app
      )
    );
  };

  return {
    applications,
    selectedApplication,
    setSelectedApplication,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    updateApplicationStatus,
  };
}