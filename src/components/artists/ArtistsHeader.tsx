
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterX, Filter, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AtlasFilter from './AtlasFilter';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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
  allArtistsSearch: string;
  setAllArtistsSearch: (search: string) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
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
  allArtistsSearch,
  setAllArtistsSearch,
  showFavorites,
  setShowFavorites
}) => {
  // Check if any filters are active
  const hasActiveFilters = artistSearch.trim() !== '' || locationSearch.trim() !== '' || selectedTechniques.length > 0 || selectedStyles.length > 0 || selectedSocials.length > 0;
  return <div className="mb-8">
      {/* Desktop view - single line layout */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-foreground whitespace-nowrap">Featured Artists</h1>
        
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center space-x-2">
            <Checkbox id="showFavorites" checked={showFavorites} onCheckedChange={checked => setShowFavorites(checked as boolean)} className="data-[state=checked]:bg-zap-yellow data-[state=checked]:text-black" />
            <label htmlFor="showFavorites" className="text-sm font-medium leading-none cursor-pointer select-none whitespace-nowrap">
              View Favorite Artists
            </label>
          </div>
          
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search artists..." value={allArtistsSearch} onChange={e => setAllArtistsSearch(e.target.value)} className="pl-8" />
          </div>
          
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center gap-1 px-2 sm:px-4 sm:gap-2 bg-zap-yellow text-black whitespace-nowrap">
                  <Filter size={16} className="sm:size-5" />
                  <span className="text-sm sm:text-base">ATLAS</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <AtlasFilter artistSearch={artistSearch} setArtistSearch={setArtistSearch} locationSearch={locationSearch} setLocationSearch={setLocationSearch} techniqueSearch={techniqueSearch} setTechniqueSearch={setTechniqueSearch} styleSearch={styleSearch} setStyleSearch={setStyleSearch} selectedTechniques={selectedTechniques} setSelectedTechniques={setSelectedTechniques} selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles} selectedSocials={selectedSocials} setSelectedSocials={setSelectedSocials} onUpdateSelection={onUpdateSelection} onClearFilters={onClearFilters} />
              </SheetContent>
            </Sheet>
            {hasActiveFilters && <Button onClick={onClearFilters} variant="destructive" size="sm" className="flex items-center gap-1 px-2 sm:px-4 sm:gap-2">
                <FilterX size={16} className="sm:size-5" />
                <span className="text-sm sm:text-base">Clear</span>
              </Button>}
          </div>
        </div>
      </div>
      
      {/* Mobile view - stacked layout */}
      <div className="flex flex-col md:hidden gap-4">
        <h1 className="text-4xl font-bold text-foreground text-center">Featured Artists</h1>
        
        <div className="flex items-center justify-between gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="sm" className="flex items-center gap-1 px-2 sm:px-4 sm:gap-2 bg-zap-yellow text-black">
                <Filter size={16} className="sm:size-5" />
                <span className="text-sm sm:text-base">ATLAS</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <AtlasFilter artistSearch={artistSearch} setArtistSearch={setArtistSearch} locationSearch={locationSearch} setLocationSearch={setLocationSearch} techniqueSearch={techniqueSearch} setTechniqueSearch={setTechniqueSearch} styleSearch={styleSearch} setStyleSearch={setStyleSearch} selectedTechniques={selectedTechniques} setSelectedTechniques={setSelectedTechniques} selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles} selectedSocials={selectedSocials} setSelectedSocials={setSelectedSocials} onUpdateSelection={onUpdateSelection} onClearFilters={onClearFilters} />
            </SheetContent>
          </Sheet>
          {hasActiveFilters && <Button onClick={onClearFilters} variant="destructive" size="sm" className="flex items-center gap-1 px-2 sm:px-4 sm:gap-2">
              <FilterX size={16} className="sm:size-5" />
              <span className="text-sm sm:text-base">Clear</span>
            </Button>}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Checkbox id="showFavoritesMobile" checked={showFavorites} onCheckedChange={checked => setShowFavorites(checked as boolean)} className="data-[state=checked]:bg-zap-yellow data-[state=checked]:text-black" />
            <label htmlFor="showFavoritesMobile" className="text-sm font-medium leading-none cursor-pointer select-none">
              View Favorite Artists
            </label>
          </div>
          
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search artists..." value={allArtistsSearch} onChange={e => setAllArtistsSearch(e.target.value)} className="pl-8" />
          </div>
        </div>
      </div>
    </div>;
};
export default ArtistsHeader;
