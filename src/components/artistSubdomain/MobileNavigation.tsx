import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  handleReturnToArtists: () => void;
  colorTheme?: {
    background: string;
    panel: string;
    button: string;
    buttonText: string;
    buttonHover: string;
    buttonBorder: string;
    badgeBg: string;
  };
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  handleTabChange,
  handleReturnToArtists,
  colorTheme
}) => {
  const tabsContainerStyle = {
    background: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: '8px',
    overflow: 'hidden'
  };
  
  const activeTabStyle = {
    backgroundColor: colorTheme?.button || '#f7cf1e',
    color: colorTheme?.buttonText || '#000000',
    fontWeight: 600,
    borderRadius: 0
  };
  
  const inactiveTabStyle = {
    backgroundColor: 'transparent',
    color: '#4a5568',
    fontWeight: 500,
    borderRadius: 0
  };
  
  const returnButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px'
  };

  return (
    <div className="flex items-center justify-between mb-4 gap-2">
      <div 
        className="flex-1 overflow-hidden backdrop-blur-sm" 
        style={tabsContainerStyle}
      >
        <TabsList className="w-full h-14 p-0 bg-transparent flex rounded-none">
          <TabsTrigger 
            value="about" 
            onClick={() => handleTabChange("about")}
            className="flex-1 h-full text-lg transition-all duration-200 rounded-none"
            style={activeTab === "about" ? activeTabStyle : inactiveTabStyle}
          >
            About
          </TabsTrigger>
          <TabsTrigger 
            value="links" 
            onClick={() => handleTabChange("links")}
            className="flex-1 h-full text-lg transition-all duration-200 rounded-none"
            style={activeTab === "links" ? activeTabStyle : inactiveTabStyle}
          >
            Links
          </TabsTrigger>
          <TabsTrigger 
            value="artwork" 
            onClick={() => handleTabChange("artwork")}
            className="flex-1 h-full text-lg transition-all duration-200 rounded-none"
            style={activeTab === "artwork" ? activeTabStyle : inactiveTabStyle}
          >
            Artwork
          </TabsTrigger>
        </TabsList>
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleReturnToArtists}
        className="h-14 w-14 flex items-center justify-center backdrop-blur-sm"
        style={returnButtonStyle}
      >
        <ArrowLeft size={28} strokeWidth={2.5} />
        <span className="sr-only">Return to Artists</span>
      </Button>
    </div>
  );
};

export default MobileNavigation;
