
import React from 'react';
import { X } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { useIsMobile } from '@/hooks/use-mobile';
import ArtistHeaderInfo from './ArtistHeaderInfo';
import ArtistBio from './ArtistBio';
import ArtistTechniquesStyles from './ArtistTechniquesStyles';
import ArtistSocialLinks from './ArtistSocialLinks';
import ArtistActions from './ArtistActions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArtistDetailsPanelProps {
  artist: Artist;
  onSelect: (e: React.MouseEvent) => void;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
  onClose?: (e: React.MouseEvent) => void;
}

const ArtistDetailsPanel: React.FC<ArtistDetailsPanelProps> = ({ 
  artist, 
  onSelect,
  onFavoriteToggle,
  isFavorite = false,
  onClose
}) => {
  const isMobile = useIsMobile();

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

  const domainName = artist.name.replace(/\s+/g, '');

  const handleDomainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://${domainName}.247.art`, '_blank');
  };

  return (
    <div className="relative flex flex-col h-full p-5 md:p-8">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 z-10 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
      
      <div className="flex-none mb-4">
        <ArtistHeaderInfo 
          name={artist.name}
          specialty={artist.specialty}
          city={artist.city}
          country={artist.country}
        />
      </div>

      <ScrollArea className="flex-grow overflow-y-auto pr-3 mb-20">
        <div className="space-y-4">
          <ArtistBio 
            bio={artist.bio} 
            isMobile={isMobile} 
          />

          <ArtistTechniquesStyles 
            techniques={techniques} 
            styles={styles} 
          />

          <ArtistSocialLinks 
            socialPlatforms={socialPlatforms} 
          />
        </div>
      </ScrollArea>

      <div className="flex-none absolute bottom-5 left-5 right-5">
        <ArtistActions 
          domainName={domainName}
          artistId={artist.id}
          isFavorite={isFavorite}
          onFavoriteToggle={onFavoriteToggle}
          handleDomainClick={handleDomainClick}
        />
      </div>
    </div>
  );
};

export default ArtistDetailsPanel;
