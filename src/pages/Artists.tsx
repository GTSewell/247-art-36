import React, { useState, useEffect } from "react";
import Navigation from "@/components/navigation/Navigation";
import { filterArtists } from "@/components/artists/ArtistsFilter";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import AllArtists from "@/components/artists/AllArtists";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import { useArtists } from "@/hooks/use-artists";
import type { Artist } from "@/data/types/artist";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle,
    refreshArtists
  } = useArtists();
  const handleThemeToggle = (isDark: boolean) => {
    setDarkMode(isDark);
  };
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
  const refreshArtist = async (artistId: number): Promise<void> => {
    await refreshArtists(artistId);
  };
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
    return <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
        <Navigation />
        <div className="container mx-auto pt-20 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading artists...</p>
          </div>
        </div>
      </div>;
  }
  return <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
        <Navigation />
        
        <div className="container mx-auto pt-20 px-4 pb-16">
          <div className="flex justify-end mb-4">
            <ThemeToggle localOnly={true} onToggle={handleThemeToggle} />
          </div>
          
          <Alert className="mb-6 bg-zap-yellow border-zap-yellow text-black py-[2px] mx-0 px-[9px]">
            <AlertDescription className="text-lg">
              <span className="font-bold py-0 px-[116px] mx-[234px]">This is a mock-up artist page for demonstration purposes.</span>
              <br />
              
            </AlertDescription>
          </Alert>
          
          <ArtistsHeader artistSearch={artistSearch} setArtistSearch={setArtistSearch} locationSearch={locationSearch} setLocationSearch={setLocationSearch} techniqueSearch={techniqueSearch} setTechniqueSearch={setTechniqueSearch} styleSearch={styleSearch} setStyleSearch={setStyleSearch} selectedTechniques={selectedTechniques} setSelectedTechniques={setSelectedTechniques} selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles} selectedSocials={selectedSocials} setSelectedSocials={setSelectedSocials} onUpdateSelection={handleUpdateSelection} onClearFilters={handleClearFilters} allArtistsSearch={allArtistsSearch} setAllArtistsSearch={setAllArtistsSearch} showFavorites={showFavorites} setShowFavorites={setShowFavorites} />

          <FeaturedArtists artists={filteredFeaturedArtists} onSelect={setSelectedArtist} onFavoriteToggle={handleFavoriteToggle} favoriteArtists={favoriteArtists} refreshArtists={() => refreshArtists()} refreshArtist={refreshArtist} />

          <AllArtists artists={filteredAdditionalArtists} allArtistsSearch={allArtistsSearch} setAllArtistsSearch={setAllArtistsSearch} showFavorites={showFavorites} setShowFavorites={setShowFavorites} onSelect={setSelectedArtist} onFavoriteToggle={handleFavoriteToggle} favoriteArtists={favoriteArtists} refreshArtists={() => refreshArtists()} refreshArtist={refreshArtist} />
        </div>
      </div>
    </div>;
};
export default Artists;