
import React, { useState } from "react";
import { useArtists } from "@/hooks/use-artists";
import ArtistGrid from "@/components/artists/ArtistGrid";
import { Button } from "@/components/ui/button";
import { Filter, Heart, RotateCw, Search } from "lucide-react";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Input } from "@/components/ui/input";
import { Artist } from "@/data/types/artist";
import { useNavigate } from "react-router-dom";

const PWAArtists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const { 
    featuredArtists, 
    additionalArtists, 
    isLoading, 
    favoriteArtists, 
    handleFavoriteToggle,
    refreshArtists 
  } = useArtists();

  // Combine featured and additional artists into one array
  const allArtists = [...featuredArtists, ...additionalArtists];

  // Filter artists based on search term and favorites
  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = !searchTerm || 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFavorites = !showFavorites || favoriteArtists.has(artist.id);
    
    return matchesSearch && matchesFavorites;
  });

  const handleArtistClick = (_: React.MouseEvent, artist: Artist) => {
    // Navigate to artist subdomain page
    navigate(`/artist/${artist.name.toLowerCase().replace(/\s+/g, '')}`);
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
        ) : (
          <ArtistGrid
            artists={filteredArtists}
            onArtistClick={handleArtistClick}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteArtists={favoriteArtists}
            refreshArtist={(artistId) => refreshArtists(artistId)}
            showFavorites={showFavorites}
          />
        )}
      </div>
    </div>
  );
};

export default PWAArtists;
