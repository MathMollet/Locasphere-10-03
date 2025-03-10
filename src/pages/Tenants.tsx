import React, { useState, useEffect } from 'react';
import { useTenants } from '../hooks/useTenants';
import { useProperties } from '../hooks/useProperties';
import TenantList from '../components/tenants/TenantList';
import TenantDetailsModal from '../components/tenants/TenantDetailsModal';
import PageHeader from '../components/common/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tenantService } from '../services/tenantService';
import { Tenant } from '../types/tenant';

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const {
    selectedTenant,
    setSelectedTenant,
    isModalOpen,
    setIsModalOpen,
    openChat,
  } = useTenants();
  const { properties } = useProperties();
  const navigate = useNavigate();

  useEffect(() => {
    const loadedTenants = tenantService.getTenants();
    setTenants(loadedTenants);
    // Sélectionner le premier bien par défaut
    if (properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties]);

  const handleViewDetails = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const getPropertyForTenant = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  // Grouper les locataires par bien
  const tenantsByProperty = properties.reduce((acc, property) => {
    acc[property.id] = tenants.filter(tenant => tenant.propertyId === property.id);
    return acc;
  }, {} as Record<string, typeof tenants>);

  // Si aucun bien n'est sélectionné et qu'il y a des biens disponibles,
  // sélectionner le premier bien
  useEffect(() => {
    if (!selectedPropertyId && properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [selectedPropertyId, properties]);

  return (
    <div className="p-8">
      <PageHeader
        title="Mes locataires"
        description="Gérez vos locataires et leurs dossiers"
      />

      <Tabs defaultValue={selectedPropertyId || properties[0]?.id} className="mt-8">
        <TabsList>
          {properties.map(property => (
            <TabsTrigger key={property.id} value={property.id} className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {property.name}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                {tenantsByProperty[property.id]?.length || 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {properties.map(property => {
          const propertyTenants = tenantsByProperty[property.id] || [];
          return (
          <TabsContent key={property.id} value={property.id} className="mt-6">
            {propertyTenants.length > 0 ? (
              <TenantList
                tenants={propertyTenants}
                getPropertyForTenant={getPropertyForTenant}
                onOpenChat={openChat}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun locataire pour ce bien
                </p>
              </div>
            )}
          </TabsContent>
        )})}
      </Tabs>

      {selectedTenant && (
        <TenantDetailsModal
          tenant={selectedTenant}
          property={getPropertyForTenant(selectedTenant.propertyId)}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTenant(null);
          }}
        />
      )}
    </div>
  );
}