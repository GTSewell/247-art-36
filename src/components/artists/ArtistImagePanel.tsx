
import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Artist } from '@/data/types/artist';

interface ArtistImagePanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
}

const ArtistImagePanel: React.FC<ArtistImagePanelProps> = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite 
}) => {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute bottom-4 right-4 z-10 ${
            isFavorite
              ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90'
              : 'bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(artist.id, !isFavorite);
          }}
        >
          <Zap size={24} />
        </Button>
      </div>
      
      {/* Artwork Thumbnails */}
      {artist.artworks && artist.artworks.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {artist.artworks.map((artwork, index) => (
            <div 
              key={index} 
              className="aspect-square rounded-md overflow-hidden border border-gray-200"
            >
              <img
                src={artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistImagePanel;
