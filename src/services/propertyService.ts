import { Property } from '../types/property';
import { storage } from '../utils/storage';
import { propertyCache } from './propertyCache';

const PROPERTIES_STORAGE_KEY = 'izimo_properties';

export const propertyService = {
  getProperties(): Property[] {
    try {
      const properties = storage.get(PROPERTIES_STORAGE_KEY);
      if (Array.isArray(properties)) {
        // Mettre à jour le cache des propriétés
        propertyCache.setAll(properties);
        return properties;
      }
      return [];
    } catch (error) {
      console.error('Error getting properties:', error);
      return [];
    }
  },

  saveProperties(properties: Property[]): void {
    try {
      storage.set(PROPERTIES_STORAGE_KEY, properties);
      // Mettre à jour le cache des propriétés
      propertyCache.setAll(properties);
    } catch (error) {
      console.error('Error saving properties:', error);
    }
  },

  getPropertyById(id: string): Property | null {
    try {
      // Vérifier d'abord dans le cache
      const cachedProperty = propertyCache.getById(id);
      if (cachedProperty) {
        return cachedProperty;
      }

      // Si non trouvé dans le cache, chercher dans le stockage
      const properties = this.getProperties();
      const property = properties.find(p => p.id === id);
      
      if (property) {
        // Mettre à jour le cache
        propertyCache.upsert(property);
      }
      
      return property || null;
    } catch (error) {
      console.error('Error getting property by id:', error);
      return null;
    }
  },

  findPropertyByReference(reference: string): Property | null {
    try {
      // Vérifier d'abord dans le cache
      const cachedProperty = propertyCache.getById(reference);
      if (cachedProperty) {
        // Ne retourner que les biens disponibles
        if (cachedProperty.status !== 'available') {
          return null;
        }
        return cachedProperty;
      }

      // Si non trouvé dans le cache, chercher dans le stockage
      const properties = this.getProperties();
      const property = properties.find(p => 
        p.reference.toLowerCase() === reference.toLowerCase() &&
        p.status === 'available'
      );
      
      if (property) {
        // Mettre à jour le cache
        propertyCache.upsert(property);
      }
      
      return property || null;
    } catch (error) {
      console.error('Error finding property by reference:', error);
      return null;
    }
  },

  addProperty(property: Omit<Property, 'id'>): Property {
    try {
      const properties = this.getProperties();
      const newProperty = {
        ...property,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      properties.push(newProperty);
      this.saveProperties(properties);
      
      return newProperty;
    } catch (error) {
      console.error('Error adding property:', error);
      throw new Error('Erreur lors de l\'ajout de la propriété');
    }
  },

  updateProperty(id: string, updates: Partial<Property>): Property {
    try {
      const properties = this.getProperties();
      const index = properties.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Propriété non trouvée');
      }
      
      const updatedProperty = {
        ...properties[index],
        ...updates
      };
      
      properties[index] = updatedProperty;
      this.saveProperties(properties);
      
      return updatedProperty;
    } catch (error) {
      console.error('Error updating property:', error);
      throw new Error('Erreur lors de la mise à jour de la propriété');
    }
  },

  deleteProperty(id: string): void {
    try {
      const properties = this.getProperties().filter(p => p.id !== id);
      this.saveProperties(properties);
      // Supprimer du cache
      propertyCache.remove(id);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw new Error('Erreur lors de la suppression de la propriété');
    }
  },

  searchProperties(filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    maxSurface?: number;
    rooms?: number;
    propertyTypes?: string[];
    isFurnished?: boolean | null;
    isSharedLiving?: boolean | null;
    exterior?: string[];
  }) {
    try {
      const properties = this.getProperties();
      return properties.filter(property => {
        // Filtrer d'abord par statut
        if (property.status !== 'available') {
          return false;
        }

        if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) {
          return false;
        }

        if (filters.minPrice !== undefined && property.price < filters.minPrice) {
          return false;
        }

        if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
          return false;
        }

        if (filters.minSurface !== undefined && property.surface < filters.minSurface) {
          return false;
        }

        if (filters.maxSurface !== undefined && property.surface > filters.maxSurface) {
          return false;
        }

        if (filters.rooms && property.numberOfRooms !== parseInt(filters.rooms)) {
          return false;
        }
        
        if (filters.propertyTypes?.length > 0 && !filters.propertyTypes.includes(property.type)) {
          return false;
        }
        
        if (filters.isFurnished !== null && property.isFurnished !== filters.isFurnished) {
          return false;
        }
        
        if (filters.isSharedLiving !== null && property.isSharedLiving !== filters.isSharedLiving) {
          return false;
        }
        
        if (filters.exterior?.length > 0 && !filters.exterior.some(ext => property.exterior.includes(ext as any))) {
          return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  }
};