export type IncidentType = 
  | 'plumbing'
  | 'electrical'
  | 'locksmith'
  | 'heating'
  | 'windows'
  | 'appliance'
  | 'structural'
  | 'other';

export type Room =
  | 'entrance'
  | 'kitchen'
  | 'bathroom'
  | 'wc'
  | 'living_room'
  | 'bedroom'
  | 'corridor'
  | 'storage'
  | 'exterior'
  | 'cellar'
  | 'garage'
  | 'parking'
  | 'other';

export type IncidentStatus = 
  | 'draft'
  | 'cancelled_tenant'
  | 'reported'
  | 'in_charge' 
  | 'cancelled_owner'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export interface IncidentPhoto {
  id: string;
  url: string;
  uploadedAt: string;
}

export interface Incident {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  room: Room;
  type: IncidentType;
  status: IncidentStatus;
  title: string;
  description: string;
  photos: IncidentPhoto[];
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  estimatedCost?: number;
  resolution?: string;
  comments?: IncidentComment[];
}

export interface IncidentComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}