import React from 'react';
import { Tenant } from '../../types/tenant';
import TenantCard from './TenantCard';

interface TenantListProps {
  tenants: Tenant[];
  getPropertyForTenant: (propertyId: string) => { name: string } | undefined;
  onOpenChat: (tenantId: string) => void;
  onViewDetails: (tenant: Tenant) => void;
}

export default function TenantList({
  tenants,
  getPropertyForTenant,
  onOpenChat,
  onViewDetails,
}: TenantListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {tenants.map((tenant) => (
        <TenantCard
          key={tenant.id}
          tenant={tenant}
          property={getPropertyForTenant(tenant.propertyId)}
          onOpenChat={onOpenChat}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}