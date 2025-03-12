
import React, { useState, useEffect } from "react";
import { useArtists } from "@/hooks/use-artists";
import ArtistGrid from "@/components/artists/ArtistGrid";
import { Button } from "@/components/ui/button";
import { Heart, RotateCw, Search } from "lucide-react";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { Input } from "@/components/ui/input";
import { Artist } from "@/data/types/artist";
import { useNavigate } from "react-router-dom";
import ArtistDetailModal from "@/components/artists/ArtistDetailModal";
import { logger } from "@/utils/logger";

const PWAArtists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  const { isPWA } = useAppMode();
  
  const { 
    featuredArtists, 
    additionalArtists, 
    isLoading, 
    favoriteArtists, 
    handleFavoriteToggle,
    refreshArtists 
  } = useArtists();

  const allArtists = [...featuredArtists, ...additionalArtists];

  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = !searchTerm || 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFavorites = !showFavorites || favoriteArtists.has(artist.id);
    
    return matchesSearch && matchesFavorites;
  });

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    const index = filteredArtists.findIndex(a => a.id === artist.id);
    setSelectedArtistIndex(index);
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleArtistChange = (index: number) => {
    if (index >= 0 && index < filteredArtists.length) {
      setSelectedArtistIndex(index);
      setSelectedArtist(filteredArtists[index]);
    }
  };

  const navigateToArtistPage = (artist: Artist) => {
    // Remove spaces from artist name for URL
    const formattedName = artist.name.replace(/\s+/g, '');
    logger.info(`Navigating to artist page: ${formattedName}`);
    navigate(`/artists/${formattedName}`);
  };

  return (
    <div className={`${isPWA ? 'min-h-screen pb-20 pt-8 overflow-y-auto bg-[#00baef]' : 'pb-20 pt-8'}`}>
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <div className="container mx-auto px-4 py-2 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFavorites(!showFavorites)}
            className={showFavorites ? "bg-yellow-300 text-black" : ""}
          >
            <Heart size={18} className={showFavorites ? "fill-current" : ""} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refreshArtists()}
          >
            <RotateCw size={18} />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-20">
            {filteredArtists.map((artist) => (
              <ArtistGrid
                key={artist.id}
                artists={[artist]}
                onArtistClick={handleArtistClick}
                onFavoriteToggle={handleFavoriteToggle}
                favoriteArtists={favoriteArtists}
                refreshArtist={(artistId) => refreshArtists(artistId)}
                showFavorites={showFavorites}
              />
            ))}
          </div>
        )}
      </div>

      <ArtistDetailModal
        artists={filteredArtists}
        selectedArtist={selectedArtist}
        selectedArtistIndex={selectedArtistIndex}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onArtistChange={handleArtistChange}
        onFavoriteToggle={handleFavoriteToggle}
        favoriteArtists={favoriteArtists}
        refreshArtists={refreshArtists}
        onSelect={navigateToArtistPage}
      />
    </div>
  );
};

export default PWAArtists;
