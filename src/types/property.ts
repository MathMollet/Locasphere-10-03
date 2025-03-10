export interface Property {
  id: string;
  ownerId: string; // Ajout de l'ID du propriétaire
  reference: string;
  name: string;
  type: 'house' | 'apartment' | 'building' | 'garage' | 'loft';
  address: string;
  city: string;
  postalCode: string;
  surface: number;
  rentAmount: number;
  status: 'available' | 'rented' | 'maintenance';
  createdAt: string;
  description?: string;
  photos: string[];
    url: string;
    title?: string;
    description?: string;
  }[];
  isFurnished: boolean;
  isSharedLiving: boolean;
  exterior: ('balcony' | 'terrace' | 'garden' | 'patio')[];
  numberOfRooms: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  energyClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  gesClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  baseRent: number;
  charges: number;
  deposit: number;
  video?: string;
    url: string;
    title?: string;
    description?: string;
  };
  virtualTour?: string;
  availableFrom?: string;
  tenantCriteria?: {
    ageRange?: {
      min?: number;
      max?: number;
    },
    status?: ('employed' | 'student' | 'retired' | 'unemployed' | 'business_owner' | 'other')[];
    monthlyIncome?: number;
    guarantorRequired?: boolean;
  };
}

export type PropertyFormData = Omit<Property, 'id' | 'ownerId' | 'reference' | 'createdAt'>;