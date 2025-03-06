
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { filterArtists } from "@/components/artists/ArtistsFilter";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import AllArtists from "@/components/artists/AllArtists";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import { useArtists } from "@/hooks/use-artists";
import type { Artist } from "@/data/types/artist";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const Artists = () => {
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

  const {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle,
    refreshArtists
  } = useArtists();

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
  const refreshArtist = async (artistId: number): Promise<void> => {
    await refreshArtists(artistId);
  };

  // Filter artists based on selected criteria
  const filteredFeaturedArtists = filterArtists({
    artists: featuredArtists,
    allArtistsSearch,
    locationSearch,
    selectedTechniques,
    selectedStyles,
    selectedSocials,
    showFavorites,
    favoriteArtists
  });

  const filteredAdditionalArtists = filterArtists({
    artists: additionalArtists,
    allArtistsSearch,
    locationSearch,
    selectedTechniques,
    selectedStyles,
    selectedSocials,
    showFavorites,
    favoriteArtists
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
        <Navigation />
        <div className="container mx-auto pt-20 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading artists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground transition-colors duration-200">
      <Navigation />
      
      <div className="container mx-auto pt-20 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Artists</h1>
          <ThemeToggle />
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

        <FeaturedArtists
          artists={filteredFeaturedArtists}
          onSelect={setSelectedArtist}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
          refreshArtists={() => refreshArtists()}
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

export default Artists;
