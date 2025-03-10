import React from 'react';
import { PlusCircle } from 'lucide-react';
import { usePropertyManagement } from '../hooks/usePropertyManagement';
import { useTenants } from '../hooks/useTenants';
import PropertyList from '../components/properties/PropertyList';
import PropertyModal from '../components/properties/PropertyModal';
import TenantDetailsModal from '../components/tenants/TenantDetailsModal';
import PageHeader from '../components/common/PageHeader';

export default function Properties() {
  const {
    properties,
    selectedProperty,
    isModalOpen,
    isEditMode,
    openEditModal,
    openAddModal,
    closeModal,
    handleDelete,
    handleEdit,
    handleAddProperty
  } = usePropertyManagement();

  const {
    tenants,
    selectedTenant,
    setSelectedTenant,
    isModalOpen: isTenantModalOpen,
    setIsModalOpen: setIsTenantModalOpen,
  } = useTenants();

  const handleViewTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsTenantModalOpen(true);
  };

  const getPropertyForTenant = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Mes biens"
        description="Gérez vos biens immobiliers"
        action={{
          label: "Ajouter un bien",
          icon: PlusCircle,
          onClick: openAddModal
        }}
      />

      <PropertyList
        properties={properties}
        tenants={tenants}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onViewTenant={handleViewTenant}
      />

      <PropertyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={(propertyData) => {
          if (isEditMode && selectedProperty) {
            handleEdit(selectedProperty.id, propertyData);
          } else {
            handleAddProperty(propertyData);
          }
        }}
        property={selectedProperty}
        isEditMode={isEditMode}
      />

      {selectedTenant && (
        <TenantDetailsModal
          tenant={selectedTenant}
          property={getPropertyForTenant(selectedTenant.propertyId)}
          isOpen={isTenantModalOpen}
          onClose={() => {
            setIsTenantModalOpen(false);
            setSelectedTenant(null);
          }}
        />
      )}
    </div>
  );
}