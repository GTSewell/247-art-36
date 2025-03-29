
import React from 'react';
import { Card } from '@/components/ui/card';
import { X, Image as ImageIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => void;
  onSetAsBackground: (artworkUrl: string) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ 
  artworks, 
  onRemove,
  onSetAsBackground
}) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed rounded-md">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No artworks</h3>
        <p className="mt-1 text-sm text-gray-500">Upload artworks using the form above.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {artworks.map((artwork, index) => (
        <Card key={index} className="overflow-hidden group relative">
          <AspectRatio ratio={1} className="bg-gray-100">
            <img 
              src={artwork} 
              alt={`Artwork ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </AspectRatio>
          
          <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onRemove(index)}
              title="Remove artwork"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-black/20 w-full justify-start"
              onClick={() => onSetAsBackground(artwork)}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Set as Background
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ArtworkGrid;
