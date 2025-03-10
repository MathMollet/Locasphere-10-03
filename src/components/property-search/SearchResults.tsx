import React from 'react';
import { Property } from '../../types/property';
import { Building2, MapPin, Ruler, Euro, Calendar, Home, Check } from 'lucide-react';

interface SearchResultsProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

export default function SearchResults({ properties, onPropertySelect }: SearchResultsProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Aucun bien ne correspond à vos critères
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 transition-all"
          onClick={() => onPropertySelect(property)}
        >
          {property.photos.length > 0 && (
            <div className="aspect-video">
              <img
                src={property.photos[0]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {property.name}
            </h3>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-500">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {property.type === 'apartment' ? 'Appartement' : property.type === 'house' ? 'Maison' : property.type === 'commercial' ? 'Local commercial' : 'Autre'}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm truncate" title={`${property.address}, ${property.city}`}>
                  {property.address}, {property.city}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <Ruler className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.surface} m²</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Home className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.numberOfRooms} pièce{property.numberOfRooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Check className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.isFurnished ? 'Meublé' : 'Non meublé'}</span>
              </div>
              {property.availableFrom && (
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Disponible le {new Date(property.availableFrom).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                <Euro className="h-4 w-4 mr-1" />
                <span className="text-lg font-semibold">
                  {property.rentAmount + property.charges}
                </span>
                <span className="text-sm text-gray-500">/mois CC</span>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                Voir détails
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}