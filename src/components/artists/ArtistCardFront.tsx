
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
  // Simple pass-through for clicks
  const handleImageClick = (e: React.MouseEvent) => {
    // Allow click to propagate to parent
  };

  return (
    <div className="w-full h-full overflow-hidden" onClick={handleImageClick}>
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        onError={onImageError}
      />
    </div>
  );
};

export default ArtistCardFront;
