
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { filterArtists } from "@/components/artists/ArtistsFilter";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import AllArtists from "@/components/artists/AllArtists";
import ArtistsHeader from "@/components/artists/ArtistsHeader";
import ArtistDetails from "@/components/artists/ArtistDetails";
import { useArtists } from "@/hooks/use-artists";
import { useArtistRegeneration } from "@/hooks/use-artist-regeneration";
import type { Artist } from "@/data/types/artist";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const { handleRegenerateImage, isGenerating } = useArtistRegeneration();

  const handleArtistImageRegeneration = async (artist: Artist) => {
    const newImageUrl = await handleRegenerateImage(artist);
    if (newImageUrl) {
      refreshArtists();
    }
  };

  const handleRegenerateArtworks = async (artist: Artist) => {
    toast.info("Generating new artworks...");
    
    const generatePrompt = (technique: string) => {
      return `Create artwork in the style of ${technique} that showcases ${artist.specialty}. The art should reflect ${artist.name}'s unique artistic vision.`;
    };

    try {
      const newArtworks = [];
      const techniques = artist.techniques || ['Mixed Media'];
      
      // Generate 4 artworks using different techniques
      for (let i = 0; i < 4; i++) {
        const technique = techniques[i % techniques.length];
        const prompt = generatePrompt(technique);
        
        const { data, error: imageError } = await supabase.functions.invoke('generate-artist-image', {
          body: { 
            name: artist.name,
            specialty: artist.specialty,
            prompt: prompt
          }
        });

        if (imageError) throw imageError;
        if (data?.imageURL) {
          newArtworks.push(data.imageURL);
        }
      }

      if (newArtworks.length > 0) {
        const { error: updateError } = await supabase
          .from('artists')
          .update({ artworks: newArtworks })
          .eq('id', artist.id);

        if (updateError) throw updateError;

        toast.success("Artworks regenerated successfully!");
        refreshArtists();
      }
    } catch (error) {
      console.error('Error regenerating artworks:', error);
      toast.error("Failed to regenerate artworks");
    }
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

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
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
          onSelect={handleArtistSelect}
          onRegenerateImage={handleArtistImageRegeneration}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
        />

        <AllArtists
          artists={filteredAdditionalArtists}
          allArtistsSearch={allArtistsSearch}
          setAllArtistsSearch={setAllArtistsSearch}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onSelect={handleArtistSelect}
          onRegenerateImage={handleArtistImageRegeneration}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
        />

        <ArtistDetails
          artist={selectedArtist}
          isOpen={!!selectedArtist}
          onClose={() => setSelectedArtist(null)}
          onRegenerateArtworks={handleRegenerateArtworks}
        />
      </div>
    </div>
  );
};

export default Artists;
