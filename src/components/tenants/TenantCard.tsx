import React from 'react';
import { MessageSquare, Calendar, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { Tenant } from '../../types/tenant';
import { useNavigate } from 'react-router-dom';

interface TenantCardProps {
  tenant: Tenant;
  property: { name: string; address: string; city: string } | undefined;
  onViewDetails: (tenant: Tenant) => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
  former: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400',
};

const statusLabels = {
  active: 'Locataire actif',
  pending: 'En attente',
  former: 'Ancien locataire',
};

export default function TenantCard({
  tenant,
  property,
  onViewDetails,
}: TenantCardProps) {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    navigate(`/chat?tenant=${tenant.id}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 transition-all"
      onClick={() => onViewDetails(tenant)}
    >
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              {tenant.avatarUrl ? (
                <img
                  src={tenant.avatarUrl}
                  alt={`${tenant.firstName} ${tenant.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {tenant.firstName[0]}{tenant.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tenant.firstName} {tenant.lastName}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium ${statusColors[tenant.status]}`}>
                  {statusLabels[tenant.status]}
                </span>
              </div>
            </div>
          </div>
          {property && (
            <div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{property.name}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.address}, {property.city}</span>
              </div>
            </div>
          )}
        
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Date d'entrée</p>
                <p className="text-sm">{new Date(tenant.rentStartDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm">{tenant.phone}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{tenant.email}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChat();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/70"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}