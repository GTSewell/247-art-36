
import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  const favoriteButtonStyles = buttonColor ? {
    backgroundColor: isFavorite ? '#f7cf1e' : buttonColor,
    color: isFavorite ? '#000000' : buttonTextColor || 'white',
    borderColor: isFavorite ? '#000000' : buttonBorderColor || 'transparent'
  } : {};

  const visitButtonStyles = buttonColor ? {
    backgroundColor: buttonColor,
    color: buttonTextColor || 'white',
    borderColor: buttonBorderColor || 'transparent'
  } : {};

  // Generate the domain display text based on screen size
  const getDomainText = () => {
    if (isMobile) {
      // On mobile, we'll show just the domain name without "Visit"
      return domainName;
    } else {
      // On desktop, we'll always show the subdomain format for display
      return `Visit ${domainName}.247.art`;
    }
  };

  return (
    <div className="flex justify-between w-full gap-2">
      {onFavoriteToggle && (
        <Button
          variant="default"
          className={`${
            isFavorite ? 'bg-zap-yellow text-black' : ''
          } ${isMobile ? 'px-3' : ''}`}
          style={favoriteButtonStyles}
          onClick={(e) => {
            e.stopPropagation();
            if (onFavoriteToggle) {
              onFavoriteToggle(artistId, !isFavorite);
            }
          }}
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
          {!isMobile && <span className="ml-1">{isFavorite ? 'Favorited' : 'Favorite'}</span>}
        </Button>
      )}
      
      <Button
        variant="default"
        className="flex-grow"
        style={visitButtonStyles}
        onClick={handleDomainClick}
        onMouseOver={(e) => {
          if (buttonHoverColor) {
            e.currentTarget.style.backgroundColor = buttonHoverColor;
          }
        }}
        onMouseOut={(e) => {
          if (buttonColor) {
            e.currentTarget.style.backgroundColor = buttonColor;
          }
        }}
      >
        {isMobile ? (
          <>
            <ExternalLink size={16} className="mr-1" />
            <span className="text-sm truncate">{`${domainName}.247.art`}</span>
          </>
        ) : (
          <>{getDomainText()}</>
        )}
      </Button>
    </div>
  );
};

export default ArtistActions;
