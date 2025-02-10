
import React from "react";
import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artTechniques, artworkStyles, socialPlatforms } from "@/data/filters";

interface AtlasFilterProps {
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

const AtlasFilter = ({
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
}: AtlasFilterProps) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">ATLAS Filter</h2>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6">
          {/* Artist Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Location Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Technique Search and Checkboxes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Technique</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search techniques..."
                value={techniqueSearch}
                onChange={(e) => setTechniqueSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="h-40">
              <div className="grid grid-cols-2 gap-2">
                {artTechniques.map((technique) => (
                  <label key={technique} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTechniques.includes(technique)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTechniques([...selectedTechniques, technique]);
                        } else {
                          setSelectedTechniques(selectedTechniques.filter(t => t !== technique));
                        }
                      }}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{technique}</span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Artwork Styles Search and Checkboxes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Artwork Styles</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search styles..."
                value={styleSearch}
                onChange={(e) => setStyleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="h-40">
              <div className="grid grid-cols-2 gap-2">
                {artworkStyles.map((style) => (
                  <label key={style} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(style)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStyles([...selectedStyles, style]);
                        } else {
                          setSelectedStyles(selectedStyles.filter(s => s !== style));
                        }
                      }}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{style}</span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Social Media Platforms */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Social Media Presence</label>
            <ScrollArea className="h-40">
              <div className="grid grid-cols-2 gap-2">
                {socialPlatforms.map((platform) => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSocials.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSocials([...selectedSocials, platform]);
                        } else {
                          setSelectedSocials(selectedSocials.filter(s => s !== platform));
                        }
                      }}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>
      <div className="pt-4 border-t space-y-2">
        <Button 
          onClick={onUpdateSelection}
          className="w-full"
          variant="default"
        >
          Update Selection
        </Button>
        <Button 
          onClick={onClearFilters}
          className="w-full"
          variant="destructive"
        >
          <FilterX size={20} className="mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default AtlasFilter;
