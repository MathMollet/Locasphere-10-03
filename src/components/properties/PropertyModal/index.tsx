import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Property, PropertyFormData } from '../../../types/property';
import GeneralSection from './GeneralSection';
import CharacteristicsSection from './CharacteristicsSection';
import ListingSection from './ListingSection';
import RentSection from './RentSection';
import TenantCriteriaSection from './TenantCriteriaSection';
import MediaSection from './MediaSection';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (property: PropertyFormData) => void;
  property?: Property;
  isEditMode?: boolean;
}

const defaultFormData: PropertyFormData = {
  name: '',
  type: 'apartment',
  address: '',
  city: '',
  postalCode: '',
  surface: 0,
  rentAmount: 0,
  status: 'available',
  photos: [],
  description: '',
  isFurnished: false,
  isSharedLiving: false,
  constructionYear: '',
  numberOfRooms: 1,
  numberOfBedrooms: 1,
  numberOfBathrooms: 1,
  energyClass: 'A',
  gesClass: 'A',
  listingTitle: '',
  listingDescription: '',
  baseRent: 0,
  charges: 0,
  deposit: 0,
  video: '',
  virtualTour: '',
  availableFrom: '',
  tenantCriteria: {
    minIncome: 0,
    preferredDuration: 'one_year',
    ageRange: {
      min: 18,
      max: undefined,
    },
  },
};

type Section = 'general' | 'characteristics' | 'listing' | 'rent' | 'media' | 'tenant_criteria';

export default function PropertyModal({
  isOpen,
  onClose,
  onSubmit,
  property,
  isEditMode = false,
}: PropertyModalProps) {
  const [currentSection, setCurrentSection] = useState<Section>('general');
  const [formData, setFormData] = useState<PropertyFormData>(defaultFormData);

  useEffect(() => {
    if (property && isEditMode) {
      setFormData(property);
    }
  }, [property, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Modifier le bien' : 'Ajouter un bien'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* Navigation des sections */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'Informations générales' },
                { id: 'characteristics', label: 'Caractéristiques' },
                { id: 'listing', label: 'Description annonce' },
                { id: 'rent', label: 'Loyer et caution' },
                { id: 'tenant_criteria', label: 'Critères locataires' },
                { id: 'media', label: 'Photos et médias' },
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
          <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <div className="space-y-6">
              {currentSection === 'general' && (
                <GeneralSection formData={formData} setFormData={setFormData} />
              )}

              {currentSection === 'characteristics' && (
                <CharacteristicsSection formData={formData} setFormData={setFormData} />
              )}

              {currentSection === 'listing' && (
                <ListingSection formData={formData} setFormData={setFormData} />
              )}

              {currentSection === 'rent' && (
                <RentSection formData={formData} setFormData={setFormData} />
              )}

              {currentSection === 'tenant_criteria' && (
                <TenantCriteriaSection formData={formData} setFormData={setFormData} />
              )}

              {currentSection === 'media' && (
                <MediaSection formData={formData} setFormData={setFormData} />
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
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