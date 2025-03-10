import React from 'react';
import InputField from '../../forms/InputField';
import { PropertyFormData } from '../../../types/property';

interface TenantCriteriaSectionProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export default function TenantCriteriaSection({ formData, setFormData }: TenantCriteriaSectionProps) {
  const updateCriteria = (updates: Partial<NonNullable<PropertyFormData['tenantCriteria']>>) => {
    setFormData({
      ...formData,
      tenantCriteria: {
        ...formData.tenantCriteria,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      <InputField
        label="Revenu minimum mensuel (€)"
        type="number"
        value={formData.tenantCriteria?.minIncome?.toString() || ''}
        onChange={(value) => updateCriteria({ minIncome: Number(value) })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Durée de location préférée
        </label>
        <select
          value={formData.tenantCriteria?.preferredDuration || 'one_year'}
          onChange={(e) => updateCriteria({ preferredDuration: e.target.value as any })}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="short_term">Court terme</option>
          <option value="one_year">1 an</option>
          <option value="long_term">Long terme</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InputField
          label="Âge minimum"
          type="number"
          value={formData.tenantCriteria?.ageRange?.min?.toString() || ''}
          onChange={(value) => updateCriteria({
            ageRange: {
              ...formData.tenantCriteria?.ageRange,
              min: Number(value)
            }
          })}
        />
        <InputField
          label="Âge maximum"
          type="number"
          value={formData.tenantCriteria?.ageRange?.max?.toString() || ''}
          onChange={(value) => updateCriteria({
            ageRange: {
              ...formData.tenantCriteria?.ageRange,
              max: Number(value)
            }
          })}
        />
      </div>
    </div>
  );
}