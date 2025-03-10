import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const showPreviousPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) return null;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div
            key={index}
            onClick={() => setIsFullscreen(true)}
            className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Vue plein écran */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={showPreviousPhoto}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <img
            src={photos[currentPhotoIndex]}
            alt={`Photo ${currentPhotoIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={showNextPhoto}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}