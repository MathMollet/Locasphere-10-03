import React from 'react';
import { Property } from '../../types/property';
import { Tenant } from '../../types/tenant';

interface AdministrativeManagementProps {
  tenant: Tenant;
  property: Property;
}

export default function AdministrativeManagement() {
  return (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-gray-500 dark:text-gray-400">
        La gestion administrative sera bientôt disponible
      </p>
    </div>
  );
}