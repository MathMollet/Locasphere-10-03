import React from 'react';
import { Property } from '../../types/property';
import { Tenant } from '../../types/tenant';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  tenants: Tenant[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onViewTenant: (tenant: Tenant) => void;
}

export default function PropertyList({ properties, tenants, onEdit, onDelete, onViewTenant }: PropertyListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          tenants={tenants}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewTenant={onViewTenant}
        />
      ))}
    </div>
  );
}