import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { fileUploadService, UploadedFile } from '../../services/fileUploadService';

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
  accept?: Record<string, string[]>;
  uploadedFiles?: UploadedFile[];
  onRemove?: (fileId: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  dropZoneClassName?: string;
}

export default function FileUpload({
  onUpload,
  onError,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  allowedTypes = [],
  accept,
  uploadedFiles = [],
  onRemove,
  disabled = false,
  children,
  className = '',
  dropZoneClassName = '',
}: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      // Valider chaque fichier
      for (const file of acceptedFiles) {
        const error = fileUploadService.validateFile(file, { maxSize, allowedTypes });
        if (error) {
          onError?.(error);
          return;
        }
      }

      // Uploader les fichiers
      const uploadedFiles = await fileUploadService.uploadMultipleFiles(acceptedFiles);
      onUpload(uploadedFiles);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'upload');
    }
  }, [onUpload, onError, maxSize, allowedTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    disabled,
  });

  const dropZoneContent = children || (
    <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
      ${isDragActive
        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50'
        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
      } ${dropZoneClassName}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className={`h-8 w-8 ${
          isDragActive ? 'text-indigo-500' : 'text-gray-400'
        }`} />
        {isDragActive ? (
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            Déposez les fichiers ici
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {maxFiles > 1 ? `Maximum ${maxFiles} fichiers` : '1 fichier maximum'} •{' '}
              {Math.round(maxSize / 1024 / 1024)}Mo max par fichier
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={className}>
        <input {...getInputProps()} />
        {dropZoneContent}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {file.name}
                  </span>
                </div>
              )}
              {onRemove && (
                <button
                  onClick={() => onRemove(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}