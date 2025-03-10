import { Property } from '../types/property';
import { storage } from '../utils/storage';

const PROPERTIES_CACHE_KEY = 'izimo_properties_cache';

export const propertyCache = {
  // Récupérer toutes les propriétés du cache
  getAll(): Property[] {
    try {
      const properties = storage.get(PROPERTIES_CACHE_KEY);
      return Array.isArray(properties) ? properties : [];
    } catch (error) {
      console.error('Error getting properties from cache:', error);
      return [];
    }
  },

  // Récupérer une propriété par son ID
  getById(id: string): Property | null {
    try {
      const properties = this.getAll();
      return properties.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error getting property by id:', error);
      return null;
    }
  },

  // Mettre à jour le cache des propriétés
  setAll(properties: Property[]): void {
    try {
      storage.set(PROPERTIES_CACHE_KEY, properties);
    } catch (error) {
      console.error('Error setting properties cache:', error);
    }
  },

  // Ajouter ou mettre à jour une propriété
  upsert(property: Property): void {
    try {
      const properties = this.getAll();
      const index = properties.findIndex(p => p.id === property.id);
      
      if (index !== -1) {
        properties[index] = property;
      } else {
        properties.push(property);
      }
      
      this.setAll(properties);
    } catch (error) {
      console.error('Error upserting property:', error);
    }
  },

  // Supprimer une propriété
  remove(id: string): void {
    try {
      const properties = this.getAll().filter(p => p.id !== id);
      this.setAll(properties);
    } catch (error) {
      console.error('Error removing property:', error);
    }
  },

  // Vérifier si une propriété existe
  exists(id: string): boolean {
    return this.getById(id) !== null;
  }
};