import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Property } from '../../types/property';
import InputField from '../forms/InputField';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  properties,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    propertyId: '',
    date: '',
    description: '',
    amountHT: '',
    amountTTC: '',
    receipt: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici nous traiterions l'ajout de la charge
    console.log('Nouvelle charge:', formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, receipt: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ajouter une charge
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bien concerné
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyId: e.target.value }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Sélectionnez un bien</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
            required
          />

          <InputField
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Montant HT (€)"
              type="number"
              value={formData.amountHT}
              onChange={(value) => setFormData(prev => ({ ...prev, amountHT: value }))}
              required
            />

            <InputField
              label="Montant TTC (€)"
              type="number"
              value={formData.amountTTC}
              onChange={(value) => setFormData(prev => ({ ...prev, amountTTC: value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Justificatif
            </label>
            <label className="flex justify-center px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Upload className="h-5 w-5" />
                <span>
                  {formData.receipt ? formData.receipt.name : 'Ajouter un justificatif'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}