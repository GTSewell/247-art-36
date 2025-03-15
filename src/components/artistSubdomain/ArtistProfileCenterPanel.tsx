
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistLink } from '@/data/types/artistProfile';
import { 
  Globe,
  Store, 
  MapPin, 
  Video, 
  Award, 
  Mail, 
  ExternalLink, 
  Building,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Dribbble,
  Github,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtistProfileCenterPanelProps {
  artist: Artist;
  socialPlatforms: string[];
  links: ArtistLink[];
  panelColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonBorderColor: string;
}

const ArtistProfileCenterPanel: React.FC<ArtistProfileCenterPanelProps> = ({
  artist,
  socialPlatforms,
  links,
  panelColor,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor
}) => {
  // Sample links for demo purposes
  const sampleLinks = [
    { type: 'website', title: 'Portfolio Website', url: '#' },
    { type: 'exhibition', title: 'Next Exhibition', url: '#' },
    { type: 'installation', title: 'Public Art Installation', url: '#' },
    { type: 'shop', title: 'Online Art Shop', url: '#' },
    { type: 'gallery', title: 'Gallery Representation', url: '#' },
    { type: 'contact', title: 'Contact for Commissions', url: '#' },
    { type: 'video', title: 'Studio Tour Video', url: '#' },
    { type: 'award', title: 'Recent Awards', url: '#' },
  ];
  
  // Use provided links or sample links for demo
  const displayLinks = links.length > 0 ? links : sampleLinks;
  
  // Get icon based on link type
  const getLinkIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'website':
        return <Globe />;
      case 'exhibition':
        return <Building />;
      case 'installation':
        return <MapPin />;
      case 'shop':
        return <Store />;
      case 'gallery':
        return <Building />;
      case 'contact':
        return <Mail />;
      case 'video':
        return <Video />;
      case 'award':
        return <Award />;
      case 'instagram':
        return <Instagram />;
      case 'twitter':
        return <Twitter />;
      case 'facebook':
        return <Facebook />;
      case 'youtube':
        return <Youtube />;
      case 'dribbble':
        return <Dribbble />;
      case 'github':
        return <Github />;
      case 'linkedin':
        return <Linkedin />;
      default:
        return <ExternalLink />;
    }
  };
  
  // Group links by category
  const groupedLinks = displayLinks.reduce((acc, link) => {
    const category = link.type.toUpperCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, ArtistLink[]>);
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      <ScrollArea className="h-full pr-4">
        <div className="space-y-6 pb-6">
          {/* Display grouped links */}
          {Object.entries(groupedLinks).map(([category, links]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold">{category}</h3>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <Button
                    key={index}
                    variant="artistProfile"
                    className="rounded-full"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <span className="flex items-center">
                      {getLinkIcon(link.type)}
                      <span className="ml-2">{link.title}</span>
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          {/* Show message if no links available */}
          {displayLinks === sampleLinks && (
            <p className="text-xs text-gray-500 italic mt-2 text-center">
              These are sample links to show how artist links would appear
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistProfileCenterPanel;
