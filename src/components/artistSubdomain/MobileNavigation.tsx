
import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftCircle } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  handleReturnToArtists: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  handleTabChange,
  handleReturnToArtists
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <TabsList className="grid grid-cols-3 flex-1 bg-white/80 backdrop-blur-sm">
        <TabsTrigger 
          value="about" 
          className="data-[state=active]:bg-yellow-100"
          onClick={() => handleTabChange("about")}
        >
          About
        </TabsTrigger>
        <TabsTrigger 
          value="links" 
          className="data-[state=active]:bg-yellow-100"
          onClick={() => handleTabChange("links")}
        >
          Links
        </TabsTrigger>
        <TabsTrigger 
          value="artwork" 
          className="data-[state=active]:bg-yellow-100"
          onClick={() => handleTabChange("artwork")}
        >
          Artwork
        </TabsTrigger>
      </TabsList>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleReturnToArtists}
        className="ml-2 bg-white/80 hover:bg-white backdrop-blur-sm h-9 w-9"
      >
        <ArrowLeftCircle size={18} />
        <span className="sr-only">Return to Artists</span>
      </Button>
    </div>
  );
};

export default MobileNavigation;
