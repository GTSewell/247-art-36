
import React from 'react';
import { MapPin, Palette, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { Button } from '@/components/ui/button';

interface ArtistDetailsPanelProps {
  artist: Artist;
  onSelect: (artist: Artist) => void;
}

const ArtistDetailsPanel: React.FC<ArtistDetailsPanelProps> = ({ artist, onSelect }) => {
  const socialIcons = {
    Facebook: <Facebook className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    LinkedIn: <Linkedin className="h-5 w-5" />,
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Palette size={20} />
            <span>{artist.specialty}</span>
          </div>
          {artist.city && artist.country && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={20} />
              <span>{`${artist.city}, ${artist.country}`}</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed">{artist.bio}</p>

        {/* Social Media Icons */}
        {artist.social_platforms && artist.social_platforms.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <div className="flex gap-4">
              {artist.social_platforms.map((platform) => (
                <button
                  key={platform}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {socialIcons[platform as keyof typeof socialIcons]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Techniques */}
        {artist.techniques && artist.techniques.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Techniques</h3>
            <div className="flex flex-wrap gap-2">
              {artist.techniques.map((technique) => (
                <span
                  key={technique}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Styles */}
        {artist.styles && artist.styles.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Styles</h3>
            <div className="flex flex-wrap gap-2">
              {artist.styles.map((style) => (
                <span
                  key={style}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          onClick={() => onSelect(artist)}
          className="w-full"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default ArtistDetailsPanel;
