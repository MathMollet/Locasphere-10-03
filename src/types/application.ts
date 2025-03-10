export interface Application {
  id: string;
  propertyId: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  desiredStartDate?: string;
  applicant: {
    firstName: string;
    lastName: string;
    birthDate?: string;
    age?: string;
    presentation?: string;
    email: string;
    phone: string;
    currentSituation: 'employed' | 'student' | 'self_employed' | 'other';
    monthlyIncome: number;
    avatarUrl?: string;
  };
  hasGuarantor: boolean;
  documents: {
    id: string;
    type: 'id_card' | 'payslip' | 'tax_notice' | 'employment_contract' | 'proof_of_address';
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  message?: string;
}