import React, { useState } from 'react';
import { X } from 'lucide-react';
import InputField from '../forms/InputField';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (property: any) => void;
}

export default function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'apartment',
    address: '',
    city: '',
    postalCode: '',
    surface: '',
    rentAmount: '',
    status: 'available',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      surface: Number(formData.surface),
      rentAmount: Number(formData.rentAmount),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Ajouter un bien</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <InputField
            label="Nom du bien"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            required
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="commercial">Local commercial</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
            required
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputField
              label="Ville"
              value={formData.city}
              onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
              required
            />
            <InputField
              label="Code postal"
              value={formData.postalCode}
              onChange={(value) => setFormData(prev => ({ ...prev, postalCode: value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputField
              label="Surface (m²)"
              type="number"
              value={formData.surface}
              onChange={(value) => setFormData(prev => ({ ...prev, surface: value }))}
              required
            />
            <InputField
              label="Loyer mensuel (€)"
              type="number"
              value={formData.rentAmount}
              onChange={(value) => setFormData(prev => ({ ...prev, rentAmount: value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
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