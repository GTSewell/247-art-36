
import React from 'react';
import { Artist } from '@/data/types/artist';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistCarouselNavigation from './ArtistCarouselNavigation';
import ArtistActions from './ArtistActions';
import ArtistBadges from './ArtistBadges';

interface DesktopArtistContentProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists: () => void;
  handleNavigateToArtistProfile: (e: React.MouseEvent) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  isMobile: boolean;
  isSignatureArtist: boolean;
  isDemo: boolean;
}

const DesktopArtistContent: React.FC<DesktopArtistContentProps> = ({
  artist,
  onFavoriteToggle,
  isFavorite,
  refreshArtists,
  handleNavigateToArtistProfile,
  handlePrevious,
  handleNext,
  isMobile,
  isSignatureArtist,
  isDemo
}) => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Artist badges */}
      <ArtistBadges 
        isSignatureArtist={isSignatureArtist} 
        isDemo={isDemo}
      />
      
      <div 
        className={`flex flex-row max-h-[70vh] ${isSignatureArtist ? 'border-2 border-zap-yellow' : ''}`}
        style={{ background: 'white' }}
      >
        {/* Left side: Artwork grid */}
        <div className="w-3/5 p-6">
          <ArtistImagePanel
            artist={artist}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
            refreshArtists={refreshArtists}
          />
        </div>
        
        {/* Right side: Artist info and actions */}
        <div className="w-2/5 p-6 flex flex-col">
          <div className="mb-auto">
            <ArtistHeaderInfo
              name={artist.name}
              specialty={artist.specialty}
              city={artist.city}
              country={artist.country}
            />
          </div>
          
          {/* Action buttons at bottom of right panel */}
          <div className="mt-auto pt-4">
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
      </div>
      
      {/* Desktop navigation arrows */}
      <ArtistCarouselNavigation 
        isMobile={isMobile} 
        onPrevious={handlePrevious} 
        onNext={handleNext} 
      />
    </div>
  );
};

export default DesktopArtistContent;
