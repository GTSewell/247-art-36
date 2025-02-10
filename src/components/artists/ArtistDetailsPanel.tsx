
import React from 'react';
import { MapPin, Palette, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { Button } from '@/components/ui/button';

interface ArtistDetailsPanelProps {
  artist: Artist;
  onSelect: (e: React.MouseEvent) => void;
}

const ArtistDetailsPanel: React.FC<ArtistDetailsPanelProps> = ({ artist, onSelect }) => {
  const socialIcons = {
    Facebook: <Facebook className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    LinkedIn: <Linkedin className="h-5 w-5" />,
  };

  return (
    <div className="flex flex-col justify-between h-full">
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
              
              {/* Social Media Icons moved under location */}
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

        {/* Techniques and Styles under bio */}
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
        {/* Artwork Thumbnails */}
        {artist.artworks && artist.artworks.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {artist.artworks.map((artwork, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-md overflow-hidden border border-gray-200"
              >
                <img
                  src={artwork}
                  alt={`Artwork ${index + 1} by ${artist.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        <Button
          onClick={onSelect}
          className="w-full bg-[#00baef] hover:bg-[#00baef]/90"
        >
          {artist.name}.247.art
        </Button>
      </div>
    </div>
  );
};

export default ArtistDetailsPanel;
