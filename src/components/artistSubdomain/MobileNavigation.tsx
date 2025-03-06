
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
          data-state={activeTab === "about" ? "active" : "inactive"}
          onClick={() => handleTabChange("about")}
          className="data-[state=active]:bg-yellow-100 transition-colors duration-200"
        >
          About
        </TabsTrigger>
        <TabsTrigger 
          value="links" 
          data-state={activeTab === "links" ? "active" : "inactive"}
          onClick={() => handleTabChange("links")}
          className="data-[state=active]:bg-yellow-100 transition-colors duration-200"
        >
          Links
        </TabsTrigger>
        <TabsTrigger 
          value="artwork" 
          data-state={activeTab === "artwork" ? "active" : "inactive"}
          onClick={() => handleTabChange("artwork")}
          className="data-[state=active]:bg-yellow-100 transition-colors duration-200"
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
