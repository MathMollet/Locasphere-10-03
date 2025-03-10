import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { TenantFile } from '../types/tenant';

const TENANT_FILES_STORAGE_KEY = 'izimo_tenant_files';

export const tenantFileService = {
  getTenantFile(userId: string): TenantFile | null {
    try {
      const files = storage.get(TENANT_FILES_STORAGE_KEY) || {};
      return files[userId] || null;
    } catch (error) {
      console.error('Error getting tenant file:', error);
      return null;
    }
  },

  saveTenantFile(data: TenantFile): void {
    try {
      const files = storage.get(TENANT_FILES_STORAGE_KEY) || {};
      files[data.userId] = data;
      storage.set(TENANT_FILES_STORAGE_KEY, files);
    } catch (error) {
      console.error('Error saving tenant file:', error);
      throw new Error('Erreur lors de la sauvegarde du dossier');
    }
  },

  addDocument(userId: string, document: Omit<TenantFile['documents'][0], 'id' | 'uploadedAt'>): void {
    try {
      const files = storage.get(TENANT_FILES_STORAGE_KEY) || {};
      const tenantFile = files[userId] || { userId, personalInfo: {}, documents: [] };

      const newDocument = {
        ...document,
        id: uuidv4(),
        uploadedAt: new Date().toISOString()
      };

      // Remplacer le document existant du même type s'il existe
      tenantFile.documents = tenantFile.documents.filter(doc => doc.type !== document.type);
      tenantFile.documents.push(newDocument);

      files[userId] = tenantFile;
      storage.set(TENANT_FILES_STORAGE_KEY, files);
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Erreur lors de l\'ajout du document');
    }
  },

  removeDocument(userId: string, documentId: string): void {
    try {
      const files = storage.get(TENANT_FILES_STORAGE_KEY) || {};
      const tenantFile = files[userId];
      
      if (tenantFile) {
        tenantFile.documents = tenantFile.documents.filter(doc => doc.id !== documentId);
        files[userId] = tenantFile;
        storage.set(TENANT_FILES_STORAGE_KEY, files);
      }
    } catch (error) {
      console.error('Error removing document:', error);
      throw new Error('Erreur lors de la suppression du document');
    }
  }
};