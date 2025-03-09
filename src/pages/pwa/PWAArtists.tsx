
import React, { useState, useEffect } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import PWAArtistCarousel from "@/components/pwa/PWAArtistCarousel";
import { useArtists } from "@/hooks/use-artists";
import { Artist } from "@/data/types/artist";
import { filterArtists } from "@/components/artists/ArtistsFilter";
import AllArtists from "@/components/artists/AllArtists";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import { toast } from "sonner";
import DownloadArtistImages from "@/components/artists/DownloadArtistImages";
import { supabase } from "@/integrations/supabase/client";

const PWAArtists = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistSearch, setArtistSearch] = useState("");
  const [allArtistsSearch, setAllArtistsSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [techniqueSearch, setTechniqueSearch] = useState("");
  const [styleSearch, setStyleSearch] = useState("");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    artists,
    featuredArtists,
    loading,
    favoriteArtists,
    toggleFavorite,
    refreshArtists
  } = useArtists();
  
  // For compatibility with existing code
  const handleFavoriteToggle = toggleFavorite;
  const nonFeaturedArtists = artists.filter(artist => 
    !featuredArtists.some(featured => featured.id === artist.id)
  );

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        setIsAdmin(!!data);
      }
    };
    
    checkUserRole();
  }, []);

  const handleUpdateSelection = () => {
    toast.success('Filters applied successfully');
  };

  const handleClearFilters = () => {
    setArtistSearch("");
    setLocationSearch("");
    setTechniqueSearch("");
    setStyleSearch("");
    setSelectedTechniques([]);
    setSelectedStyles([]);
    setSelectedSocials([]);
    toast.success('Filters cleared');
  };

  // Refresh a specific artist if needed
  const refreshArtist = async (artistId: number): Promise<void | Artist> => {
    return await refreshArtists(artistId);
  };

  // Filter artists based on selected criteria
  const filteredAdditionalArtists = filterArtists({
    artists: nonFeaturedArtists,
    allArtistsSearch,
    locationSearch,
    selectedTechniques,
    selectedStyles,
    selectedSocials,
    showFavorites,
    favoriteArtists
  });

  if (loading) {
    return (
      <div className="bg-background min-h-screen pb-16">
        <PWANavigation />
        <div className="container mx-auto pt-20 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading artists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-16">
      <PWANavigation />
      <div className="container mx-auto pt-20 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Artists</h1>
          {isAdmin && <DownloadArtistImages />}
        </div>
        
        <ArtistsHeader
          artistSearch={artistSearch}
          setArtistSearch={setArtistSearch}
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          techniqueSearch={techniqueSearch}
          setTechniqueSearch={setTechniqueSearch}
          styleSearch={styleSearch}
          setStyleSearch={setStyleSearch}
          selectedTechniques={selectedTechniques}
          setSelectedTechniques={setSelectedTechniques}
          selectedStyles={selectedStyles}
          setSelectedStyles={setSelectedStyles}
          selectedSocials={selectedSocials}
          setSelectedSocials={setSelectedSocials}
          onUpdateSelection={handleUpdateSelection}
          onClearFilters={handleClearFilters}
        />

        <PWAArtistCarousel 
          artists={featuredArtists}
          onSelect={setSelectedArtist}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
          refreshArtist={refreshArtist}
        />

        <AllArtists
          artists={filteredAdditionalArtists}
          allArtistsSearch={allArtistsSearch}
          setAllArtistsSearch={setAllArtistsSearch}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onSelect={setSelectedArtist}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
          refreshArtists={() => refreshArtists()}
          refreshArtist={refreshArtist}
        />
      </div>
    </div>
  );
};

export default PWAArtists;
