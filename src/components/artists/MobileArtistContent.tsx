
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
      className={`flex flex-col w-full max-h-[85vh] overflow-y-auto relative ${isSignatureArtist ? 'border-2 border-zap-yellow' : ''}`}
      style={{ background: 'white', overflow: 'visible' }}
    >
      {/* Artist badges - using isMobile prop with improved positioning */}
      <ArtistBadges 
        isSignatureArtist={isSignatureArtist} 
        isDemo={isDemo}
        isMobile={true}
      />
      
      {/* Header Section with padding to make room for badge */}
      <div className="px-6 pt-6 pb-2 mt-2">
        <ArtistHeaderInfo
          name={artist.name}
          specialty={artist.specialty}
          city={artist.city}
          country={artist.country}
        />
      </div>
      
      {/* Artworks Grid Section */}
      <div className="px-6 flex-grow">
        <ArtistImagePanel
          artist={artist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          refreshArtists={refreshArtists}
        />
      </div>
      
      {/* Bottom Action Buttons - with increased space above */}
      <div className="px-6 pb-6 pt-4 mt-auto">
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
