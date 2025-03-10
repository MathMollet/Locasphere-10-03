import React from 'react';
import InputField from '../../forms/InputField';
import { PropertyFormData } from '../../../types/property';

interface CharacteristicsSectionProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export default function CharacteristicsSection({ formData, setFormData }: CharacteristicsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InputField
          label="Surface (m²)"
          type="number"
          value={formData.surface.toString()}
          onChange={(value) => setFormData({ ...formData, surface: Number(value) })}
          required
        />
        <InputField
          label="Année de construction"
          value={formData.constructionYear || ''}
          onChange={(value) => setFormData({ ...formData, constructionYear: value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <InputField
          label="Nombre de pièces"
          type="number"
          value={formData.numberOfRooms.toString()}
          onChange={(value) => setFormData({ ...formData, numberOfRooms: Number(value) })}
          required
        />
        <InputField
          label="Nombre de chambres"
          type="number"
          value={formData.numberOfBedrooms.toString()}
          onChange={(value) => setFormData({ ...formData, numberOfBedrooms: Number(value) })}
          required
        />
        <InputField
          label="Nombre de salles de bain"
          type="number"
          value={formData.numberOfBathrooms.toString()}
          onChange={(value) => setFormData({ ...formData, numberOfBathrooms: Number(value) })}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Classe énergétique
          </label>
          <select
            value={formData.energyClass}
            onChange={(e) => setFormData({ ...formData, energyClass: e.target.value as PropertyFormData['energyClass'] })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((classe) => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Classe GES
          </label>
          <select
            value={formData.gesClass}
            onChange={(e) => setFormData({ ...formData, gesClass: e.target.value as PropertyFormData['gesClass'] })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((classe) => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFurnished}
            onChange={(e) => setFormData({ ...formData, isFurnished: e.target.checked })}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Meublé</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isSharedLiving}
            onChange={(e) => setFormData({ ...formData, isSharedLiving: e.target.checked })}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Colocation</span>
        </label>
      </div>
    </div>
  );
}