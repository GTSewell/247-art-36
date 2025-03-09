
import React, { useState } from "react";
import { useArtists } from "@/hooks/use-artists";
import ArtistGrid from "@/components/artists/ArtistGrid";
import { Button } from "@/components/ui/button";
import { Heart, RotateCw, Search } from "lucide-react";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Input } from "@/components/ui/input";
import { Artist } from "@/data/types/artist";
import { useNavigate } from "react-router-dom";
import ArtistDetailModal from "@/components/artists/ArtistDetailModal";

const PWAArtists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  
  const { 
    loading: isLoading, 
    artists, 
    featuredArtists, 
    favoriteArtists, 
    toggleFavorite: handleFavoriteToggle,
    refreshArtists 
  } = useArtists();

  // All artists - combine featured and other artists and ensure no duplicates
  const allArtists = [...(artists || [])];
  
  // Filter artists based on search term and favorites
  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = !searchTerm || 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artist.specialty && artist.specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFavorites = !showFavorites || favoriteArtists.has(artist.id);
    
    return matchesSearch && matchesFavorites;
  });

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    const index = filteredArtists.findIndex(a => a.id === artist.id);
    setSelectedArtistIndex(index >= 0 ? index : 0);
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleArtistChange = (index: number) => {
    if (index >= 0 && index < filteredArtists.length) {
      setSelectedArtistIndex(index);
      setSelectedArtist(filteredArtists[index]);
    }
  };

  // Navigate to artist subdomain page
  const navigateToArtistPage = (artist: Artist) => {
    navigate(`/artist/${artist.name.toLowerCase().replace(/\s+/g, '')}`);
  };

  // Refresh a specific artist if needed
  const refreshArtist = async (artistId: number) => {
    await refreshArtists(artistId);
  };

  return (
    <div className="pb-20 pt-16">
      <PWANavigation />
      
      <div className="container mx-auto px-4 py-4">
        {/* Search and filter bar */}
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

        {/* Artists Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        ) : filteredArtists.length > 0 ? (
          <ArtistGrid
            artists={filteredArtists}
            onArtistClick={handleArtistClick}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteArtists={favoriteArtists}
            refreshArtist={refreshArtist}
            showFavorites={showFavorites}
          />
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">No artists found</p>
          </div>
        )}
      </div>

      {/* Artist Detail Modal */}
      {selectedArtist && (
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
      )}
    </div>
  );
};

export default PWAArtists;
