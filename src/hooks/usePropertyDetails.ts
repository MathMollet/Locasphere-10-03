import { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { propertyCache } from '../services/propertyCache';

export function usePropertyDetails(propertyId: string | null) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setProperty(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cachedProperty = propertyCache.getById(propertyId);
      if (cachedProperty) {
        setProperty(cachedProperty);
      } else {
        setError('Propriété non trouvée');
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Erreur lors du chargement de la propriété');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  return { property, isLoading, error };
}