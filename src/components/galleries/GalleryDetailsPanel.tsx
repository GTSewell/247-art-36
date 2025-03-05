
import React from 'react';
import { Gallery } from '@/data/types/gallery';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GalleryDetailsPanelProps {
  gallery: Gallery;
  onSelect: () => void;
  onClose?: () => void;
}

const GalleryDetailsPanel: React.FC<GalleryDetailsPanelProps> = ({
  gallery,
  onSelect,
  onClose,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{gallery.name}</h2>
            <p className="text-gray-600 mb-2">
              {gallery.city}, {gallery.country}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
        
        {/* Bio section */}
        {gallery.bio && (
          <div className="mb-4">
            <h3 className="font-bold text-base mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed">{gallery.bio}</p>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-semibold">Specialty:</span> {gallery.specialty}
          </p>
          {gallery.established_year && (
            <p className="text-sm">
              <span className="font-semibold">Established:</span> {gallery.established_year}
            </p>
          )}
          {gallery.size_sqm && (
            <p className="text-sm">
              <span className="font-semibold">Size:</span> {gallery.size_sqm} m²
            </p>
          )}
        </div>
        {gallery.styles && gallery.styles.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-base mb-2">Styles</h3>
            <div className="flex flex-wrap gap-2">
              {gallery.styles.map((style) => (
                <span
                  key={style}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Button onClick={onSelect} className="w-full">
          View Gallery Details
        </Button>
      </div>
    </div>
  );
};

export default GalleryDetailsPanel;
