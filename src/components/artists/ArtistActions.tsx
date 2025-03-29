
import React from 'react';
import FavoriteButton from './buttons/FavoriteButton';
import ArtistProfileButton from './buttons/ArtistProfileButton';

interface ArtistActionsProps {
  domainName: string;
  artistId: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  handleDomainClick?: (e: React.MouseEvent) => void;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonBorderColor?: string;
  useSubPath?: boolean;
}

const ArtistActions: React.FC<ArtistActionsProps> = ({
  domainName,
  artistId,
  isFavorite = false,
  onFavoriteToggle,
  handleDomainClick,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor,
  useSubPath = false
}) => {
  // Remove spaces and special characters from the domain name for URLs
  const formattedDomain = domainName.replace(/\s+/g, '').replace(/[^\w\s]/gi, '');
  
  return (
    <div className="flex gap-3 w-full">
      {onFavoriteToggle && (
        <FavoriteButton
          artistId={artistId}
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
