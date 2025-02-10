
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
    <div className="space-y-3">
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
    </div>
  );
};

export default ArtistImagePanel;
