import React from 'react';
import { MatchingResult } from '../../utils/criteriaUtils';

interface CriteriaMatchingDotProps {
  matchingResult: MatchingResult;
}

export default function CriteriaMatchingDot({ matchingResult }: CriteriaMatchingDotProps) {
  const { status } = matchingResult;

  const dotStyles = {
    full: 'bg-green-500 dark:bg-green-400',
    partial: 'bg-yellow-500 dark:bg-yellow-400',
    none: 'bg-red-500 dark:bg-red-400'
  };

  const tooltipMessages = {
    full: 'Critères respectés',
    partial: 'Critères partiellement respectés',
    none: 'Critères non respectés'
  };

  return (
    <div className="relative group">
      <div className={`h-3 w-3 rounded-full ${dotStyles[status]}`} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
        {tooltipMessages[status]}
      </div>
    </div>
  );
}