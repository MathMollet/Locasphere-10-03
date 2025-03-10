import React from 'react';
import { User, Camera } from 'lucide-react';
import FileUpload from '../upload/FileUpload';

interface ProfilePhotoProps {
  avatarUrl?: string;
  onPhotoChange: (url: string) => void;
  disabled?: boolean;
}

export default function ProfilePhoto({ avatarUrl, onPhotoChange, disabled = false }: ProfilePhotoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
            <Camera className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Photo de profil
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personnalisez votre profil avec une photo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Photo de profil"
                className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-700"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 ring-4 ring-gray-50 dark:ring-gray-600 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {!disabled && (
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FileUpload
                  onUpload={(files) => {
                    if (files[0]) {
                      onPhotoChange(files[0].url);
                    }
                  }}
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                  }}
                  uploadedFiles={[]}
                  onRemove={() => {}}
                  disabled={disabled}
                  className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                  dropZoneClassName="hidden"
                >
                  <Camera className="h-8 w-8 text-white" />
                </FileUpload>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Formats acceptés : JPG, PNG ou WebP
              <br />
              Taille maximale : 5 Mo
            </p>
            {avatarUrl && !disabled && (
              <button
                onClick={() => onPhotoChange('')}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500"
              >
                Supprimer la photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}