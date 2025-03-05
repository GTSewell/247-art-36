
import React from 'react';
import { Artist } from '@/data/types/artist';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle, Link as LinkIcon } from 'lucide-react';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistBio from './ArtistBio';
import ArtistTechniquesStyles from './ArtistTechniquesStyles';
import ArtistSocialLinks from './ArtistSocialLinks';
import ArtistActions from './ArtistActions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

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
  const techniques = Array.isArray(artist.techniques) 
    ? artist.techniques 
    : typeof artist.techniques === 'string' && artist.techniques
      ? JSON.parse(artist.techniques)
      : [];
  
  const styles = Array.isArray(artist.styles) 
    ? artist.styles 
    : typeof artist.styles === 'string' && artist.styles
      ? JSON.parse(artist.styles)
      : [];
  
  const socialPlatforms = Array.isArray(artist.social_platforms) 
    ? artist.social_platforms 
    : typeof artist.social_platforms === 'string' && artist.social_platforms
      ? JSON.parse(artist.social_platforms)
      : [];

  const handleDomainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/artist/${artist.name.replace(/\s+/g, '')}`);
  };

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Create a formatted domain name for display
  const artistDomain = artist.name.replace(/\s+/g, '');
  
  return (
    <div className="relative flex flex-col h-full p-5 md:p-8">
      {showReturnButton && (
        <div className="absolute top-3 right-3 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToArtists}
            className="bg-white/80 hover:bg-white backdrop-blur-sm"
            style={{ borderColor: colorTheme?.buttonBorder }}
          >
            <ArrowLeftCircle size={18} />
            <span className="sr-only">Return to Artists</span>
          </Button>
        </div>
      )}
      
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
        <div className="flex-none mb-3 flex items-center text-sm">
          <LinkIcon size={14} className="mr-1" />
          <button 
            onClick={handleDomainClick}
            className="text-black/70 hover:text-black font-mono truncate"
          >
            247.art/{artistDomain}
          </button>
        </div>
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
            useSubPath={true}
          />
        </div>
      )}

      {/* Improved ScrollArea with proper height calculations */}
      <ScrollArea className="flex-grow overflow-y-auto pr-3 mb-6" style={{ height: isMobile ? 'calc(60vh - 180px)' : 'calc(80vh - 220px)' }}>
        <div className="space-y-4 pb-4">
          <ArtistBio 
            bio={artist.bio} 
            isMobile={isMobile} 
          />

          <ArtistTechniquesStyles 
            techniques={techniques} 
            styles={styles} 
            badgeBgColor={colorTheme?.badgeBg}
          />

          <ArtistSocialLinks 
            socialPlatforms={socialPlatforms} 
            buttonColor={colorTheme?.button}
            buttonTextColor={colorTheme?.buttonText}
            buttonHoverColor={colorTheme?.buttonHover}
          />
        </div>
      </ScrollArea>

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
            useSubPath={true}
          />
        </div>
      )}
    </div>
  );
};

export default ArtistDetailsPanel;
