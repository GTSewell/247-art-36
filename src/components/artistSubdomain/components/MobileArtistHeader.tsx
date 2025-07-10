import React from 'react';
import { Artist } from '@/data/types/artist';

interface MobileArtistHeaderProps {
  artist: Artist;
}

const MobileArtistHeader: React.FC<MobileArtistHeaderProps> = ({ artist }) => {
  return (
    <div className="flex items-start mb-4">
      <div className="mr-4">
        <div className="w-16 h-16 rounded-md overflow-hidden">
          <img 
            src={artist.image || '/placeholder.svg'} 
            alt={artist.name || 'Artist'} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold">{artist.name}</h2>
        <p className="text-sm text-gray-600">{artist.specialty}</p>
        <p className="text-xs text-gray-500">
          {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
        </p>
      </div>
    </div>
  );
};

export default MobileArtistHeader;