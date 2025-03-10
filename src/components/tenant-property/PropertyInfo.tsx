import React from 'react';
import { Building2, MapPin, Ruler, Euro, Calendar } from 'lucide-react';
import { Property } from '../../types/property';

interface PropertyInfoProps {
  property: Property;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {property.name}
            </h2>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {property.address}, {property.postalCode} {property.city}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Building2 className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm">
                {property.type === 'apartment' ? 'Appartement' :
                 property.type === 'house' ? 'Maison' :
                 property.type === 'commercial' ? 'Local commercial' : 'Autre'}
              </p>
            </div>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Ruler className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Surface</p>
              <p className="text-sm">{property.surface} m²</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Euro className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Loyer</p>
              <p className="text-sm">{property.rentAmount} €/mois</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Construction</p>
              <p className="text-sm">
                {property.constructionYear || 'Non renseigné'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}