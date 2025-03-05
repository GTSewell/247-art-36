
import React from 'react';
import { Artist } from '@/data/types/artist';
import { Instagram, Twitter, Linkedin, Facebook, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistProfileCenterPanelProps {
  artist: Artist;
  socialPlatforms: string[];
  links: {
    type: string;
    title: string;
    url: string;
  }[];
  panelColor: string;
}

const ArtistProfileCenterPanel: React.FC<ArtistProfileCenterPanelProps> = ({
  artist,
  socialPlatforms,
  links,
  panelColor
}) => {
  const socialIcons = {
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  // Group links by type
  const groupedLinks = links.reduce((groups: Record<string, any[]>, link) => {
    const group = groups[link.type] || [];
    group.push(link);
    groups[link.type] = group;
    return groups;
  }, {});

  const getLinkColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gallery': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'marketplace': return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'nft': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'metaverse': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
      case 'voxels': return 'bg-pink-100 text-pink-700 hover:bg-pink-200';
      case 'team': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      <div className="flex items-start mb-4">
        <div className="mr-4">
          <div className="w-16 h-16 rounded-md overflow-hidden">
            <img 
              src={artist.image || '/placeholder.svg'} 
              alt={artist.name || 'Artist'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold">{artist.name}</h2>
          <p className="text-sm text-gray-600">{artist.specialty}</p>
          <p className="text-xs text-gray-500">
            {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
          </p>
        </div>
      </div>
      
      {/* Social Media Section */}
      {socialPlatforms.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold mb-2">Connect</h3>
          <div className="flex flex-wrap gap-3">
            {socialPlatforms.map((platform, index) => {
              const platformKey = platform.toLowerCase() as keyof typeof socialIcons;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                >
                  {socialIcons[platformKey] || <Link className="h-5 w-5" />}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Links Section */}
      <div className="flex-grow">
        {links.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedLinks).map(([type, typeLinks]) => (
              <div key={type} className="space-y-2">
                <h3 className="text-sm font-bold capitalize">{type}</h3>
                {typeLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between w-full p-3 rounded-md ${getLinkColor(type)} transition-colors duration-200`}
                  >
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">No links available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfileCenterPanel;
