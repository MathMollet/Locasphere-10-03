import React, { useState } from 'react';
import { Building2, MapPin, Ruler, Euro, Calendar, Pencil, Trash2, Users, MessageSquare, Share2, Hash } from 'lucide-react';
import { Property } from '../../types/property';
import { Tenant } from '../../types/tenant';
import PropertyDetailsModal from '../property-search/PropertyDetailsModal';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  tenants: Tenant[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onViewTenant: (tenant: Tenant) => void;
}

const statusColors = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
  rented: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
  maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
};

const statusLabels = {
  available: 'Disponible',
  rented: 'Loué',
  maintenance: 'En maintenance',
};

export default function PropertyCard({ property, tenants, onEdit, onDelete, onViewTenant }: PropertyCardProps) {
  const navigate = useNavigate();
  const propertyTenants = tenants.filter(tenant => tenant.propertyId === property.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Si le clic vient d'un bouton, ne pas ouvrir la modal
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onEdit(property);
  };

  const handleOpenChat = (tenantId: string) => {
    navigate(`/chat?tenant=${tenantId}`);
  };

  const handlePublishListing = () => {
    // Cette fonction sera implémentée plus tard
    console.log('Publishing listing for property:', property.id);
  };

  return (
    <>
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden group cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 hover:shadow-md"
    >
      {property.photos.length > 0 && (
        <div className="relative h-48">
          <img
            src={property.photos[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{property.name}</h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {property.address}, {property.postalCode} {property.city}
              </span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
            {statusLabels[property.status]}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="text-sm">{property.type}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Ruler className="h-4 w-4 mr-2" />
            <span className="text-sm">{property.surface} m²</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Euro className="h-4 w-4 mr-2" />
            <span className="text-sm">{property.rentAmount} €/mois</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Hash className="h-4 w-4 mr-2" />
            <span className="text-sm font-mono">
              {property.reference}
            </span>
          </div>
          {property.availableFrom && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Dispo. {new Date(property.availableFrom).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {propertyTenants.length > 0 && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Locataires
              </span>
            </div>
            <div className="space-y-2">
              {propertyTenants.map(tenant => (
                <div key={tenant.id} className="flex items-center justify-between">
                  <button
                    onClick={() => onViewTenant(tenant)}
                    className="text-left px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tenant.firstName} {tenant.lastName}
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenChat(tenant.id)}
                    className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                    title="Envoyer un message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          {property.status === 'available' && (
            <button
              onClick={handlePublishListing}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/70"
            >
              <Share2 className="h-4 w-4" />
              Aide à la publication de l'annonce
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property.id);
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}