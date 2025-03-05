
import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  buttonBorderColor
}) => {
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

  // Handle hover state for favorite button
  const handleFavoriteButtonHover = (isHovering: boolean) => {
    if (!isFavorite && buttonHoverColor) {
      return {
        backgroundColor: isHovering ? buttonHoverColor : buttonColor
      };
    }
    return {};
  };

  // Handle hover state for visit button
  const handleVisitButtonHover = (isHovering: boolean) => {
    if (buttonHoverColor) {
      return {
        backgroundColor: isHovering ? buttonHoverColor : buttonColor
      };
    }
    return {};
  };

  return (
    <div className="flex justify-between w-full gap-4">
      {onFavoriteToggle && (
        <Button
          variant="default"
          className={`flex items-center gap-1 ${
            isFavorite ? 'bg-zap-yellow text-black' : ''
          }`}
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
          <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
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
        Visit {domainName}.247.art
      </Button>
    </div>
  );
};

export default ArtistActions;
