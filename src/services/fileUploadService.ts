import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';
import { compressImage } from '../utils/storageUtils';

const FILES_STORAGE_KEY = 'izimo_uploaded_files';

export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  data?: string; // Base64 data
}

export const fileUploadService = {
  async uploadFile(file: File): Promise<UploadedFile> {
    // Compresser l'image si c'est une image
    let base64Data = '';
    if (file.type.startsWith('image/')) {
      base64Data = await compressImage(file);
    } else {
      base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const uploadedFile: UploadedFile = {
      id: uuidv4(),
      url: base64Data, // Utiliser directement les données Base64 comme URL
      name: file.name,
      type: file.type,
      size: file.size,
      data: base64Data
    };

    // Sauvegarder le fichier dans le stockage local
    const files = storage.get(FILES_STORAGE_KEY) || {};
    files[uploadedFile.id] = uploadedFile;
    storage.set(FILES_STORAGE_KEY, files);

    return uploadedFile;
  },

  async uploadMultipleFiles(files: File[]): Promise<UploadedFile[]> {
    return Promise.all(files.map(file => this.uploadFile(file)));
  },

  validateFile(file: File, config: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}): string | null {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = [] } = config;

    if (maxSize && file.size > maxSize) {
      return `Le fichier est trop volumineux. Taille maximum: ${Math.round(maxSize / 1024 / 1024)}Mo`;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `Type de fichier non supporté. Types acceptés: ${allowedTypes.join(', ')}`;
    }

    return null;
  },

  getFile(fileId: string): UploadedFile | null {
    const files = storage.get(FILES_STORAGE_KEY) || {};
    return files[fileId] || null;
  },

  removeFile(fileId: string): void {
    const files = storage.get(FILES_STORAGE_KEY) || {};
    delete files[fileId];
    storage.set(FILES_STORAGE_KEY, files);
  }
};