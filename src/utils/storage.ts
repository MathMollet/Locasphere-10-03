import { isBrowser } from './environment';

const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB safety limit
const MAX_ITEM_SIZE = 2 * 1024 * 1024; // 2MB per item limit

export const storage = {
  get: (key: string) => {
    if (!isBrowser) return null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      try {
        return JSON.parse(item);
      } catch (parseError) {
        console.error(`Error parsing localStorage item (${key}):`, parseError);
        return null;
      }
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    if (!isBrowser) return;
    try {
      // Convertir la valeur en chaîne JSON
      const serializedValue = JSON.stringify(value);
      const itemSize = new Blob([serializedValue]).size;
      
      // Check individual item size
      if (itemSize > MAX_ITEM_SIZE) {
        console.error(`Item size (${Math.round(itemSize / 1024)}KB) exceeds maximum allowed size (${Math.round(MAX_ITEM_SIZE / 1024)}KB)`);
        return;
      }

      // Try to save, clean up if needed
      try {
        localStorage.setItem(key, serializedValue);
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, attempting cleanup...');
          cleanupStorage();
          try {
            localStorage.setItem(key, serializedValue);
          } catch (retryError) {
            console.error('Failed to save item even after cleanup:', retryError);
          }
        } else {
          throw e;
        }
      }
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  },
  
  remove: (key: string) => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }
};

// Fonction pour nettoyer le stockage
function cleanupStorage() {
  try {
    // Supprimer les anciennes notifications
    try {
      const notifications = storage.get('izimo_notifications') || [];
      const recentNotifications = notifications
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50);
      storage.set('izimo_notifications', recentNotifications);
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }

    // Nettoyer les fichiers uploadés
    try {
      const uploadedFiles = storage.get('izimo_uploaded_files') || {};
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentFiles = Object.entries(uploadedFiles).reduce((acc: any, [key, value]: [string, any]) => {
        if (new Date(value.uploadedAt) > oneWeekAgo) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      storage.set('izimo_uploaded_files', recentFiles);
    } catch (error) {
      console.error('Error cleaning up uploaded files:', error);
    }
  } catch (error) {
    console.error('Error during storage cleanup:', error);
  }
}