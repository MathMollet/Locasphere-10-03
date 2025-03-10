import React from 'react';
import { Calendar, Wrench, AlertCircle, Clock, Building2 } from 'lucide-react';
import { Incident } from '../../types/incident';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { formatDate } from '../../utils/dateUtils';
import { PencilIcon, User } from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  property: { name: string } | undefined;
  tenant: { firstName: string; lastName: string } | undefined;
  onDelete?: (incidentId: string) => void;
  onUpdateStatus: (incidentId: string, status: Incident['status']) => void;
  onViewDetails: (incident: Incident) => void;
  onEdit?: (incident: Incident) => void;
}

const typeLabels = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  locksmith: 'Serrurerie',
  heating: 'Chauffage',
  windows: 'Vitrerie/Fenêtre',
  appliance: 'Électroménager',
  other: 'Autre',
};

const roomLabels = {
  entrance: 'Entrée',
  kitchen: 'Cuisine',
  bathroom: 'Salle de bain',
  wc: 'WC',
  living_room: 'Salon',
  bedroom: 'Chambre',
  corridor: 'Couloir',
  storage: 'Placard',
  exterior: 'Extérieur',
  cellar: 'Cave',
  garage: 'Garage',
  parking: 'Parking',
  other: 'Autre'
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400',
  cancelled_tenant: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
  reported: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
  in_charge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
  cancelled_owner: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400', 
  closed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
};

const statusLabels = {
  draft: 'Brouillon',
  cancelled_tenant: 'Annulé locataire',
  reported: 'Signalé',
  in_charge: 'Pris en charge',
  cancelled_owner: 'Annulé propriétaire',
  in_progress: 'En cours de résolution',
  resolved: 'Résolu',
  closed: 'Clôturé'
};

export default function IncidentCard({
  incident,
  property,
  tenant,
  onDelete,
  onUpdateStatus,
  onViewDetails,
  onEdit,
}: IncidentCardProps) {
  return (
    <div
      onClick={() => onViewDetails(incident)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50 overflow-hidden
        cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 hover:shadow-md"
    >
      {incident.photos.length > 0 && (
        <div className="relative h-48">
          <img
            src={incident.photos[0].url}
            alt={incident.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {incident.title}
            </h3>
            <div className="mt-1 space-y-1">
              {property && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{property.name}</p>
              )}
              {tenant && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{tenant.firstName} {tenant.lastName}</span>
                </div>
              )}
              {tenant && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{tenant.firstName} {tenant.lastName}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`}>
            {statusLabels[incident.status]}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Début : {formatDate(incident.startDate)}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Wrench className="h-4 w-4 mr-2" />
            <span className="text-sm">{typeLabels[incident.type]}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="text-sm">{roomLabels[incident.room]}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Il y a {formatDistanceToNow(new Date(incident.createdAt))}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {incident.description}
        </p>

        {incident.scheduledDate && (
          <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Intervention prévue le {new Date(incident.scheduledDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {incident.status === 'draft' && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(incident);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 mr-3"
            >
              <PencilIcon className="h-4 w-4" />
              Modifier le brouillon
            </button>
          )}
          {incident.status === 'draft' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(incident.id, 'reported');
              }}
              className="inline-flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-900/50 px-3 py-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/70 mr-3"
            >
              Déclarer l'incident
            </button>
          )}
          {incident.status === 'cancelled' && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(incident.id);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/50 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/70 mr-3"
            >
              Supprimer l'incident
            </button>
          )}
          {incident.status !== 'cancelled' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(incident.id, 'cancelled_tenant');
              }}
              className="inline-flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/50 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/70 mr-3"
            >
              Annuler l'incident
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(incident);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/70"
          >
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
}