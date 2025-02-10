
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

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
  onUpdateSelection,
  onClearFilters,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold text-foreground">Featured Artists</h1>
      <Button 
        onClick={onClearFilters}
        variant="destructive"
        className="flex items-center gap-2"
      >
        <FilterX size={20} />
        Clear Filters
      </Button>
    </div>
  );
};

export default ArtistsHeader;

