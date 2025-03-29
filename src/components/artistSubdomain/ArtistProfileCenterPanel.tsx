
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistLink } from '@/data/types/artistProfile';
import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistLinkButtons from './ArtistLinkButtons';
import ArtistConnectSection from './ArtistConnectSection';
import { useIsMobile } from '@/hooks/use-mobile';
import ArtistMobileHeader from './ArtistMobileHeader';

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
  
  // Filter out empty social platforms
  const validSocialPlatforms = socialPlatforms.filter(platform => 
    platform && typeof platform === 'string' && platform.trim() !== ''
  );

  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: panelColor }}
    >
      <ScrollArea className="flex-grow overflow-auto">
        <div className="p-5">
          {/* Add the artist header for mobile view */}
          {isMobile && <ArtistMobileHeader artist={artist} />}
        
          <h3 className="text-base font-bold mb-3">CONNECT</h3>
          <ArtistConnectSection 
            artist={artist}
            socialPlatforms={validSocialPlatforms}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            buttonHoverColor={buttonHoverColor}
            buttonBorderColor={buttonBorderColor}
          />
          
          {links.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-bold mb-3">Links</h3>
              <ArtistLinkButtons 
                links={links}
                buttonColor={buttonColor}
                buttonTextColor={buttonTextColor}
                buttonHoverColor={buttonHoverColor}
                buttonBorderColor={buttonBorderColor}
              />
            </div>
          )}
          
          <div className="mt-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold mb-3">WEBSITE</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">🌐</span>
                    Portfolio Website
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">EXHIBITION</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">🎭</span>
                    Next Exhibition
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">INSTALLATION</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">📍</span>
                    Public Art Installation
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">SHOP</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">🛒</span>
                    Online Art Shop
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">GALLERY</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">🖼️</span>
                    Gallery Representation
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">CONTACT</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">✉️</span>
                    Contact for Commissions
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">VIDEO</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">🎥</span>
                    Studio Tour Video
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h3 className="text-base font-bold mb-3">AWARD</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md w-full"
                  style={{ 
                    backgroundColor: buttonColor, 
                    color: buttonTextColor 
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2">🏆</span>
                    Recent Awards
                  </span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              These are sample links to show how artist links would appear
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistProfileCenterPanel;
