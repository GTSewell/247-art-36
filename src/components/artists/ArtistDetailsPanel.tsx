
import React from 'react';
import { Artist } from '@/data/types/artist';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistActions from './ArtistActions';
import ArtistReturnButton from './ArtistReturnButton';
import ArtistDomainLink from './ArtistDomainLink';
import ArtistInfoContainer from './ArtistInfoContainer';
import { logger } from '@/utils/logger';

interface ArtistDetailsPanelProps {
  artist: Artist;
  onSelect: (e: React.MouseEvent) => void;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
  onClose?: (e: React.MouseEvent) => void;
  colorTheme?: {
    background: string;
    panel: string;
    button: string;
    buttonText: string;
    buttonHover: string;
    buttonBorder: string;
    badgeBg: string;
  };
  showReturnButton?: boolean;
}

const ArtistDetailsPanel: React.FC<ArtistDetailsPanelProps> = ({
  artist,
  onSelect,
  onFavoriteToggle,
  isFavorite = false,
  onClose,
  colorTheme,
  showReturnButton = false
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Parse techniques, styles, and social_platforms if they're strings
  const techniques = Array.isArray(artist.techniques) ? artist.techniques : typeof artist.techniques === 'string' && artist.techniques ? JSON.parse(artist.techniques) : [];
  const styles = Array.isArray(artist.styles) ? artist.styles : typeof artist.styles === 'string' && artist.styles ? JSON.parse(artist.styles) : [];
  const socialPlatforms = Array.isArray(artist.social_platforms) ? artist.social_platforms : typeof artist.social_platforms === 'string' && artist.social_platforms ? JSON.parse(artist.social_platforms) : [];
  
  const handleDomainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!artist || !artist.name) {
      logger.error('Cannot navigate to artist profile: Artist name is missing');
      return;
    }
    
    // Format name by removing spaces and special characters
    const formattedName = artist.name.replace(/\s+/g, '').replace(/[^\w\s]/gi, '');
    logger.info(`Navigating to artist profile: ${formattedName}`);
    navigate(`/artists/${formattedName}`);
  };
  
  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Create a formatted domain name for display - remove special characters too
  const artistDomain = artist.name ? artist.name.replace(/\s+/g, '').replace(/[^\w\s]/gi, '') : '';
  
  return (
    <div className="relative flex flex-col h-full p-5 md:p-8 px-0 py-0">
      <ArtistReturnButton 
        onReturn={handleReturnToArtists} 
        colorTheme={colorTheme} 
        showReturnButton={showReturnButton} 
      />
      
      <div className="flex-none mb-2">
        <ArtistHeaderInfo 
          name={artist.name} 
          specialty={artist.specialty} 
          city={artist.city} 
          country={artist.country} 
        />
      </div>

      {/* For mobile, show a mini domain link at the top for better visibility */}
      {isMobile && (
        <ArtistDomainLink 
          artistDomain={artistDomain} 
          handleDomainClick={handleDomainClick} 
        />
      )}

      {isMobile && (
        <div className="flex-none mb-4 mt-2">
          <ArtistActions 
            domainName={artistDomain} 
            artistId={artist.id} 
            isFavorite={isFavorite} 
            onFavoriteToggle={onFavoriteToggle} 
            handleDomainClick={handleDomainClick} 
            buttonColor={colorTheme?.button} 
            buttonTextColor={colorTheme?.buttonText} 
            buttonHoverColor={colorTheme?.buttonHover} 
            buttonBorderColor={colorTheme?.buttonBorder}
            useSubPath={false} 
          />
        </div>
      )}

      <ArtistInfoContainer 
        bio={artist.bio} 
        techniques={techniques} 
        styles={styles} 
        socialPlatforms={socialPlatforms}
        isMobile={isMobile}
        colorTheme={{
          badgeBg: colorTheme?.badgeBg,
          button: colorTheme?.button,
          buttonTextColor: colorTheme?.buttonText,
          buttonHoverColor: colorTheme?.buttonHover
        }} 
      />

      {!isMobile && (
        <div className="flex-none mt-auto pt-4">
          <ArtistActions 
            domainName={artistDomain} 
            artistId={artist.id} 
            isFavorite={isFavorite} 
            onFavoriteToggle={onFavoriteToggle} 
            handleDomainClick={handleDomainClick} 
            buttonColor={colorTheme?.button} 
            buttonTextColor={colorTheme?.buttonText} 
            buttonHoverColor={colorTheme?.buttonHover} 
            buttonBorderColor={colorTheme?.buttonBorder}
            useSubPath={false} 
          />
        </div>
      )}
    </div>
  );
};

export default ArtistDetailsPanel;
