
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { SlidersHorizontal, Sun, Moon, Search } from "lucide-react";
import ArtistCard from "@/components/artists/ArtistCard";
import AtlasFilter from "@/components/artists/AtlasFilter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useGenerateArtistImage } from "@/hooks/use-generate-artist-image";
import { toast } from "sonner";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";

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

  const { theme, setTheme } = useTheme();
  const { generateImage, isLoading } = useGenerateArtistImage();

  // Load artists from Supabase
  useEffect(() => {
    const loadArtists = async () => {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('id');

      if (error) {
        toast.error('Failed to load artists');
        return;
      }

      if (artists) {
        // First 3 artists are featured
        setFeaturedArtists(artists.slice(0, 3));
        setAdditionalArtists(artists.slice(3));
      }
    };

    loadArtists();
  }, []);

  // Filter artists based on search and filters
  const filterArtists = (artists: Artist[]) => {
    return artists.filter(artist => {
      // Text search filters
      const matchesSearch = artist.name.toLowerCase().includes(allArtistsSearch.toLowerCase()) ||
        artist.specialty.toLowerCase().includes(allArtistsSearch.toLowerCase());
      
      const matchesLocation = !locationSearch || 
        (artist.location && artist.location.toLowerCase().includes(locationSearch.toLowerCase()));

      // Technique filter
      const matchesTechniques = selectedTechniques.length === 0 || 
        selectedTechniques.every(technique => 
          artist.techniques?.includes(technique as any)
        );

      // Style filter
      const matchesStyles = selectedStyles.length === 0 || 
        selectedStyles.every(style => 
          artist.styles?.includes(style as any)
        );

      // Social platform filter
      const matchesSocials = selectedSocials.length === 0 || 
        selectedSocials.every(social => 
          artist.social_platforms?.includes(social as any)
        );

      // Favorites filter
      const matchesFavorites = !showFavorites || favoriteArtists.has(artist.id);

      return matchesSearch && matchesLocation && matchesTechniques && 
             matchesStyles && matchesSocials && matchesFavorites;
    });
  };

  const filteredFeaturedArtists = filterArtists(featuredArtists);
  const filteredAdditionalArtists = filterArtists(additionalArtists);

  // Handle favorite toggle from ArtistCard
  const handleFavoriteToggle = (artistId: number, isFavorite: boolean) => {
    setFavoriteArtists(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(artistId);
      } else {
        newFavorites.delete(artistId);
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
    if (isLoading) {
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

        {/* Featured Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFeaturedArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              {...artist}
              onSelect={setSelectedArtist}
              onRegenerateImage={() => handleRegenerateImage(artist)}
              isFeatured={true}
              onFavoriteToggle={(isFavorite) => handleFavoriteToggle(artist.id, isFavorite)}
              isFavorite={favoriteArtists.has(artist.id)}
            />
          ))}
        </div>

        {/* All Artists Section with Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-foreground">All Artists</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-border">
                <Checkbox
                  id="showFavorites"
                  checked={showFavorites}
                  onCheckedChange={(checked) => setShowFavorites(checked as boolean)}
                  className="data-[state=checked]:bg-zap-yellow data-[state=checked]:text-black"
                />
                <label
                  htmlFor="showFavorites"
                  className="text-sm font-medium leading-none cursor-pointer select-none"
                >
                  View Favorite Artists
                </label>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search artists..."
                  value={allArtistsSearch}
                  onChange={(e) => setAllArtistsSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAdditionalArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                {...artist}
                onSelect={setSelectedArtist}
                onRegenerateImage={() => handleRegenerateImage(artist)}
                onFavoriteToggle={(isFavorite) => handleFavoriteToggle(artist.id, isFavorite)}
                isFavorite={favoriteArtists.has(artist.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artists;
