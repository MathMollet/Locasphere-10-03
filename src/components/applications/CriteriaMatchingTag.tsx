import React from 'react';
import { CheckCircle, Minus, XCircle } from 'lucide-react';
import { MatchingResult } from '../../utils/criteriaUtils';

interface CriteriaMatchingTagProps {
  matchingResult: MatchingResult;
  compact?: boolean;
}

export default function CriteriaMatchingTag({ matchingResult, compact = false }: CriteriaMatchingTagProps) {
  const { status } = matchingResult;

  const tags = {
    full: {
      icon: CheckCircle,
      text: 'Critères respectés',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
    },
    partial: {
      icon: Minus,
      text: 'Critères partiellement respectés',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
    },
    none: {
      icon: XCircle,
      text: 'Critères non respectés',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
    }
  };

  const Tag = tags[status];
  const Icon = Tag.icon;

  return (
    <div className={`inline-flex items-center gap-1 ${compact ? 'px-1.5 py-0.5' : 'px-2.5 py-1'} rounded-full text-xs font-medium ${Tag.color}`}>
      <Icon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span className={compact ? 'text-[11px]' : 'text-xs'}>{Tag.text}</span>
    </div>
  );
}