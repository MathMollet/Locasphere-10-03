import { isBrowser } from '../utils/environment';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

// Clés de stockage
const STORES = {
  USERS: 'izimo_users',
  PROPERTIES: 'izimo_properties',
  APPLICATIONS: 'izimo_applications',
  TENANT_FILES: 'izimo_tenant_files',
  FILES: 'izimo_files'
} as const;

// Fonctions utilitaires
function getStore<T>(storeName: string): T[] {
  return storage.get(storeName) || [];
}

function setStore<T>(storeName: string, data: T[]): void {
  storage.set(storeName, data);
}

// Interface publique
export default {
  // Opérations CRUD génériques
  async getAll(storeName: string) {
    return getStore(storeName);
  },

  async get(storeName: string, id: string) {
    const items = getStore(storeName);
    return items.find((item: any) => item.id === id);
  },

  async put(storeName: string, item: any) {
    const items = getStore(storeName);
    const index = items.findIndex((i: any) => i.id === item.id);
    
    if (index === -1) {
      items.push({ ...item, id: item.id || uuidv4() });
    } else {
      items[index] = item;
    }
    
    setStore(storeName, items);
    return item;
  },

  async delete(storeName: string, id: string) {
    const items = getStore(storeName);
    const filtered = items.filter((item: any) => item.id !== id);
    setStore(storeName, filtered);
  },

  async clear(storeName: string) {
    setStore(storeName, []);
  },

  // Recherche par index
  async getByIndex(storeName: string, field: string, value: any) {
    const items = getStore(storeName);
    return items.filter((item: any) => item[field] === value);
  },

  // Initialisation
  async init() {
    if (!isBrowser) {
      console.log('Initialisation ignorée - environnement non-navigateur');
      return;
    }

    // Créer l'utilisateur admin par défaut s'il n'existe pas
    const users = getStore(STORES.USERS);
    if (users.length === 0) {
      const adminUser = {
        id: uuidv4(),
        email: 'admin@izimo.com',
        password: 'admin123',
        firstName: 'Stéphane',
        lastName: 'FARIGOULE',
        role: 'owner',
        notificationPreferences: {
          email: true,
          push: true
        }
      };
      await this.put(STORES.USERS, adminUser);
      console.log('Utilisateur admin créé avec succès');
    }
  },

  STORES
};