import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { propertyService } from '../services/propertyService';
import { propertyCache } from '../services/propertyCache';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = () => {
      try {
        setIsLoading(true);
        const loadedProperties = propertyService.getProperties();
        setProperties(loadedProperties);
        // Mettre à jour le cache
        propertyCache.setAll(loadedProperties);
        setError(null);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Erreur lors du chargement des propriétés');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const addProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
      const newProperty = propertyService.addProperty(propertyData);
      setProperties(prev => [...prev, newProperty]);
      return newProperty;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const updatedProperty = propertyService.updateProperty(id, updates);
      setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
      return updatedProperty;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  return {
    properties,
    isLoading,
    error,
    addProperty,
    updateProperty,
    deleteProperty
  };
}