import { storage } from './storage';

export const compressImage = async (file: File, maxWidth = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const optimizeStorageItem = async <T>(
  key: string,
  value: T,
  options: {
    maxItems?: number;
    compressImages?: boolean;
    maxImageWidth?: number;
  } = {}
): Promise<T> => {
  const { maxItems, compressImages = true, maxImageWidth = 800 } = options;

  // Si c'est un tableau et qu'il y a une limite d'items
  if (Array.isArray(value) && maxItems) {
    value = value.slice(-maxItems) as any;
  }

  // Si l'option de compression d'images est activée
  if (compressImages) {
    const processObject = async (obj: any): Promise<any> => {
      if (!obj) return obj;

      if (Array.isArray(obj)) {
        return Promise.all(obj.map(processObject));
      }

      if (typeof obj === 'object') {
        const processed: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string' && value.startsWith('data:image')) {
            processed[key] = await compressImage(
              dataURLtoFile(value, 'image.jpg'),
              maxImageWidth
            );
          } else {
            processed[key] = await processObject(value);
          }
        }
        return processed;
      }

      return obj;
    };

    value = await processObject(value);
  }

  return value;
};

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};