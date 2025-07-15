import React, { useState } from 'react';
import ArtistProfileModal from './ArtistProfileModal';

interface RegularProductHeaderProps {
  name: string;
  artistName?: string;
  price: number;
  isLimitedEdition?: boolean;
  artistDomain?: string;
}

const RegularProductHeader: React.FC<RegularProductHeaderProps> = ({ 
  name, 
  artistName, 
  price,
  isLimitedEdition = false,
  artistDomain
}) => {
  const [showArtistModal, setShowArtistModal] = useState(false);

  const handleArtistClick = () => {
    if (artistName && artistName !== 'Unknown Artist') {
      setShowArtistModal(true);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight dark:text-white">{name}</h2>
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              By{' '}
              {artistName && artistName !== 'Unknown Artist' ? (
                <button
                  onClick={handleArtistClick}
                  className="underline hover:text-primary transition-colors cursor-pointer"
                >
                  {artistName}
                </button>
              ) : (
                <span>{artistName || 'Unknown Artist'}</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-lg md:text-xl font-semibold dark:text-white">${price.toFixed(2)}</span>
          {isLimitedEdition && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full">Limited Edition</span>
          )}
        </div>
      </div>

      <ArtistProfileModal
        isOpen={showArtistModal}
        onClose={() => setShowArtistModal(false)}
        artistName={artistName || 'Unknown Artist'}
        artistDomain={artistDomain}
      />
    </>
  );
};

export default RegularProductHeader;