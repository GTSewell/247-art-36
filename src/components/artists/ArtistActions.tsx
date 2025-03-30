
import React from 'react';
import FavoriteButton from './buttons/FavoriteButton';
import ArtistProfileButton from './buttons/ArtistProfileButton';
import { Artist } from '@/data/types/artist';

interface ArtistActionsProps {
  artist: Artist;
  isFavorite?: boolean;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  handleDomainClick?: (e: React.MouseEvent) => void;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonBorderColor?: string;
  useSubPath?: boolean;
  isMobile?: boolean;
}

const ArtistActions: React.FC<ArtistActionsProps> = ({
  artist,
  isFavorite = false,
  onFavoriteToggle,
  handleDomainClick,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor,
  useSubPath = false,
  isMobile = false
}) => {
  // Remove spaces and special characters from the domain name for URLs
  const formattedDomain = artist.name.replace(/\s+/g, '').replace(/[^\w\s]/gi, '');
  
  return (
    <div className="flex gap-3 w-full">
      {onFavoriteToggle && (
        <FavoriteButton
          artistId={artist.id}
          isFavorite={isFavorite}
          onFavoriteToggle={onFavoriteToggle}
          buttonColor={buttonColor}
          buttonTextColor={buttonTextColor}
          buttonHoverColor={buttonHoverColor}
          buttonBorderColor={buttonBorderColor}
        />
      )}
      
      <ArtistProfileButton
        formattedDomain={formattedDomain}
        handleDomainClick={handleDomainClick}
      />
    </div>
  );
};

export default ArtistActions;
