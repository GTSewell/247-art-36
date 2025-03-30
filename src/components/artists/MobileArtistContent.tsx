
import React from 'react';
import { Artist } from '@/data/types/artist';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistActions from './ArtistActions';
import ArtistBadges from './ArtistBadges';

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
      className={`flex flex-col w-full h-full max-h-[85vh] relative bg-white`}
      style={{ 
        overflow: 'visible',
        boxShadow: isSignatureArtist ? 'inset 0 0 0 4px #ffc800' : 'none',
        borderRadius: 'inherit'
      }}
    >
      {/* Artist badges - using isMobile prop with improved positioning */}
      <ArtistBadges 
        isSignatureArtist={isSignatureArtist} 
        isDemo={isDemo}
        isMobile={true}
      />
      
      {/* Header Section with padding to make room for badge */}
      <div className="px-6 pt-6 pb-2 mt-6">
        <ArtistHeaderInfo
          name={artist.name}
          specialty={artist.specialty}
          city={artist.city}
          country={artist.country}
        />
      </div>
      
      {/* Scrollable content area */}
      <div className="px-6 flex-grow overflow-y-auto">
        <ArtistImagePanel
          artist={artist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          refreshArtists={refreshArtists}
        />
      </div>
      
      {/* Fixed bottom action buttons */}
      <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white mt-auto">
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
