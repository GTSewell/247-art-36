
import React from 'react';

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
  // Stop propagation of click events on the image
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        onError={onImageError} 
        onClick={handleClick}
        className="w-full h-full object-cover" 
      />
    </div>
  );
};

export default ArtistCardFront;
