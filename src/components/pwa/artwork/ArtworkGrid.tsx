
import React from 'react';
import { X, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => Promise<boolean>;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onRemove }) => {
  const [removing, setRemoving] = React.useState<number | null>(null);
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({});

  const handleRemove = async (index: number) => {
    setRemoving(index);
    try {
      const success = await onRemove(index);
      if (!success) {
        throw new Error('Failed to remove artwork');
      }
    } catch (error) {
      console.error('Error removing artwork:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  if (artworks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-md">
        <ImageOff className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">No artworks uploaded yet</p>
        <p className="text-xs text-gray-400 mt-1">Use the upload button above to add artworks</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artworks.map((artwork, index) => (
        <div key={`${artwork}-${index}`} className="relative group aspect-square overflow-hidden rounded-md bg-gray-100">
          {imageErrors[index] ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-200">
              <ImageOff className="h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <img
              src={artwork}
              alt={`Artwork ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleRemove(index)}
              disabled={removing === index}
            >
              {removing === index ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
