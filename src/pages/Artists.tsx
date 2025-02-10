
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { SlidersHorizontal, Sun, Moon, Search } from "lucide-react";
import { featuredArtists as initialFeaturedArtists, additionalArtists as initialAdditionalArtists } from "@/data/artists";
import ArtistCard from "@/components/artists/ArtistCard";
import AtlasFilter from "@/components/artists/AtlasFilter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [featuredArtists, setFeaturedArtists] = useState(initialFeaturedArtists);
  const [additionalArtists, setAdditionalArtists] = useState(initialAdditionalArtists);

  const { theme, setTheme } = useTheme();
  const { generateImage, isLoading } = useGenerateArtistImage();

  // Filter additional artists based on search
  const filteredAdditionalArtists = additionalArtists.filter(artist =>
    artist.name.toLowerCase().includes(allArtistsSearch.toLowerCase()) ||
    artist.specialty.toLowerCase().includes(allArtistsSearch.toLowerCase())
  );

  // Load fixed images on component mount
  useEffect(() => {
    const loadFixedImages = async () => {
      const { data: fixedImages } = await supabase
        .from('artist_images')
        .select('artist_id, image_url');

      if (fixedImages) {
        const fixedImagesMap = new Map(fixedImages.map(img => [img.artist_id, img.image_url]));

        setFeaturedArtists(prevArtists =>
          prevArtists.map(artist => ({
            ...artist,
            image: fixedImagesMap.get(artist.id) || artist.image
          }))
        );

        setAdditionalArtists(prevArtists =>
          prevArtists.map(artist => ({
            ...artist,
            image: fixedImagesMap.get(artist.id) || artist.image
          }))
        );
      }
    };

    loadFixedImages();
  }, []);

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
      if (artist.id <= 3) {
        // Featured artists
        setFeaturedArtists(prevArtists =>
          prevArtists.map(a =>
            a.id === artist.id ? { ...a, image: imageUrl } : a
          )
        );
      } else {
        // Additional artists
        setAdditionalArtists(prevArtists =>
          prevArtists.map(a =>
            a.id === artist.id ? { ...a, image: imageUrl } : a
          )
        );
      }
      toast.success(`New profile image generated for ${artist.name}!`);
    }
  };

  const handleUpdateSelection = () => {
    console.log('Updating selection with current filters:', {
      artistSearch,
      locationSearch,
      selectedTechniques,
      selectedStyles,
      selectedSocials
    });
  };

  const handleClearFilters = () => {
    setArtistSearch("");
    setLocationSearch("");
    setTechniqueSearch("");
    setStyleSearch("");
    setSelectedTechniques([]);
    setSelectedStyles([]);
    setSelectedSocials([]);
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
          {featuredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              {...artist}
              onSelect={setSelectedArtist}
              onRegenerateImage={() => handleRegenerateImage(artist)}
              isFeatured={true}
            />
          ))}
        </div>

        {/* All Artists Section with Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-foreground">All Artists</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAdditionalArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                {...artist}
                onSelect={setSelectedArtist}
                onRegenerateImage={() => handleRegenerateImage(artist)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artists;
