import React from 'react';
import InputField from '../../forms/InputField';
import { PropertyFormData } from '../../../types/property';

interface GeneralSectionProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export default function GeneralSection({ formData, setFormData }: GeneralSectionProps) {
  return (
    <div className="space-y-6">
      <InputField
        label="Nom du bien"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        required
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de bien</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyFormData['type'] })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="commercial">Local commercial</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyFormData['status'] })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="available">Disponible</option>
            <option value="rented">Loué</option>
            <option value="maintenance">En maintenance</option>
          </select>
        </div>
      </div>

      <InputField
        label="Adresse"
        value={formData.address}
        onChange={(value) => setFormData({ ...formData, address: value })}
        required
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InputField
          label="Ville"
          value={formData.city}
          onChange={(value) => setFormData({ ...formData, city: value })}
          required
        />
        <InputField
          label="Code postal"
          value={formData.postalCode}
          onChange={(value) => setFormData({ ...formData, postalCode: value })}
          required
        />
      </div>
    </div>
  );
}