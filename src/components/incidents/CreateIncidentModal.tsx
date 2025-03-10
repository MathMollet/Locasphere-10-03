import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import InputField from '../forms/InputField';
import FileUpload from '../upload/FileUpload';
import { Incident } from '../../types/incident';
import SuccessBanner from '../common/SuccessBanner';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  incident?: Incident | null;
}

const incidentTypes = [
  { value: 'plumbing', label: 'Fuite/plomberie' },
  { value: 'electrical', label: 'Électricité' },
  { value: 'locksmith', label: 'Serrurerie' },
  { value: 'heating', label: 'Chauffage' },
  { value: 'windows', label: 'Vitrerie/Fenêtre' },
  { value: 'appliance', label: 'Électroménager' },
  { value: 'other', label: 'Autres' }
];

const rooms = [
  { value: 'entrance', label: 'Entrée' },
  { value: 'kitchen', label: 'Cuisine' },
  { value: 'bathroom', label: 'Salle de bain' },
  { value: 'wc', label: 'WC' },
  { value: 'living_room', label: 'Salon' },
  { value: 'bedroom', label: 'Chambre' },
  { value: 'corridor', label: 'Couloir' },
  { value: 'storage', label: 'Placard' },
  { value: 'exterior', label: 'Extérieur' },
  { value: 'cellar', label: 'Cave' },
  { value: 'garage', label: 'Garage' },
  { value: 'parking', label: 'Parking' },
  { value: 'other', label: 'Autre' }
];

export default function CreateIncidentModal({
  isOpen,
  onClose,
  onSubmit,
  incident
}: CreateIncidentModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    room: '',
    description: '',
    photos: [] as { url: string }[],
    title: '',
    status: 'draft' as 'draft' | 'reported'
  });
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Initialiser le formulaire avec les données de l'incident si on est en mode édition
  useEffect(() => {
    if (incident) {
      setFormData({
        type: incident.type,
        startDate: incident.startDate,
        room: incident.room,
        description: incident.description,
        photos: incident.photos.map(photo => ({ url: photo.url })),
        title: incident.title,
        status: incident.status
      });
    } else {
      // Réinitialiser le formulaire si on n'est pas en mode édition
      setFormData({
        type: '',
        startDate: '',
        room: '',
        description: '',
        photos: [],
        title: '',
        status: 'draft'
      });
    }
  }, [incident]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incidentData = {
      ...formData,
      status: 'reported',
      title: `Incident ${incidentTypes.find(t => t.value === formData.type)?.label.toLowerCase()} - ${rooms.find(r => r.value === formData.room)?.label.toLowerCase()}`
    };

    // Si on est en mode édition, conserver l'ID de l'incident
    if (incident) {
      incidentData.id = incident.id;
    }

    onSubmit({
      ...incidentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleSaveDraft = () => {
    const incidentData = {
      ...formData,
      status: 'draft',
      title: `Incident ${incidentTypes.find(t => t.value === formData.type)?.label.toLowerCase()} - ${rooms.find(r => r.value === formData.room)?.label.toLowerCase()}`
    };

    // Si on est en mode édition, conserver l'ID de l'incident
    if (incident) {
      incidentData.id = incident.id;
    }

    onSubmit({
      ...incidentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowSuccessBanner(true);
    setTimeout(() => {
      setShowSuccessBanner(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4">
      {showSuccessBanner && (
        <SuccessBanner
          message="Votre incident a été enregistré en tant que brouillon"
          onClose={() => setShowSuccessBanner(false)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {incident ? 'Modifier l\'incident' : 'Déclarer un incident'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type d'incident
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Sélectionnez un type</option>
              {incidentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <InputField
            label="Date de début de l'incident"
            type="date"
            value={formData.startDate}
            onChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pièce concernée
            </label>
            <select
              value={formData.room}
              onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Sélectionnez une pièce</option>
              {rooms.map(room => (
                <option key={room.value} value={room.value}>{room.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description détaillée
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Photos
            </label>
            <FileUpload
              onUpload={(files) => {
                setFormData(prev => ({
                  ...prev,
                  photos: [...prev.photos, ...files.map(f => ({ url: f.url }))]
                }));
              }}
              maxFiles={3}
              maxSize={5 * 1024 * 1024}
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.webp']
              }}
              uploadedFiles={formData.photos.map((photo, index) => ({
                id: index.toString(),
                url: photo.url,
                name: `Photo ${index + 1}`,
                type: 'image/jpeg',
                size: 0,
              }))}
              onRemove={(fileId) => {
                setFormData(prev => ({
                  ...prev,
                  photos: prev.photos.filter((_, index) => index.toString() !== fileId)
                }));
              }}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Ajoutez jusqu'à 3 photos pour illustrer l'incident (5 Mo max par photo)
            </p>
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
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-md shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/70"
            >
              Enregistrer le brouillon
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500"
            >
              {incident ? 'Mettre à jour l\'incident' : 'Déclarer l\'incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}