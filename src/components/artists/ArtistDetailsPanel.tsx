
import React from 'react';
import { MapPin, Palette, Facebook, Instagram, Linkedin, Twitter, ExternalLink, Zap, X } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { Button } from '@/components/ui/button';

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
  const socialIcons = {
    Facebook: <Facebook className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    LinkedIn: <Linkedin className="h-5 w-5" />,
  };

  const domainName = artist.name.replace(/\s+/g, '');

  const handleDomainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://${domainName}.247.art`, '_blank');
  };

  return (
    <div className="relative flex flex-col justify-between h-full bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 bg-white/80 p-2 rounded-full hover:bg-white shadow-md backdrop-blur-sm"
        >
          <X className="h-4 w-4 text-[#ea384c]" />
        </button>
      )}
      <div className="space-y-2">
        <div>
          <h2 className="text-2xl font-bold mb-1">{artist.name}</h2>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Palette size={18} />
            <span>{artist.specialty}</span>
          </div>
          {artist.city && artist.country && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{`${artist.city}, ${artist.country}`}</span>
              </div>
              
              {artist.social_platforms && artist.social_platforms.length > 0 && (
                <div className="flex gap-3 pl-6">
                  {artist.social_platforms.map((platform) => (
                    <button
                      key={platform}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {socialIcons[platform as keyof typeof socialIcons]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed line-clamp-2">{artist.bio}</p>

        <div className="space-y-1 text-sm">
          {artist.techniques && artist.techniques.length > 0 && (
            <div className="text-gray-600">
              <span className="font-medium">Techniques:</span>{' '}
              {artist.techniques.join(', ')}
            </div>
          )}
          {artist.styles && artist.styles.length > 0 && (
            <div className="text-gray-600">
              <span className="font-medium">Styles:</span>{' '}
              {artist.styles.join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
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
