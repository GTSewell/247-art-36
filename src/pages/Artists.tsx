
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { filterArtists } from "@/components/artists/ArtistsFilter";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import AllArtists from "@/components/artists/AllArtists";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import { useArtists } from "@/hooks/use-artists";
import { useArtistRegeneration } from "@/hooks/use-artist-regeneration";
import { toast } from "sonner";

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
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
    handleFavoriteToggle
  } = useArtists();

  const { handleRegenerateImage } = useArtistRegeneration((updateFn) => {
    // Update both featured and additional artists
    const newFeatured = updateFn(featuredArtists);
    const newAdditional = updateFn(additionalArtists);
    // The state updates will be handled by the useArtists hook
  });

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
      <div className="min-h-screen bg-zap-yellow">
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
    <div className="min-h-screen bg-zap-yellow">
      <Navigation />
      
      <div className="container mx-auto pt-20 px-4">
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
          onRegenerateImage={handleRegenerateImage}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
        />

        <AllArtists
          artists={filteredAdditionalArtists}
          allArtistsSearch={allArtistsSearch}
          setAllArtistsSearch={setAllArtistsSearch}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onSelect={setSelectedArtist}
          onRegenerateImage={handleRegenerateImage}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
        />
      </div>
    </div>
  );
};

export default Artists;
