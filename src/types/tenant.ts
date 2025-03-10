export interface TenantFile {
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
    status: string;
    income: string; // Nouveau champ
    desiredStartDate?: string;
  };
  documents: {
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
}

export interface Document {
  id: string;
  type: 
    // Documents communs
    | 'id_card' // Carte d'identité
    | 'rent_receipt_1' // Quittance de loyer M-1
    | 'rent_receipt_2' // Quittance de loyer M-2
    | 'rent_receipt_3' // Quittance de loyer M-3
    | 'rent_payment_proof' // Attestation de paiement de loyer
    | 'other_income' // Autre revenu
    // Documents spécifiques au statut Salarié
    | 'work_contract' // Contrat de travail
    | 'payslip_1' // Bulletin de salaire M-1
    | 'payslip_2' // Bulletin de salaire M-2
    | 'payslip_3' // Bulletin de salaire M-3
    | 'tax_notice_1' // Dernier avis d'imposition
    | 'tax_notice_2' // Avant-dernier avis d'imposition
    // Documents spécifiques au statut Retraité
    | 'pension_slip_1' // Bulletin de pension M-1
    | 'pension_slip_2' // Bulletin de pension M-2
    | 'pension_slip_3' // Bulletin de pension M-3
    // Documents spécifiques au statut Étudiant
    | 'student_card' // Carte d'étudiant
    | 'scholarship_proof' // Attestation d'aide (bourse, CAF)
    // Documents spécifiques au statut Sans emploi
    | 'unemployment_proof' // Attestation France Travail
    | 'benefits_proof' // Attestation d'aide (CAF)
    // Documents spécifiques au statut Dirigeant d'entreprise
    | 'kbis' // Extrait K-bis
    | 'business_owner_payslip_1' // Bulletin de salaire M-1 (dirigeant salarié)
    | 'business_owner_payslip_2' // Bulletin de salaire M-2 (dirigeant salarié)
    | 'business_owner_payslip_3' // Bulletin de salaire M-3 (dirigeant salarié)
    | 'accountant_attestation' // Attestation de revenus expert-comptable
    // Documents spécifiques au statut Autre
    | 'other' // Autre document
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  documents: Document[];
  rentStartDate: string;
  rentEndDate?: string;
  status: 'active' | 'pending' | 'former';
  avatarUrl?: string;
  guarantorInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}