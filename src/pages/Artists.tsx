
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { Eye, FilterX, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { featuredArtists, additionalArtists } from "@/data/artists";

// Common art techniques
const artTechniques = [
  "Oil Painting", "Watercolor", "Acrylic", "Digital Art", "Photography",
  "Sculpture", "Printmaking", "Drawing", "Mixed Media", "Collage",
  "Ceramics", "Textile Art", "Street Art", "Installation", "Performance",
  "Video Art", "Glasswork", "Metalwork", "Wood Carving", "Lithography"
];

// Common artwork styles
const artworkStyles = [
  "Abstract", "Realism", "Impressionism", "Surrealism", "Pop Art",
  "Minimalism", "Contemporary", "Modern", "Traditional", "Folk Art",
  "Gothic", "Renaissance", "Baroque", "Art Nouveau", "Art Deco",
  "Expressionism", "Cubism", "Digital", "Urban", "Conceptual"
];

// Social media platforms
const socialPlatforms = [
  "Instagram", "Twitter", "Facebook", "YouTube", "TikTok",
  "DeviantArt", "ArtStation", "Behance", "LinkedIn", "Pinterest"
];

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [artistSearch, setArtistSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [techniqueSearch, setTechniqueSearch] = useState("");
  const [styleSearch, setStyleSearch] = useState("");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />
      
      <div className="container mx-auto pt-20 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Featured Artists</h1>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <SlidersHorizontal size={20} />
                <span>ATLAS</span>
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">ATLAS Filter</h2>
                <div className="flex-1 overflow-auto">
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
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
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
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
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
                    </div>

                    {/* Social Media Platforms */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Social Media Presence</label>
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
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button 
                    onClick={() => {
                      setArtistSearch("");
                      setLocationSearch("");
                      setTechniqueSearch("");
                      setStyleSearch("");
                      setSelectedTechniques([]);
                      setSelectedStyles([]);
                      setSelectedSocials([]);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    <FilterX size={20} />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Featured Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredArtists.map((artist) => (
            <div
              key={artist.id}
              className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
                  <p className="text-white/80 text-sm mb-3">{artist.specialty}</p>
                  <button 
                    onClick={() => setSelectedArtist(artist.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Eye size={20} />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Artists Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">All Artists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {additionalArtists.map((artist) => (
              <div
                key={artist.id}
                className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{artist.name}</h3>
                    <p className="text-white/80 text-sm mb-2">{artist.specialty}</p>
                    <button 
                      onClick={() => setSelectedArtist(artist.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Eye size={16} />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artists;
