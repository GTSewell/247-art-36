
import React from 'react';
import { Artist } from '@/data/types/artist';
import { Instagram, Twitter, Linkedin, Facebook, Link, ExternalLink, Calendar, Globe, Book, MapPin, Tag, ShoppingCart, Palette, Mail, Video, Award, Camera, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';

interface ArtistProfileCenterPanelProps {
  artist: Artist;
  socialPlatforms: string[];
  links: {
    type: string;
    title: string;
    url: string;
  }[];
  panelColor: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonBorderColor?: string;
}

const ArtistProfileCenterPanel: React.FC<ArtistProfileCenterPanelProps> = ({
  artist,
  socialPlatforms,
  links,
  panelColor,
  buttonColor = '#f7cf1e',
  buttonTextColor = '#000000',
  buttonHoverColor = '#e6bf1a',
  buttonBorderColor = '#000000'
}) => {
  const isMobile = useIsMobile();
  
  const socialIcons = {
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  // Sample links to show when no links are available
  const sampleLinks = [
    { type: 'website', title: 'Portfolio Website', url: '#', icon: <Globe className="h-4 w-4" /> },
    { type: 'exhibition', title: 'Next Exhibition', url: '#', icon: <Calendar className="h-4 w-4" /> },
    { type: 'public art', title: 'Public Art Installation', url: '#', icon: <MapPin className="h-4 w-4" /> },
    { type: 'shop', title: 'Online Art Shop', url: '#', icon: <ShoppingCart className="h-4 w-4" /> },
    { type: 'gallery', title: 'Gallery Representation', url: '#', icon: <Palette className="h-4 w-4" /> },
    { type: 'contact', title: 'Contact for Commissions', url: '#', icon: <Mail className="h-4 w-4" /> },
    { type: 'video', title: 'Studio Tour Video', url: '#', icon: <Video className="h-4 w-4" /> },
    { type: 'award', title: 'Recent Awards', url: '#', icon: <Award className="h-4 w-4" /> }
  ];

  // Group links by type
  const groupedLinks = links.reduce((groups: Record<string, any[]>, link) => {
    const group = groups[link.type] || [];
    group.push(link);
    groups[link.type] = group;
    return groups;
  }, {});

  const linksToDisplay = links.length > 0 ? links : sampleLinks;
  const groupedLinksToDisplay = links.length > 0 ? groupedLinks : 
    sampleLinks.reduce((groups: Record<string, any[]>, link) => {
      const group = groups[link.type] || [];
      group.push(link);
      groups[link.type] = group;
      return groups;
    }, {});

  // Dynamic CSS for buttons with custom colors
  const socialButtonStyle = {
    borderColor: buttonBorderColor,
    color: buttonBorderColor
  };

  const linkButtonStyle = {
    backgroundColor: buttonColor,
    color: buttonTextColor,
    borderColor: buttonBorderColor
  };

  const getHoverStyle = () => {
    return `hover:bg-[${buttonHoverColor}]`;
  };
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      {/* Only show the header section on mobile */}
      {isMobile && (
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
      )}
      
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
                  className="rounded-full h-10 w-10 border-2 hover:bg-gray-100"
                  style={socialButtonStyle}
                >
                  {socialIcons[platformKey] || <Link className="h-5 w-5" />}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Links Section - Fixed height for mobile to ensure proper scrolling */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pb-4">
          <div className="space-y-4 pr-4">
            {Object.entries(groupedLinksToDisplay).map(([type, typeLinks]) => (
              <div key={type} className="space-y-2">
                <h3 className="text-sm font-bold uppercase">{type}</h3>
                {typeLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full py-3 px-4 rounded-full transition-colors duration-200 border-2 text-center"
                    style={linkButtonStyle}
                  >
                    <div className="flex items-center">
                      {link.icon && <span className="mr-2">{link.icon}</span>}
                    </div>
                    <span className="flex-grow text-center font-medium">{link.title}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ))}
          </div>
          
          {links.length === 0 && (
            <div className="mt-4 text-center text-gray-500 text-sm italic pb-8">
              <p>These are sample links to show how artist links would appear</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ArtistProfileCenterPanel;
