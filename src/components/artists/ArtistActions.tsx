import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { logger } from '@/utils/logger';
import { useNavigate } from 'react-router-dom';

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Remove spaces and special characters from the domain name for URLs
  const formattedDomain = domainName.replace(/\s+/g, '').replace(/[^\w\s]/gi, '');
  
  // Define zap yellow for favorite button
  const zapYellow = '#f7cf1e';
  
  // Use zap yellow for the favorite button, regardless of customizations
  const favoriteButtonStyles = {
    backgroundColor: isFavorite ? zapYellow : buttonColor || zapYellow,
    color: isFavorite ? '#000000' : buttonTextColor || '#000000',
    borderColor: isFavorite ? '#000000' : buttonBorderColor || 'transparent',
    height: '40px'
  };

  // Set zap blue for the artist profile button (visit button) - always blue
  const zapBlue = '#00baef';
  const visitButtonStyles = {
    backgroundColor: zapBlue,
    color: 'white',
    borderColor: 'transparent',
    height: '40px'
  };

  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logger.info(`Visit artist button clicked: ${formattedDomain}`);
    
    if (handleDomainClick) {
      // Use the provided click handler if available
      handleDomainClick(e);
    } else {
      // Otherwise, navigate programmatically to the artist profile page
      logger.info(`Navigating to artist profile: ${formattedDomain}`);
      navigate(`/artists/${formattedDomain}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      logger.info(`Toggling favorite for artist ID ${artistId}, current state: ${isFavorite}`);
      onFavoriteToggle(artistId, !isFavorite);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      {onFavoriteToggle && (
        <Button
          variant="default"
          className="flex-shrink-0"
          style={favoriteButtonStyles}
          onClick={handleFavoriteClick}
          onMouseOver={(e) => {
            if (buttonHoverColor && !isFavorite) {
              e.currentTarget.style.backgroundColor = buttonHoverColor;
            } else if (!isFavorite) {
              e.currentTarget.style.backgroundColor = '#e6c00e';
            }
          }}
          onMouseOut={(e) => {
            if (buttonColor && !isFavorite) {
              e.currentTarget.style.backgroundColor = buttonColor;
            } else if (!isFavorite) {
              e.currentTarget.style.backgroundColor = zapYellow;
            }
          }}
        >
          <Zap size={24} />
        </Button>
      )}
      
      <Button
        variant="default"
        className="flex-1"
        style={visitButtonStyles}
        onClick={handleVisitClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0095c0';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = zapBlue;
        }}
      >
        {isMobile ? "Artist Profile" : "Artist Profile"}
      </Button>
    </div>
  );
};

export default ArtistActions;
