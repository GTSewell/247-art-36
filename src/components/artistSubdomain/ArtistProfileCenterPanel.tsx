
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';
import { ExternalLink } from 'lucide-react';

interface ArtistProfileCenterPanelProps {
  artist: Artist;
  socialPlatforms: string[];
  links: Array<{ title: string; url: string }>;
  panelColor: string;
  textColor?: string;
  accentColor?: string;
}

const ArtistProfileCenterPanel: React.FC<ArtistProfileCenterPanelProps> = ({
  artist,
  socialPlatforms,
  links,
  panelColor,
  textColor = '#000000',
  accentColor = '#ef3f36'
}) => {
  const isMobile = useIsMobile();
  
  // Sample links to display when artist has no custom links
  const sampleLinks = [
    { title: 'Portfolio Website', url: '#' },
    { title: 'Next Exhibition', url: '#' },
    { title: 'Public Art Projects', url: '#' },
    { title: 'Commission Info', url: '#' },
    { title: 'Artist Statement', url: '#' },
    { title: 'Publications', url: '#' },
    { title: 'CV/Resume', url: '#' },
    { title: 'Art Shop', url: '#' }
  ];
  
  // Display actual links if available, otherwise show sample links
  const displayLinks = links.length > 0 ? links : sampleLinks;
  
  const getSocialIcon = (platform: string) => {
    // Icons for various social platforms
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('instagram')) return '/icons/instagram.svg';
    if (lowerPlatform.includes('facebook')) return '/icons/facebook.svg';
    if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x.com')) return '/icons/twitter.svg';
    if (lowerPlatform.includes('linkedin')) return '/icons/linkedin.svg';
    if (lowerPlatform.includes('youtube')) return '/icons/youtube.svg';
    if (lowerPlatform.includes('tiktok')) return '/icons/tiktok.svg';
    return '/icons/link.svg';
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
            <h2 className="text-lg font-bold" style={{ color: textColor }}>{artist.name}</h2>
            <p className="text-sm" style={{ color: `${textColor}99` }}>{artist.specialty}</p>
            <p className="text-xs" style={{ color: `${textColor}77` }}>
              {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
            </p>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-grow pr-2">
        {/* Social Media Section */}
        {socialPlatforms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3" style={{ color: textColor }}>Social Media</h3>
            <div className="flex flex-wrap gap-4">
              {socialPlatforms.map((platform, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <img 
                    src={getSocialIcon(platform)} 
                    alt={platform} 
                    className="w-5 h-5"
                    style={{ filter: `brightness(0) saturate(100%) ${textColor === '#ffffff' ? 'invert(1)' : ''}` }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Artist Links Section */}
        <div>
          <h3 className="text-base font-bold mb-3" style={{ color: textColor }}>Links</h3>
          <div className="grid grid-cols-2 gap-3">
            {displayLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url === '#' ? undefined : link.url}
                className={`block p-3 rounded-md transition-all duration-200 hover:scale-105 ${links.length === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                style={{ 
                  backgroundColor: `${accentColor}22`,
                  color: accentColor,
                  border: `1px solid ${accentColor}33`
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{link.title}</span>
                  {link.url !== '#' && <ExternalLink size={14} />}
                </div>
              </a>
            ))}
          </div>
          
          {links.length === 0 && (
            <p className="text-xs mt-4 italic text-center" style={{ color: `${textColor}77` }}>
              These are sample links. Artists can customize their own links.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistProfileCenterPanel;
