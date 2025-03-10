import { useState } from 'react';
import { Resource } from '../types/resource';

const initialResources: Resource[] = [
  // Articles juridiques
  {
    id: '1',
    title: 'La loi ALUR : ce qu\'il faut savoir',
    description: 'Guide complet sur la loi ALUR et ses implications pour les propriétaires bailleurs.',
    type: 'article',
    category: 'legal',
    url: '#',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Les obligations du bailleur',
    description: 'Découvrez toutes les obligations légales d\'un propriétaire bailleur.',
    type: 'article',
    category: 'legal',
    url: '#',
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
  },
  // Articles fiscaux
  {
    id: '3',
    title: 'Fiscalité des revenus locatifs',
    description: 'Comment déclarer et optimiser vos revenus locatifs.',
    type: 'article',
    category: 'fiscal',
    url: '#',
    createdAt: '2024-03-03T10:00:00Z',
    updatedAt: '2024-03-03T10:00:00Z',
  },
  // Articles assurance
  {
    id: '4',
    title: 'L\'assurance propriétaire non occupant',
    description: 'Tout savoir sur l\'assurance PNO et son importance.',
    type: 'article',
    category: 'insurance',
    url: '#',
    createdAt: '2024-03-04T10:00:00Z',
    updatedAt: '2024-03-04T10:00:00Z',
  },
  // Modèles de documents
  {
    id: '5',
    title: 'Contrat de bail type',
    description: 'Modèle de contrat de bail conforme à la législation en vigueur.',
    type: 'template',
    category: 'templates',
    url: '#',
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: '6',
    title: 'État des lieux type',
    description: 'Modèle d\'état des lieux d\'entrée et de sortie.',
    type: 'template',
    category: 'templates',
    url: '#',
    createdAt: '2024-03-06T10:00:00Z',
    updatedAt: '2024-03-06T10:00:00Z',
  },
  {
    id: '7',
    title: 'Quittance de loyer type',
    description: 'Modèle de quittance de loyer mensuelle.',
    type: 'template',
    category: 'templates',
    url: '#',
    createdAt: '2024-03-07T10:00:00Z',
    updatedAt: '2024-03-07T10:00:00Z',
  },
];

export function useResources() {
  const [resources] = useState<Resource[]>(initialResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const getResourcesByCategory = (category: Resource['category']) => {
    return resources.filter(resource => resource.category === category);
  };

  return {
    resources,
    selectedResource,
    setSelectedResource,
    getResourcesByCategory,
  };
}