
import React, { useState } from 'react';
import { MapPin, Palette, Instagram, Twitter, Linkedin, ExternalLink, Zap, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTechniquesExpanded, setIsTechniquesExpanded] = useState(false);
  const [isStylesExpanded, setIsStylesExpanded] = useState(false);
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

  const socialIcons = {
    facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  const domainName = artist.name.replace(/\s+/g, '');

  const handleDomainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://${domainName}.247.art`, '_blank');
  };

  return (
    <div className="relative flex flex-col justify-between h-full p-5 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-none">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 z-10 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
      <div className="space-y-4 md:space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{artist.name}</h2>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Palette size={18} />
            <span>{artist.specialty}</span>
          </div>
          {(artist.city || artist.country) && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} />
              <span>{[artist.city, artist.country].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
        </div>

        {techniques && techniques.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {techniques.map((technique: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {styles && styles.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {styles.map((style: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {socialPlatforms && socialPlatforms.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Social Media</h3>
            <div className="flex gap-3">
              {socialPlatforms.map((platform: string) => {
                const platformKey = platform.toLowerCase() as keyof typeof socialIcons;
                return (
                  <button
                    key={platform}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {socialIcons[platformKey] || <span>{platform}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 mt-auto">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDomainClick}
            className="flex-1 bg-[#00baef] hover:bg-[#00a6d6] text-white"
          >
            {domainName}.247.art
            <ExternalLink className="ml-1" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (onFavoriteToggle) {
                onFavoriteToggle(artist.id, !isFavorite);
              }
            }}
            className={`${
              isFavorite 
                ? 'bg-[#f7cf1e] text-black hover:bg-[#f7cf1e]' 
                : 'bg-gray-200 hover:bg-[#f7cf1e] hover:text-black text-gray-700'
            }`}
          >
            <Zap size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailsPanel;
