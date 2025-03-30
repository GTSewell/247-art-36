
import React from 'react';
import { Artist } from '@/data/types/artist';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistActions from './ArtistActions';
import ArtistReturnButton from './ArtistReturnButton';
import ArtistInfoContainer from './ArtistInfoContainer';
import { ArtistArtworksView } from './ArtistArtworksView';
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
  isModalView?: boolean;
}

const ArtistDetailsPanel: React.FC<ArtistDetailsPanelProps> = ({
  artist,
  onSelect,
  onFavoriteToggle,
  isFavorite = false,
  onClose,
  colorTheme,
  showReturnButton = false,
  isModalView = false
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isGeneratingArtworks, setIsGeneratingArtworks] = React.useState(false);
  const [artworkErrors, setArtworkErrors] = React.useState<Record<number, boolean>>({});

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

    // Use the navigate function to go to the artist profile page
    navigate(`/artists/${formattedName}`);
  };

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  const handleArtworkImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    setArtworkErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // For modal view, use smaller text and tighter spacing
  const modalTextClass = isModalView && !isMobile ? "text-sm" : "";

  return (
    <div className="relative flex flex-col h-full p-5 md:p-4 px-0 py-0 overflow-hidden w-full min-w-0 mx-0">
      <ArtistReturnButton 
        onReturn={handleReturnToArtists} 
        colorTheme={colorTheme} 
        showReturnButton={showReturnButton} 
      />
      
      <div className="flex-none mb-2 min-w-0">
        <ArtistHeaderInfo 
          name={artist.name} 
          specialty={artist.specialty} 
          city={artist.city} 
          country={artist.country} 
        />
      </div>

      {/* Show empty container in modal view */}
      <ArtistInfoContainer 
        bio={artist.bio} 
        techniques={techniques} 
        styles={styles} 
        socialPlatforms={socialPlatforms}
        isMobile={isMobile}
        isModalView={isModalView}
        modalTextClass={modalTextClass}
        artist={artist}
        colorTheme={{
          badgeBg: colorTheme?.badgeBg,
          button: colorTheme?.button,
          buttonTextColor: colorTheme?.buttonText,
          buttonHoverColor: colorTheme?.buttonHover
        }}
      />

      {/* Action buttons at the bottom */}
      <div className={`flex-none ${isMobile ? 'mt-2' : 'mt-auto'} pt-2 min-w-0`}>
        <ArtistActions 
          artist={artist}
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
    </div>
  );
};

export default ArtistDetailsPanel;
