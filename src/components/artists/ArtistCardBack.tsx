
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistArtworksView } from './ArtistArtworksView';

interface ArtistCardBackProps {
  artist: Artist;
  isGeneratingArtworks: boolean;
  setIsGeneratingArtworks: (value: boolean) => void;
  artworkErrors: Record<number, boolean>;
  handleArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => void;
  refreshArtworks?: () => void;
  onBackClick?: (e: React.MouseEvent) => void;
}

const ArtistCardBack: React.FC<ArtistCardBackProps> = ({
  artist,
  isGeneratingArtworks,
  setIsGeneratingArtworks,
  artworkErrors,
  handleArtworkImageError,
  refreshArtworks,
  onBackClick
}) => {
  // Stop propagation of click events to prevent unwanted card flips
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBackClick) {
      onBackClick(e);
    }
  };

  return (
    <div 
      className="w-full h-full bg-white" 
      data-testid="artist-card-back"
      onClick={handleClick}
    >
      <ArtistArtworksView 
        artist={artist}
        isGeneratingArtworks={isGeneratingArtworks}
        setIsGeneratingArtworks={setIsGeneratingArtworks}
        artworkErrors={artworkErrors}
        handleArtworkImageError={handleArtworkImageError}
        refreshArtworks={refreshArtworks}
      />
    </div>
  );
};

export default ArtistCardBack;
