import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Minus } from 'lucide-react';
import { MatchingResult } from '../../utils/criteriaUtils';

interface CriteriaMatchingBadgeProps {
  matchingResult: MatchingResult;
}

export default function CriteriaMatchingBadge({ matchingResult }: CriteriaMatchingBadgeProps) {
  const { status } = matchingResult;

  const badges = {
    full: {
      icon: CheckCircle,
      color: 'bg-green-50 dark:bg-green-900/50',
      textColor: 'text-green-700 dark:text-green-300',
      message: 'Le dossier correspond à tous vos critères de recherche (âge, statut, salaire et garant).'
    },
    partial: {
      icon: Minus,
      color: 'bg-yellow-50 dark:bg-yellow-900/50',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      message: 'Le dossier correspond partiellement à vos critères de recherche. Certains critères ne sont pas respectés.'
    },
    none: {
      icon: XCircle,
      color: 'bg-red-50 dark:bg-red-900/50',
      textColor: 'text-red-700 dark:text-red-300',
      message: 'Le dossier ne correspond à aucun de vos critères de recherche (âge, statut, salaire et garant).'
    }
  };

  const Badge = badges[status];
  const Icon = Badge.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${Badge.color} mb-4`}>
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${Badge.textColor}`} />
      <p className={`text-sm ${Badge.textColor}`}>
        {Badge.message}
      </p>
    </div>
  );
}