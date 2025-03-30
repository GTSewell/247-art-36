
import React from "react";
import { Artist } from "@/data/types/artist";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import ArtistBadges from "./ArtistBadges";
import ArtistHeaderInfo from "./ArtistHeaderInfo";
import ArtistTechniquesStyles from "./ArtistTechniquesStyles";
import ArtistSocialSection from "./ArtistSocialSection";
import ArtistBio from "./ArtistBio";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistActions from "./ArtistActions";

interface DesktopArtistContentProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists: () => void;
  handleNavigateToArtistProfile: (e: React.MouseEvent) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  isMobile: boolean;
  isSignatureArtist: boolean;
  isDemo: boolean;
}

const DesktopArtistContent: React.FC<DesktopArtistContentProps> = ({
  artist,
  onFavoriteToggle,
  isFavorite,
  refreshArtists,
  handleNavigateToArtistProfile,
  handlePrevious,
  handleNext,
  isMobile,
  isSignatureArtist,
  isDemo
}) => {
  return (
    <div className="grid grid-cols-3 min-h-[70vh] max-h-[80vh]">
      {/* Left Panel - Image Gallery */}
      <div className="col-span-1 p-4 border-r border-gray-200 bg-gray-50 overflow-y-auto max-h-[80vh]">
        <ArtistImagePanel 
          artist={artist} 
          refreshArtists={refreshArtists} 
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          isMobile={isMobile}
        />
      </div>
      
      {/* Right Panel - Artist Details */}
      <div className="col-span-2 p-6 overflow-y-auto max-h-[80vh] relative">
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90" 
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90" 
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-4">
          <ArtistBadges
            isSignatureArtist={isSignatureArtist}
            isDemo={isDemo}
            position="top-right"
          />
          
          <ArtistHeaderInfo 
            name={artist.name}
            specialty={artist.specialty}
            city={artist.city || ''}
            country={artist.country || ''}
          />
          
          <ArtistBio bio={artist.bio} isMobile={isMobile} />
          
          <ArtistTechniquesStyles 
            techniques={Array.isArray(artist.techniques) ? artist.techniques : []} 
            styles={Array.isArray(artist.styles) ? artist.styles : []}
          />
          
          <ArtistSocialSection 
            socialPlatforms={Array.isArray(artist.social_platforms) ? artist.social_platforms : []} 
            isMobile={isMobile}
          />
          
          <div className="mt-6 flex space-x-4 pb-4">
            <ArtistActions
              artist={artist}
              isFavorite={isFavorite}
              onFavoriteToggle={onFavoriteToggle}
              handleDomainClick={handleNavigateToArtistProfile}
              isMobile={isMobile}
            />
            
            <Button 
              className="flex items-center space-x-2" 
              onClick={handleNavigateToArtistProfile}
            >
              <span>View Artist Profile</span>
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopArtistContent;
