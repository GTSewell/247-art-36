
import React from "react";
import { Artist } from "@/data/types/artist";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useArtistData } from "./hooks/useArtistData";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistHeaderInfo from "./ArtistHeaderInfo";
import ArtistBio from "./ArtistBio";
import ArtistTechniquesStyles from "./ArtistTechniquesStyles";
import ArtistSocialSection from "./ArtistSocialSection";
import ArtistActions from "./ArtistActions";
import ArtistBadges from "./ArtistBadges";

interface MobileArtistContentProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists: () => void;
  handleNavigateToArtistProfile: (e: React.MouseEvent) => void;
  isSignatureArtist: boolean;
  isDemo: boolean;
}

const MobileArtistContent: React.FC<MobileArtistContentProps> = ({
  artist,
  onFavoriteToggle,
  isFavorite,
  refreshArtists,
  handleNavigateToArtistProfile,
  isSignatureArtist,
  isDemo
}) => {
  const { currentArtist, refreshArtist } = useArtistData(artist, refreshArtists);
  
  return (
    <div className="flex flex-col max-h-[80vh] overflow-hidden">
      {/* Artist Gallery */}
      <div className="bg-gray-50 p-4 border-b">
        <ArtistImagePanel 
          artist={currentArtist} 
          refreshArtists={refreshArtist}
          isMobile={true}
        />
      </div>
      
      {/* Artist Details */}
      <div className="flex-1 p-4 overflow-y-auto relative">
        <div className="absolute top-4 right-4 z-10">
          <ArtistBadges
            isSignatureArtist={isSignatureArtist}
            isDemo={isDemo}
            isMobile={true}
          />
        </div>
        
        <ArtistHeaderInfo 
          name={currentArtist.name}
          specialty={currentArtist.specialty}
          city={currentArtist.city || ''}
          country={currentArtist.country || ''}
        />
        
        <ArtistBio bio={currentArtist.bio} />
        
        <ArtistTechniquesStyles 
          techniques={Array.isArray(currentArtist.techniques) ? currentArtist.techniques : []} 
          styles={Array.isArray(currentArtist.styles) ? currentArtist.styles : []}
        />
        
        <ArtistSocialSection 
          socialPlatforms={Array.isArray(currentArtist.social_platforms) ? currentArtist.social_platforms : []} 
          isMobile={true}
        />
        
        <div className="mt-6 flex flex-col space-y-3 pb-16">
          <ArtistActions
            artist={currentArtist}
            isFavorite={isFavorite}
            onFavoriteToggle={onFavoriteToggle}
            isMobile={true}
          />
          
          <Button 
            className="w-full flex items-center justify-center space-x-2" 
            onClick={handleNavigateToArtistProfile}
          >
            <span>View Artist Profile</span>
            <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileArtistContent;
