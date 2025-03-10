import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Property, PropertyFormData } from '../../types/property';
import InputField from '../forms/InputField';
import FileUpload from '../upload/FileUpload';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (property: PropertyFormData) => void;
  property?: Property;
  isEditMode?: boolean;
}

const defaultFormData: PropertyFormData = {
  name: '',
  type: 'house',
  address: '',
  city: '',
  postalCode: '',
  surface: 0,
  rentAmount: 0,
  status: 'available',
  photos: [{
    url: '',
    title: '',
    description: ''
  }],
  description: '',
  isFurnished: false,
  isSharedLiving: false,
  exterior: [],
  numberOfRooms: 1,
  numberOfBedrooms: 1,
  numberOfBathrooms: 1,
  energyClass: 'A',
  gesClass: 'A',
  baseRent: 0,
  charges: 0,
  deposit: 0,
  video: {
    url: '',
    title: '',
    description: ''
  },
  virtualTour: '',
  availableFrom: '',
  tenantCriteria: {
    ageRange: {
      min: 18,
      max: undefined
    },
    status: [],
    monthlyIncome: 0,
    guarantorRequired: false
  },
};

type Section = 'general' | 'characteristics' | 'rent' | 'media' | 'tenant_criteria';

export default function PropertyModal({
  isOpen,
  onClose,
  onSubmit,
  property,
  isEditMode = false,
}: PropertyModalProps) {
  const [currentSection, setCurrentSection] = useState<Section>('general');
  const [formData, setFormData] = useState<PropertyFormData>(defaultFormData);

  // Réinitialiser la section courante à chaque ouverture de la modal
  useEffect(() => {
    if (isOpen) {
      setCurrentSection('general');
    }
  }, [isOpen]);

  useEffect(() => {
    if (property && isEditMode) {
      setFormData(property);
    } else {
      setFormData(defaultFormData);
    }
  }, [property, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculer le montant total du loyer
    const rentAmount = formData.baseRent + formData.charges;
    
    // Créer l'objet final avec toutes les données nécessaires
    const propertyData = {
      ...formData,
      rentAmount,
      reference: `IZIMO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    };
    
    onSubmit(propertyData);
    onClose();
  };

  if (!isOpen) return null;

  const renderSection = () => {
    switch (currentSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputField
                  label="Nom du bien"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Décrivez votre bien en détail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de bien</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PropertyFormData['type'] }))}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="house">Maison</option>
                  <option value="apartment">Appartement</option>
                  <option value="building">Immeuble</option>
                  <option value="garage">Garage/Parking</option>
                  <option value="loft">Loft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PropertyFormData['status'] }))}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="available">Disponible</option>
                  <option value="rented">Loué</option>
                  <option value="maintenance">En maintenance</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <InputField
                  label="Adresse"
                  value={formData.address}
                  onChange={(value) => setFormData({ ...formData, address: value })}
                  required
                />
              </div>

              <div>
                <InputField
                  label="Ville"
                  value={formData.city}
                  onChange={(value) => setFormData({ ...formData, city: value })}
                  required
                />
              </div>

              <div>
                <InputField
                  label="Code postal"
                  type="number"
                  value={formData.postalCode.toString()}
                  onChange={(value) => setFormData(prev => ({ ...prev, postalCode: value }))}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'characteristics':
        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <InputField
                label="Surface (m²)"
                type="number"
                value={formData.surface.toString()}
                onChange={(value) => setFormData({ ...formData, surface: Number(value) })}
                required
              />
            </div>

            <div>
              <InputField
                label="Nombre de pièces"
                type="number"
                value={formData.numberOfRooms.toString()}
                onChange={(value) => setFormData({ ...formData, numberOfRooms: Number(value) })}
                required
              />
            </div>

            <div>
              <InputField
                label="Nombre de chambres"
                type="number"
                value={formData.numberOfBedrooms.toString()}
                onChange={(value) => setFormData({ ...formData, numberOfBedrooms: Number(value) })}
                required
              />
            </div>

            <div>
              <InputField
                label="Nombre de salle de bain"
                type="number"
                value={formData.numberOfBathrooms?.toString() || '0'}
                onChange={(value) => setFormData(prev => ({ ...prev, numberOfBathrooms: Number(value) }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Extérieur
              </label>
              <div className="space-y-2">
                {['balcony', 'terrace', 'garden', 'patio'].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.exterior.includes(type as any)}
                      onChange={(e) => {
                        const newExterior = e.target.checked
                          ? [...formData.exterior, type]
                          : formData.exterior.filter(t => t !== type);
                        setFormData(prev => ({ ...prev, exterior: newExterior as any[] }));
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {type === 'balcony' ? 'Balcon' :
                       type === 'terrace' ? 'Terrasse' :
                       type === 'garden' ? 'Jardin' : 'Patio'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meublé
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.isFurnished}
                    onChange={() => setFormData(prev => ({ ...prev, isFurnished: true }))}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!formData.isFurnished}
                    onChange={() => setFormData(prev => ({ ...prev, isFurnished: false }))}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Colocation
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.isSharedLiving}
                    onChange={() => setFormData(prev => ({ ...prev, isSharedLiving: true }))}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!formData.isSharedLiving}
                    onChange={() => setFormData(prev => ({ ...prev, isSharedLiving: false }))}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Classe énergétique
              </label>
              <div className="flex items-center gap-4">
                <select
                  value={formData.energyClass}
                  onChange={(e) => setFormData(prev => ({ ...prev, energyClass: e.target.value as any }))}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((classe) => (
                    <option key={classe} value={classe}>{classe}</option>
                  ))}
                </select>
                {formData.energyClass === 'G' && (
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">
                      Les logements classés G ne seront plus autorisés à la location à partir de janvier 2025
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GES
              </label>
              <select
                value={formData.gesClass}
                onChange={(e) => setFormData(prev => ({ ...prev, gesClass: e.target.value as any }))}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((classe) => (
                  <option key={classe} value={classe}>{classe}</option>
                ))}
              </select>
            </div>

            <div>
              <InputField
                label="Date de disponibilité"
                type="date"
                value={formData.availableFrom || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, availableFrom: value }))}
              />
            </div>
          </div>
        );

      case 'rent':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <InputField
                label="Loyer mensuel HC (€)"
                type="number"
                value={formData.baseRent.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, baseRent: Number(value) }))}
                required
              />
              <InputField
                label="Charges mensuelles (€)"
                type="number"
                value={formData.charges.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, charges: Number(value) }))}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loyer mensuel CC (€)
                </label>
                <input
                  type="text"
                  value={formData.baseRent + formData.charges}
                  disabled
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <InputField
                label="Dépôt de garantie (€)"
                type="number"
                value={formData.deposit.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, deposit: Number(value) }))}
                required
              />
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Photos</h4>
              <FileUpload
                onUpload={(files) => {
                  setFormData({
                    ...formData,
                    photos: [...formData.photos, ...files.map(f => ({
                      url: f.url,
                      description: ''
                    }))]
                  });
                }}
                maxFiles={10}
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
                  setFormData({
                    ...formData,
                    photos: formData.photos.filter((_, index) => index.toString() !== fileId)
                  });
                }}
              />
              {formData.photos.map((photo, index) => (
                <div key={index} className="mt-4">
                  <InputField
                    label={`Description de la photo ${index + 1}`}
                    value={photo.description || ''}
                    onChange={(value) => {
                      const newPhotos = [...formData.photos];
                      newPhotos[index] = { ...photo, description: value };
                      setFormData(prev => ({ ...prev, photos: newPhotos }));
                    }}
                  />
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vidéo</h4>
              <FileUpload
                onUpload={(files) => {
                  if (files[0]) {
                    setFormData({
                      ...formData,
                      video: {
                        url: files[0].url,
                        title: '',
                        description: ''
                      }
                    });
                  }
                }}
                maxFiles={1}
                maxSize={100 * 1024 * 1024}
                accept={{
                  'video/*': ['.mp4', '.webm', '.ogg']
                }}
                uploadedFiles={formData.video?.url ? [{
                  id: 'video',
                  url: formData.video.url,
                  name: 'Vidéo du bien',
                  type: 'video/mp4',
                  size: 0,
                }] : []}
                onRemove={() => {
                  setFormData({
                    ...formData,
                    video: { url: '', title: '', description: '' }
                  });
                }}
              />
              {formData.video?.url && (
                <div className="mt-4 space-y-4">
                  <InputField
                    label="Titre de la vidéo"
                    value={formData.video.title || ''}
                    onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        video: { ...prev.video!, title: value }
                      }));
                    }}
                  />
                  <InputField
                    label="Description de la vidéo"
                    value={formData.video.description || ''}
                    onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        video: { ...prev.video!, description: value }
                      }));
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Visite virtuelle
              </h4>
              <FileUpload
                onUpload={(files) => {
                  if (files[0]) {
                    setFormData({
                      ...formData,
                      virtualTour: files[0].url
                    });
                  }
                }}
                maxFiles={1}
                maxSize={100 * 1024 * 1024}
                accept={{
                  'model/*': ['.glb', '.gltf']
                }}
                uploadedFiles={formData.virtualTour ? [{
                  id: 'virtualTour',
                  url: formData.virtualTour,
                  name: 'Visite virtuelle',
                  type: 'model/gltf-binary',
                  size: 0,
                }] : []}
                onRemove={() => {
                  setFormData({
                    ...formData,
                    virtualTour: ''
                  });
                }}
              />
            </div>
          </div>
        );

      case 'tenant_criteria':
        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Âge
              </label>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Minimum"
                  type="number"
                  value={formData.tenantCriteria?.ageRange?.min?.toString() || ''}
                  onChange={(value) => setFormData({
                    ...formData,
                    tenantCriteria: {
                      ...formData.tenantCriteria,
                      ageRange: {
                        ...formData.tenantCriteria?.ageRange,
                        min: Number(value)
                      }
                    }
                  })}
                />
                <InputField
                  label="Maximum"
                  type="number"
                  value={formData.tenantCriteria?.ageRange?.max?.toString() || ''}
                  onChange={(value) => setFormData({
                    ...formData,
                    tenantCriteria: {
                      ...formData.tenantCriteria,
                      ageRange: {
                        ...formData.tenantCriteria?.ageRange,
                        max: Number(value)
                      }
                    }
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'employed', label: 'Salarié' },
                  { value: 'student', label: 'Étudiant' },
                  { value: 'retired', label: 'Retraité' },
                  { value: 'unemployed', label: 'Sans emploi' },
                  { value: 'business_owner', label: 'Dirigeant d\'entreprise' },
                  { value: 'other', label: 'Autre' }
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.tenantCriteria?.status?.includes(value as any)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...(formData.tenantCriteria?.status || []), value]
                          : formData.tenantCriteria?.status?.filter(s => s !== value);
                        setFormData({
                          ...formData,
                          tenantCriteria: {
                            ...formData.tenantCriteria,
                            status: newStatus as any[]
                          }
                        });
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <InputField
              label="Salaire mensuel net (€)"
              type="number"
              value={formData.tenantCriteria?.monthlyIncome?.toString() || ''}
              onChange={(value) => setFormData({
                ...formData,
                tenantCriteria: {
                  ...formData.tenantCriteria,
                  monthlyIncome: Number(value)
                }
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Garant
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.tenantCriteria?.guarantorRequired === true}
                    onChange={() => setFormData({
                      ...formData,
                      tenantCriteria: {
                        ...formData.tenantCriteria,
                        guarantorRequired: true
                      }
                    })}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.tenantCriteria?.guarantorRequired === false}
                    onChange={() => setFormData({
                      ...formData,
                      tenantCriteria: {
                        ...formData.tenantCriteria,
                        guarantorRequired: false
                      }
                    })}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                </label>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8 flex flex-col" style={{ height: '85vh' }}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Modifier un bien' : 'Ajouter un bien'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Navigation des sections */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'Informations générales' },
                { id: 'characteristics', label: 'Caractéristiques' },
                { id: 'rent', label: 'Loyer et caution' },
                { id: 'media', label: 'Photos et médias' },
                { id: 'tenant_criteria', label: 'Critères locataires' },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id as Section)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    currentSection === section.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu du formulaire */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="space-y-6">
                {renderSection()}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-4 mt-auto">
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
                {isEditMode ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}