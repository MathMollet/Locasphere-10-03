import { Application } from '../types/application';
import { Property } from '../types/property';

export type MatchingResult = {
  status: 'full' | 'partial' | 'none';
  matches: {
    income: boolean;
    status: boolean;
    age: boolean;
    guarantor: boolean;
  };
};

export function checkCriteriaMatching(
  application: Application,
  property: Property
): MatchingResult {
  if (!property.tenantCriteria) {
    return { 
      status: 'full', 
      matches: { 
        income: true, 
        status: true, 
        age: true, 
        guarantor: true 
      } 
    };
  }

  const matches = {
    income: true,
    status: true,
    age: true,
    guarantor: true
  };

  // Vérifier le revenu minimum
  if (property.tenantCriteria.monthlyIncome) {
    matches.income = application.applicant.monthlyIncome >= property.tenantCriteria.monthlyIncome;
  }

  // Vérifier le statut
  if (property.tenantCriteria.status && property.tenantCriteria.status.length > 0) {
    matches.status = property.tenantCriteria.status.includes(application.applicant.currentSituation);
  }

  // Vérifier l'âge
  if (property.tenantCriteria.ageRange) {
    const applicantAge = parseInt(application.applicant.age || '0');
    matches.age = true;

    if (property.tenantCriteria.ageRange.min !== undefined) {
      matches.age = matches.age && applicantAge >= property.tenantCriteria.ageRange.min;
    }
    
    if (property.tenantCriteria.ageRange.max !== undefined) {
      matches.age = matches.age && applicantAge <= property.tenantCriteria.ageRange.max;
    }
  }

  // Vérifier le garant
  if (property.tenantCriteria.guarantorRequired !== undefined) {
    matches.guarantor = application.hasGuarantor === property.tenantCriteria.guarantorRequired;
  }

  // Calculer le statut global selon les règles de correspondance
  const matchCount = Object.values(matches).filter(Boolean).length;
  const totalCriteria = Object.values(matches).length;

  if (matchCount === totalCriteria) {
    // Tous les critères sont respectés
    return { status: 'full', matches };
  } else if (matchCount > 0) {
    // Au moins un critère est respecté
    return { status: 'partial', matches };
  }
  
  // Aucun critère n'est respecté
  return { status: 'none', matches };
}
