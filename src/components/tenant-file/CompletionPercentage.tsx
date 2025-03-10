import React from 'react';
import { CircleDot } from 'lucide-react';

interface CompletionPercentageProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    income: string;
    presentation?: string;
    hasGuarantor?: boolean;
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

const REQUIRED_FIELDS = [
  'phone',
  'status',
  'income',
  'presentation',
  'desiredStartDate'
];

const REQUIRED_DOCUMENTS = [
  'id_card',
  'payslip_1',
  'payslip_2',
  'payslip_3',
  'proof_of_address',
  'tax_notice_1',
  'tax_notice_2',
  'rent_receipt_1',
  'rent_receipt_2',
  'rent_receipt_3'
];

const REQUIRED_GUARANTOR_DOCUMENTS = [
  'guarantor_id_card',
  'guarantor_work_contract',
  'guarantor_payslip_1',
  'guarantor_payslip_2',
  'guarantor_payslip_3',
  'guarantor_tax_notice_1',
  'guarantor_tax_notice_2',
  'guarantor_rent_receipt_1',
  'guarantor_rent_receipt_2',
  'guarantor_rent_receipt_3'
];

export default function CompletionPercentage({ personalInfo, documents }: CompletionPercentageProps) {
  // Calcul du nombre total de champs (informations personnelles + documents)
  const getTotalFields = () => {
    let total = 0;
    
    // Compter les champs d'informations personnelles
    total += Object.keys(personalInfo).length;
    
    // Compter les documents requis selon le statut
    if (personalInfo.status) {
      switch (personalInfo.status) {
        case 'employed':
          total += 12; // Documents pour les salariés
          break;
        case 'retired':
          total += 11; // Documents pour les retraités
          break;
        case 'student':
          total += 8; // Documents pour les étudiants
          break;
        case 'unemployed':
          total += 8; // Documents pour les sans emploi
          break;
        case 'business_owner':
          total += 9; // Documents pour les dirigeants d'entreprise
          break;
        case 'other':
          total += 13; // Documents pour autre statut
          break;
      }
    }

    // Ajouter les documents du garant si nécessaire
    if (personalInfo.hasGuarantor) {
      total += 12; // Documents pour le garant
    }

    return total;
  };

  // Calcul du nombre de champs remplis
  const getFilledFields = () => {
    let filled = 0;
    
    // Compter les champs d'informations personnelles remplis
    Object.entries(personalInfo).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        filled++;
      }
    });
    
    // Compter les documents fournis
    filled += documents.length;
    
    return filled;
  };

  // Calcul du pourcentage global
  const totalFields = getTotalFields();
  const filledFields = getFilledFields();
  const totalPercentage = Math.round((filledFields / totalFields) * 100) || 0;

  // Détermination de la couleur en fonction du pourcentage
  const getColor = (percentage: number) => {
    if (percentage < 50) return 'text-red-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full py-2 px-4 shadow-sm">
      <div className={`${getColor(totalPercentage)}`}>
        <CircleDot className="h-5 w-5" />
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {totalPercentage}% complété
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 block">
          {filledFields}/{totalFields} champs
        </span>
      </div>
    </div>
  );
}