
import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftCircle } from 'lucide-react';

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
  // Define dynamic styles based on the artist's color theme
  const tabListStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  };
  
  const activeTabStyle = {
    backgroundColor: colorTheme?.button || '#f7cf1e',
    color: colorTheme?.buttonText || '#000000',
  };
  
  const returnButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <TabsList 
        className="grid grid-cols-3 flex-1 backdrop-blur-sm" 
        style={tabListStyle}
      >
        <TabsTrigger 
          value="about" 
          className="data-[state=active]:font-medium transition-all duration-200"
          style={activeTab === "about" ? activeTabStyle : undefined}
        >
          About
        </TabsTrigger>
        <TabsTrigger 
          value="links" 
          className="data-[state=active]:font-medium transition-all duration-200"
          style={activeTab === "links" ? activeTabStyle : undefined}
        >
          Links
        </TabsTrigger>
        <TabsTrigger 
          value="artwork" 
          className="data-[state=active]:font-medium transition-all duration-200"
          style={activeTab === "artwork" ? activeTabStyle : undefined}
        >
          Artwork
        </TabsTrigger>
      </TabsList>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleReturnToArtists}
        className="ml-2 hover:bg-white backdrop-blur-sm h-9 w-9"
        style={returnButtonStyle}
      >
        <ArrowLeftCircle size={18} />
        <span className="sr-only">Return to Artists</span>
      </Button>
    </div>
  );
};

export default MobileNavigation;
