
import React, { useState } from 'react';
import { Gallery } from '@/data/types/gallery';
import { Heart } from 'lucide-react';

interface GalleryImagePanelProps {
  gallery: Gallery;
  onFavoriteToggle: (galleryId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
}

const GalleryImagePanel: React.FC<GalleryImagePanelProps> = ({
  gallery,
  onFavoriteToggle,
  isFavorite,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image failed to load:", gallery.image);
    setImageError(true);
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-transparent">
      {gallery.image && !imageError ? (
        <img
          src={gallery.image}
          alt={gallery.name}
          className="w-full h-full object-cover bg-transparent"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(gallery.id, !isFavorite);
        }}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm transition-colors"
      >
        <Heart
          className={`h-6 w-6 ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
      </button>
    </div>
  );
};

export default GalleryImagePanel;
