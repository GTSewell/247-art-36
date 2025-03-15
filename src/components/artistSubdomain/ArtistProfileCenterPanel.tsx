
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
import { Avatar } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
  
  // Normalize social platform data to handle different formats
  const normalizedPlatforms = socialPlatforms.map((platform) => {
    // Trim the platform string
    const trimmed = platform.trim();
    
    // Handle @username format for social media
    if (trimmed.startsWith('@')) {
      const username = trimmed.substring(1);
      // Default to Instagram for @ handles, as that's the most common usage
      return { 
        type: 'instagram',
        url: `https://instagram.com/${username}`, 
        original: trimmed 
      };
    }
    
    // Extract platform type from URL or text
    let type = 'external';
    let url = trimmed;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If it doesn't have a protocol, add https://
      url = `https://${url}`;
    }
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Determine platform type from hostname
      if (hostname.includes('instagram')) {
        type = 'instagram';
      } else if (hostname.includes('twitter') || hostname.includes('x.com')) {
        type = 'twitter';
      } else if (hostname.includes('facebook')) {
        type = 'facebook';
      } else if (hostname.includes('linkedin')) {
        type = 'linkedin';
      } else if (hostname.includes('youtube')) {
        type = 'youtube';
      }
      
      return { type, url, original: trimmed };
    } catch (error) {
      console.error("Invalid URL format:", url);
      return { type: 'external', url, original: trimmed };
    }
  });

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
          {/* Artist Profile Header - Only show on mobile/PWA */}
          {isMobile && (
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-16 w-16 rounded-md border">
                {artist.image ? (
                  <img 
                    src={artist.image} 
                    alt={artist.name} 
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                    {artist.name?.substring(0, 2).toUpperCase() || "NA"}
                  </div>
                )}
              </Avatar>
              <div>
                <h2 className="font-bold text-lg">{artist.name}</h2>
                <p className="text-sm text-gray-600">{artist.specialty}</p>
                {(artist.city || artist.country) && (
                  <p className="text-xs text-gray-500">
                    {[artist.city, artist.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Connect Section */}
          {normalizedPlatforms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">CONNECT</h3>
              <div className="flex gap-2 flex-wrap">
                {normalizedPlatforms.map((platform, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    style={{
                      backgroundColor: buttonColor,
                      color: buttonTextColor,
                      borderColor: buttonBorderColor,
                    }}
                    onClick={() => window.open(platform.url, '_blank')}
                    onMouseOver={(e) => {
                      if (buttonHoverColor) {
                        e.currentTarget.style.backgroundColor = buttonHoverColor;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (buttonColor) {
                        e.currentTarget.style.backgroundColor = buttonColor;
                      }
                    }}
                  >
                    {getLinkIcon(platform.type)}
                  </Button>
                ))}
              </div>
            </div>
          )}

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
                    style={{
                      backgroundColor: buttonColor,
                      color: buttonTextColor,
                      borderColor: buttonBorderColor,
                    }}
                    onClick={() => window.open(link.url, '_blank')}
                    onMouseOver={(e) => {
                      if (buttonHoverColor) {
                        e.currentTarget.style.backgroundColor = buttonHoverColor;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (buttonColor) {
                        e.currentTarget.style.backgroundColor = buttonColor;
                      }
                    }}
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
