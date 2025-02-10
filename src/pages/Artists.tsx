
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { SlidersHorizontal, Sun, Moon } from "lucide-react";
import AtlasFilter from "@/components/artists/AtlasFilter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useGenerateArtistImage } from "@/hooks/use-generate-artist-image";
import { toast } from "sonner";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { filterArtists } from "@/components/artists/ArtistsFilter";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import AllArtists from "@/components/artists/AllArtists";

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
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [additionalArtists, setAdditionalArtists] = useState<Artist[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const { theme, setTheme } = useTheme();
  const { generateImage, isLoading: isGenerating } = useGenerateArtistImage();

  // Load artists from Supabase
  useEffect(() => {
    const loadArtists = async () => {
      try {
        setIsLoading(true);
        const { data: artists, error } = await supabase
          .from('artists')
          .select('*')
          .order('id');

        if (error) {
          toast.error('Failed to load artists');
          console.error('Error loading artists:', error);
          return;
        }

        if (artists) {
          // First 3 artists are featured
          setFeaturedArtists(artists.slice(0, 3));
          // Rest are additional artists
          setAdditionalArtists(artists.slice(3));
        }
      } catch (error) {
        console.error('Error in loadArtists:', error);
        toast.error('Failed to load artists');
      } finally {
        setIsLoading(false);
      }
    };

    loadArtists();
  }, []);

  const handleFavoriteToggle = (artistId: number, isFavorite: boolean) => {
    setFavoriteArtists(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(artistId);
        toast.success('Added to favorites');
      } else {
        newFavorites.delete(artistId);
        toast.success('Removed from favorites');
      }
      return newFavorites;
    });
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

  const handleRegenerateImage = async (artist: Artist) => {
    if (isGenerating) {
      toast.error("Please wait for the current generation to complete");
      return;
    }

    toast.info(`Generating new profile image for ${artist.name}...`);
    const imageUrl = await generateImage({
      name: artist.name,
      specialty: artist.specialty
    });

    if (imageUrl) {
      const { error } = await supabase
        .from('artists')
        .update({ image: imageUrl })
        .eq('id', artist.id);

      if (error) {
        toast.error('Failed to update artist image');
        return;
      }

      // Update local state
      const updateArtists = (prevArtists: Artist[]) =>
        prevArtists.map(a =>
          a.id === artist.id ? { ...a, image: imageUrl } : a
        );

      setFeaturedArtists(updateArtists);
      setAdditionalArtists(updateArtists);
      
      toast.success(`New profile image generated for ${artist.name}!`);
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Featured Artists</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <SlidersHorizontal size={20} />
                  <span>ATLAS</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-xl">
                <AtlasFilter 
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
              </SheetContent>
            </Sheet>
          </div>
        </div>

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

