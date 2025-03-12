
import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { logger } from '@/utils/logger';

interface ArtistActionsProps {
  domainName: string;
  artistId: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  handleDomainClick: (e: React.MouseEvent) => void;
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
  const isMobile = useIsMobile();
  
  // Remove spaces from the display version of the domain only
  const displayDomain = domainName.replace(/\s+/g, '');
  
  const favoriteButtonStyles = buttonColor ? {
    backgroundColor: isFavorite ? '#f7cf1e' : buttonColor,
    color: isFavorite ? '#000000' : buttonTextColor || 'white',
    borderColor: isFavorite ? '#000000' : buttonBorderColor || 'transparent'
  } : {};

  // Set zap blue for the artist profile button (visit button)
  const visitButtonStyles = {
    backgroundColor: '#00baef', // Use zap blue from the theme
    color: 'white',
    borderColor: 'transparent'
  };

  // Generate the domain display text based on screen size
  const getDomainText = () => {
    if (isMobile) {
      // On mobile, we'll show just the domain name without "Visit"
      return "Artist Profile";
    } else {
      // On desktop, we'll always show "Artist Profile"
      return "Artist Profile";
    }
  };

  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logger.info(`Visit artist button clicked: ${displayDomain}`);
    handleDomainClick(e);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      logger.info(`Toggling favorite for artist ID ${artistId}, current state: ${isFavorite}`);
      onFavoriteToggle(artistId, isFavorite);
    }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} w-full gap-2`}>
      {onFavoriteToggle && (
        <Button
          variant="default"
          className={`${
            isFavorite ? 'bg-zap-yellow text-black' : ''
          } ${isMobile ? 'w-full' : ''}`}
          style={favoriteButtonStyles}
          onClick={handleFavoriteClick}
          onMouseOver={(e) => {
            if (buttonHoverColor && !isFavorite) {
              e.currentTarget.style.backgroundColor = buttonHoverColor;
            }
          }}
          onMouseOut={(e) => {
            if (buttonColor && !isFavorite) {
              e.currentTarget.style.backgroundColor = buttonColor;
            }
          }}
        >
          <Zap size={18} />
          <span className="ml-1">{isFavorite ? 'Favorited' : 'Favorite'}</span>
        </Button>
      )}
      
      <Button
        variant="default"
        className="w-full"
        style={visitButtonStyles}
        onClick={handleVisitClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0095c0'; // Darker shade of zap blue for hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#00baef'; // Reset to zap blue
        }}
      >
        {isMobile ? (
          <>
            <ExternalLink size={16} className="mr-1" />
            <span className="text-sm">Artist Profile</span>
          </>
        ) : (
          <>{getDomainText()}</>
        )}
      </Button>
    </div>
  );
};

export default ArtistActions;
