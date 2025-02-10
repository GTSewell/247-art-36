
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
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold text-foreground">Featured Artists</h1>
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Filter size={20} />
              ATLAS Filter
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
        <Button 
          onClick={onClearFilters}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <FilterX size={20} />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ArtistsHeader;
