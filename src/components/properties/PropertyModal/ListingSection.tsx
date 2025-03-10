import React from 'react';
import InputField from '../../forms/InputField';
import { PropertyFormData } from '../../../types/property';

interface ListingSectionProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export default function ListingSection({ formData, setFormData }: ListingSectionProps) {
  return (
    <div className="space-y-6">
      <InputField
        label="Titre de l'annonce"
        value={formData.listingTitle || ''}
        onChange={(value) => setFormData({ ...formData, listingTitle: value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description de l'annonce
        </label>
        <textarea
          value={formData.listingDescription || ''}
          onChange={(e) => setFormData({ ...formData, listingDescription: e.target.value })}
          rows={4}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <InputField
        label="Date de disponibilité"
        type="date"
        value={formData.availableFrom || ''}
        onChange={(value) => setFormData({ ...formData, availableFrom: value })}
      />
    </div>
  );
}