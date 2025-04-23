
import React from 'react';
import { Artist } from '@/data/types/artist';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistActions from './ArtistActions';

interface MobileArtistContentProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists: () => void;
  handleNavigateToArtistProfile: (e: React.MouseEvent) => void;
  isSignatureArtist: boolean;
  isDemo: boolean;
}

const MobileArtistContent: React.FC<MobileArtistContentProps> = ({
  artist,
  onFavoriteToggle,
  isFavorite,
  refreshArtists,
  handleNavigateToArtistProfile,
  isSignatureArtist,
  isDemo
}) => {
  return (
    <div 
      className="flex flex-col w-full min-h-[80vh] overflow-hidden"
      style={{ 
        background: 'white',
        border: isSignatureArtist ? '4px solid #FFC700' : 'none',
        borderRadius: isSignatureArtist ? '0.75rem' : '0'
      }}
    >
      {/* Header Section */}
      <div className="px-6 pt-6 pb-3">
        <ArtistHeaderInfo
          name={artist.name}
          specialty={artist.specialty}
          city={artist.city}
          country={artist.country}
        />
      </div>
      
      {/* Artworks Grid Section - Flex grow to take available space */}
      <div className="px-6 flex-grow overflow-y-auto">
        <ArtistImagePanel
          artist={artist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          refreshArtists={refreshArtists}
        />
      </div>
      
      {/* Bottom Action Buttons - Fixed to bottom with spacing */}
      <div className="px-6 py-6 mt-auto">
        <ArtistActions
          domainName={artist.name}
          artistId={artist.id}
          isFavorite={isFavorite}
          onFavoriteToggle={onFavoriteToggle}
          handleDomainClick={handleNavigateToArtistProfile}
          useSubPath={false}
        />
      </div>
    </div>
  );
};

export default MobileArtistContent;
