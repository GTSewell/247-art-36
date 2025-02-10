
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import AtlasFilter from "@/components/artists/AtlasFilter";

interface ArtistsHeaderProps {
  artistSearch: string;
  setArtistSearch: (value: string) => void;
  locationSearch: string;
  setLocationSearch: (value: string) => void;
  techniqueSearch: string;
  setTechniqueSearch: (value: string) => void;
  styleSearch: string;
  setStyleSearch: (value: string) => void;
  selectedTechniques: string[];
  setSelectedTechniques: (techniques: string[]) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  selectedSocials: string[];
  setSelectedSocials: (socials: string[]) => void;
  onUpdateSelection: () => void;
  onClearFilters: () => void;
}

const ArtistsHeader: React.FC<ArtistsHeaderProps> = ({
  artistSearch,
  setArtistSearch,
  locationSearch,
  setLocationSearch,
  techniqueSearch,
  setTechniqueSearch,
  styleSearch,
  setStyleSearch,
  selectedTechniques,
  setSelectedTechniques,
  selectedStyles,
  setSelectedStyles,
  selectedSocials,
  setSelectedSocials,
  onUpdateSelection,
  onClearFilters,
}) => {
  const { theme, setTheme } = useTheme();

  return (
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
              onUpdateSelection={onUpdateSelection}
              onClearFilters={onClearFilters}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ArtistsHeader;
