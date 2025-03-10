import { useState } from 'react';
import { Property } from '../types/property';
import { useProperties } from './useProperties';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';

export function usePropertyManagement() {
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();

  const openEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProperty(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setIsEditMode(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  const handleEdit = async (id: string, updates: Partial<Property>) => {
    try {
      await updateProperty(id, updates);
      closeModal();
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  const handleAddProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
      if (!user) return;
      await addProperty({
        ...propertyData,
        ownerId: user.id,
      });
      closeModal();
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  return {
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
  };
}