
import React from 'react';
import { useLocation } from 'react-router-dom';

interface ArtistCardFrontProps {
  image: string;
  name: string;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ArtistCardFront: React.FC<ArtistCardFrontProps> = ({
  image,
  name,
  onImageError
}) => {
  const location = useLocation();
  const isArtistsPage = location.pathname === '/artists' || location.pathname === '/pwa/artists';
  
  // Stop propagation of click events on the image
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  console.log('ArtistCardFront - isArtistsPage:', isArtistsPage, 'pathname:', location.pathname);

  return (
    <div className="w-full h-full overflow-hidden transition-all duration-300 group">
      <img 
        src={image} 
        alt={name} 
        onError={onImageError} 
        onClick={handleClick}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${isArtistsPage ? 'grayscale group-hover:grayscale-0' : ''}`}
      />
    </div>
  );
};

export default ArtistCardFront;
