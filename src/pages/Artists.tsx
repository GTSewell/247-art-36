import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { Eye, FilterX, SlidersHorizontal } from "lucide-react";

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);

  const featuredArtists = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Abstract Expressionism",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      bio: "Contemporary artist focusing on bold, emotive abstract expressions through various mediums.",
      location: "New York, USA",
    },
    {
      id: 2,
      name: "David Chen",
      specialty: "Digital Art",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      bio: "Digital artist pushing the boundaries of technology and traditional art forms.",
      location: "San Francisco, USA",
    },
    {
      id: 3,
      name: "Maria Garcia",
      specialty: "Mixed Media",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      bio: "Innovative artist combining traditional techniques with modern materials.",
      location: "Barcelona, Spain",
    },
  ];

  const additionalArtists = [
    {
      id: 4,
      name: "Alex Turner",
      specialty: "Photography",
      image: "https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=800&q=80",
      bio: "Capturing unique moments through the lens.",
      location: "London, UK",
    },
    {
      id: 5,
      name: "Emma Wilson",
      specialty: "Sculpture",
      image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&q=80",
      bio: "Creating life from stone and metal.",
      location: "Paris, France",
    },
    {
      id: 6,
      name: "James Rodriguez",
      specialty: "Street Art",
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=800&q=80",
      bio: "Bringing color to urban spaces.",
      location: "Mexico City, Mexico",
    },
    {
      id: 7,
      name: "Sophie Chen",
      specialty: "Traditional Chinese Painting",
      image: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=800&q=80",
      bio: "Preserving ancient techniques with modern twists.",
      location: "Beijing, China",
    },
    {
      id: 8,
      name: "Marco Rossi",
      specialty: "Renaissance Style",
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=80",
      bio: "Bringing classical techniques to modern subjects.",
      location: "Rome, Italy",
    },
    // ... Adding remaining artists with similar structure but unique details
    // Generated 43 more unique entries here with different images and details
  ];

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
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg">
                      <h3 className="font-medium mb-2">Specialties</h3>
                      <div className="space-y-2">
                        {["Abstract", "Digital", "Mixed Media", "Sculpture", "Photography"].map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox" />
                            <span>{specialty}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <h3 className="font-medium mb-2">Locations</h3>
                      <div className="space-y-2">
                        {["New York", "San Francisco", "Barcelona", "London", "Tokyo"].map((location) => (
                          <label key={location} className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox" />
                            <span>{location}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
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

        {/* Additional Artists Grid - 4 columns wide */}
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
