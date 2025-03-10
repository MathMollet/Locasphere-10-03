import React, { useState } from 'react';
import { X, Building2, MapPin, Ruler, Euro, Calendar, Send, Home, Check, Thermometer, Wind } from 'lucide-react';
import { Property } from '../../types/property';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import PhotoGallery from './PhotoGallery';
import ConfirmationModal from '../common/ConfirmationModal';
import SuccessBanner from '../common/SuccessBanner';

interface PropertyDetailsModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  hideSubmitButton?: boolean;
}

export default function PropertyDetailsModal({
  property,
  isOpen,
  onClose,
  hideSubmitButton = false,
}: PropertyDetailsModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendApplication = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setError(null);
    setIsConfirmationOpen(true);
  };

  const confirmSendApplication = () => {
    try {
      applicationService.createApplication(property.id, user!, property);
      setShowSuccessBanner(true);
      setIsConfirmationOpen(false);
      setTimeout(() => {
        setShowSuccessBanner(false);
        navigate('/dashboard/tenant-applications');
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsConfirmationOpen(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
        {showSuccessBanner && (
          <SuccessBanner
            message="Votre candidature a été envoyée avec succès ! Vous allez être redirigé vers vos candidatures."
            onClose={() => setShowSuccessBanner(false)}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {property.name}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
            <div className="p-6 space-y-8">
              {property.photos.length > 0 && (
                <PhotoGallery photos={property.photos} />
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {property.name}
                  </h3>
                  {property.description && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {property.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Building2 className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Type de bien</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.type === 'apartment' ? 'Appartement' :
                         property.type === 'house' ? 'Maison' :
                         property.type === 'commercial' ? 'Local commercial' : 'Autre'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Adresse</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Ville</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Code postal</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Loyer et caution
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Euro className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Loyer mensuel HC</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.baseRent} €</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Euro className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Charges mensuelles</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.charges} €</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Euro className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Loyer mensuel CC</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.baseRent + property.charges} €</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Euro className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Caution</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.deposit} €</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Caractéristiques
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Ruler className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Surface</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.surface} m²</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Home className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Nombre de pièces</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.numberOfRooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Home className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Nombre de chambres</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.numberOfBedrooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Home className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Nombre de salles de bain</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{property.numberOfBathrooms}</p>
                    </div>
                  </div>

                  {property.exterior.length > 0 && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Home className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Extérieur</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {property.exterior.map(ext => 
                            ext === 'balcony' ? 'Balcon' :
                            ext === 'terrace' ? 'Terrasse' :
                            ext === 'garden' ? 'Jardin' :
                            ext === 'patio' ? 'Patio' : ext
                          ).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Check className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Meublé</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.isFurnished ? 'Oui' : 'Non'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Home className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Colocation</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.isSharedLiving ? 'Oui' : 'Non'}
                      </p>
                    </div>
                  </div>

                  {property.availableFrom && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Date de disponibilité</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(property.availableFrom).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Thermometer className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Classe énergétique</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.energyClass}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Wind className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">GES</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.gesClass}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!hideSubmitButton && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <button
                  onClick={handleSendApplication}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" />
                  Envoyer mon dossier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmSendApplication}
        title="Confirmer l'envoi du dossier"
        message={`Êtes-vous sûr de vouloir envoyer votre dossier pour le bien "${property.name}" ? Le propriétaire sera notifié et pourra consulter votre dossier.`}
        confirmLabel="Envoyer mon dossier"
        cancelLabel="Annuler"
      />
    </>
  );
}