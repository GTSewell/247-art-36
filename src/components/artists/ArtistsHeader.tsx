
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterX, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import AtlasFilter from './AtlasFilter';

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
  // Check if any filters are active
  const hasActiveFilters = 
    artistSearch.trim() !== '' || 
    locationSearch.trim() !== '' || 
    selectedTechniques.length > 0 || 
    selectedStyles.length > 0 || 
    selectedSocials.length > 0;

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center md:items-center mb-8">
      <h1 className="text-4xl font-bold text-foreground mb-4 md:mb-0 text-center md:text-left">Featured Artists</h1>
      <div className="flex items-center gap-2 self-center md:self-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-1 px-2 sm:px-4 sm:gap-2 bg-zap-yellow text-black">
              <Filter size={16} className="sm:size-5" />
              <span className="text-sm sm:text-base">ATLAS</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
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
        {hasActiveFilters && (
          <Button 
            onClick={onClearFilters}
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 px-2 sm:px-4 sm:gap-2"
          >
            <FilterX size={16} className="sm:size-5" />
            <span className="text-sm sm:text-base">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArtistsHeader;
