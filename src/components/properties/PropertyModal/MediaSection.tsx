import React from 'react';
import FileUpload from '../../upload/FileUpload';
import { PropertyFormData } from '../../../types/property';

interface MediaSectionProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export default function MediaSection({ formData, setFormData }: MediaSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Photos</h4>
        <FileUpload
          onUpload={(files) => {
            setFormData({
              ...formData,
              photos: [...formData.photos, ...files.map(f => f.url)]
            });
          }}
          onError={(error) => {
            console.error(error);
          }}
          maxFiles={10}
          maxSize={5 * 1024 * 1024}
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
          }}
          uploadedFiles={formData.photos.map((url, index) => ({
            id: index.toString(),
            url,
            name: `Photo ${index + 1}`,
            type: 'image/jpeg',
            size: 0,
          }))}
          onRemove={(fileId) => {
            setFormData({
              ...formData,
              photos: formData.photos.filter((_, index) => index.toString() !== fileId)
            });
          }}
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vidéo</h4>
        <FileUpload
          onUpload={(files) => {
            if (files[0]) {
              setFormData({
                ...formData,
                video: files[0].url
              });
            }
          }}
          maxFiles={1}
          maxSize={100 * 1024 * 1024}
          accept={{
            'video/*': ['.mp4', '.webm', '.ogg']
          }}
          uploadedFiles={formData.video ? [{
            id: 'video',
            url: formData.video,
            name: 'Vidéo du bien',
            type: 'video/mp4',
            size: 0,
          }] : []}
          onRemove={() => {
            setFormData({
              ...formData,
              video: ''
            });
          }}
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Visite virtuelle
        </h4>
        <FileUpload
          onUpload={(files) => {
            if (files[0]) {
              setFormData({
                ...formData,
                virtualTour: files[0].url
              });
            }
          }}
          maxFiles={1}
          maxSize={100 * 1024 * 1024}
          accept={{
            'model/*': ['.glb', '.gltf']
          }}
          uploadedFiles={formData.virtualTour ? [{
            id: 'virtualTour',
            url: formData.virtualTour,
            name: 'Visite virtuelle',
            type: 'model/gltf-binary',
            size: 0,
          }] : []}
          onRemove={() => {
            setFormData({
              ...formData,
              virtualTour: ''
            });
          }}
        />
      </div>
    </div>
  );
}