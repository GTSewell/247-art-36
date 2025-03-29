
import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/logger';

interface FavoriteButtonProps {
  artistId: number;
  isFavorite: boolean;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonBorderColor?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  artistId,
  isFavorite,
  onFavoriteToggle,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor,
}) => {
  // Define zap yellow for favorite button
  const zapYellow = '#f7cf1e';
  
  // Use zap yellow for the favorite button, regardless of customizations
  const favoriteButtonStyles = {
    backgroundColor: isFavorite ? zapYellow : buttonColor || zapYellow,
    color: isFavorite ? '#000000' : buttonTextColor || '#000000',
    borderColor: isFavorite ? '#000000' : buttonBorderColor || 'transparent',
    height: '40px'
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      logger.info(`Toggling favorite for artist ID ${artistId}, current state: ${isFavorite}`);
      onFavoriteToggle(artistId, !isFavorite);
    }
  };

  return (
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
  );
};

export default FavoriteButton;
