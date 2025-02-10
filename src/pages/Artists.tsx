import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { SlidersHorizontal, Sun, Moon } from "lucide-react";
import { featuredArtists, additionalArtists } from "@/data/artists";
import ArtistCard from "@/components/artists/ArtistCard";
import AtlasFilter from "@/components/artists/AtlasFilter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useGenerateArtistImage } from "@/hooks/use-generate-artist-image";
import { toast } from "sonner";

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [artistSearch, setArtistSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [techniqueSearch, setTechniqueSearch] = useState("");
  const [styleSearch, setStyleSearch] = useState("");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);

  const { theme, setTheme } = useTheme();
  const { generateImage, isLoading } = useGenerateArtistImage();

  const handleRegenerateImage = async (artist: typeof featuredArtists[0]) => {
    if (isLoading) {
      toast.error("Please wait for the current generation to complete");
      return;
    }

    toast.info("Generating new profile image...");
    const imageUrl = await generateImage({
      name: artist.name,
      specialty: artist.specialty
    });

    if (imageUrl) {
      toast.success("New profile image generated!");
      // Note: In a real application, you would update the artist's image in the database
      // For now, we'll just show a success message
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
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

        {/* Additional Artists Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">All Artists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {additionalArtists.map((artist) => (
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
