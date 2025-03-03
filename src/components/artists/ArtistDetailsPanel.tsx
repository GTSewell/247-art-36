
import React, { useState } from 'react';
import { MapPin, Palette, Facebook, Instagram, Linkedin, Twitter, ExternalLink, Zap, X, ChevronDown, ChevronUp } from 'lucide-react';
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

  const socialIcons = {
    facebook: <Facebook className="h-5 w-5" />,
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

  const renderBio = () => {
    if (!isMobile) {
      return <p className="text-gray-700 leading-relaxed">{artist.bio}</p>;
    }

    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="space-y-2">
          <p className="text-gray-700 leading-relaxed line-clamp-2">{artist.bio}</p>
          <CollapsibleContent>
            <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
          </CollapsibleContent>
          <CollapsibleTrigger className="w-full flex items-center justify-center text-[#ea384c] hover:opacity-80">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    );
  };

  const renderTechniques = () => {
    if (!isMobile) {
      return (
        <div className="flex flex-wrap gap-2">
          {artist.techniques?.map((technique, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {technique}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <Collapsible open={isTechniquesExpanded} onOpenChange={setIsTechniquesExpanded}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Techniques</h3>
            <CollapsibleTrigger className="text-[#ea384c] hover:opacity-80">
              {isTechniquesExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2">
              {artist.techniques?.map((technique, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {technique}
                </Badge>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  const renderStyles = () => {
    if (!isMobile) {
      return (
        <div className="flex flex-wrap gap-2">
          {artist.styles?.map((style, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {style}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <Collapsible open={isStylesExpanded} onOpenChange={setIsStylesExpanded}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Styles</h3>
            <CollapsibleTrigger className="text-[#ea384c] hover:opacity-80">
              {isStylesExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2">
              {artist.styles?.map((style, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {style}
                </Badge>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  return (
    <div className="relative flex flex-col justify-between h-full bg-white/95 backdrop-blur-sm rounded-lg p-6 md:p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -right-4 -top-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white shadow-md backdrop-blur-sm"
        >
          <X className="h-4 w-4 text-[#ea384c]" />
        </button>
      )}
      <div className={`space-y-${isMobile ? '2' : '4'}`}>
        <div>
          <h2 className="text-2xl font-bold mb-1">{artist.name}</h2>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Palette size={18} />
            <span>{artist.specialty}</span>
          </div>
          {(artist.city || artist.country) && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{[artist.city, artist.country].filter(Boolean).join(", ")}</span>
              </div>
            </div>
          )}
        </div>

        {renderBio()}

        <div className={`space-y-${isMobile ? '1' : '4'}`}>
          {Array.isArray(artist.techniques) && artist.techniques.length > 0 && renderTechniques()}
          {Array.isArray(artist.styles) && artist.styles.length > 0 && renderStyles()}
        </div>

        {Array.isArray(artist.social_platforms) && artist.social_platforms.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Social Media</h3>
            <div className="flex gap-3">
              {artist.social_platforms.map((platform) => {
                const platformKey = platform.toLowerCase() as keyof typeof socialIcons;
                return (
                  <button
                    key={platform}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {socialIcons[platformKey]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDomainClick}
            className="flex-1 bg-[#00baef] hover:bg-[#f7cf1e] hover:text-black"
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
                : 'bg-black/20 hover:bg-[#f7cf1e] hover:text-black backdrop-blur-sm text-white'
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
