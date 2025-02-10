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
    {
      id: 9,
      name: "Olivia Brown",
      specialty: "Contemporary Art",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      bio: "Pushing boundaries in contemporary expression.",
      location: "Berlin, Germany",
    },
    {
      id: 10,
      name: "Liam Anderson",
      specialty: "Digital Illustration",
      image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=800&q=80",
      bio: "Blending traditional art with digital innovation.",
      location: "Toronto, Canada",
    },
    {
      id: 11,
      name: "Isabella Martinez",
      specialty: "Watercolor",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      bio: "Creating dreamy landscapes in watercolor.",
      location: "Madrid, Spain",
    },
    {
      id: 12,
      name: "Lucas Kim",
      specialty: "Urban Sketching",
      image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80",
      bio: "Documenting city life through quick sketches.",
      location: "Seoul, South Korea",
    },
    {
      id: 13,
      name: "Sofia Patel",
      specialty: "Mixed Media Collage",
      image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&q=80",
      bio: "Creating stories through layered artworks.",
      location: "Mumbai, India",
    },
    {
      id: 14,
      name: "Noah Thompson",
      specialty: "Minimalist Art",
      image: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?w=800&q=80",
      bio: "Finding beauty in simplicity.",
      location: "Stockholm, Sweden",
    },
    {
      id: 15,
      name: "Ava Williams",
      specialty: "Pop Art",
      image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&q=80",
      bio: "Reimagining pop culture through art.",
      location: "Los Angeles, USA",
    },
    {
      id: 16,
      name: "Ethan Davis",
      specialty: "Nature Photography",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
      bio: "Capturing Earth's natural wonders.",
      location: "Vancouver, Canada",
    },
    {
      id: 17,
      name: "Mia Nakamura",
      specialty: "Anime Art",
      image: "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800&q=80",
      bio: "Bringing Japanese animation style to life.",
      location: "Tokyo, Japan",
    },
    {
      id: 18,
      name: "William Foster",
      specialty: "Abstract Photography",
      image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&q=80",
      bio: "Finding abstract beauty in everyday scenes.",
      location: "Sydney, Australia",
    },
    {
      id: 19,
      name: "Charlotte Lee",
      specialty: "Textile Art",
      image: "https://images.unsplash.com/photo-1505968409348-bd000797c92e?w=800&q=80",
      bio: "Weaving stories through fabric and thread.",
      location: "Hong Kong",
    },
    {
      id: 20,
      name: "Benjamin Moore",
      specialty: "Landscape Photography",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
      bio: "Capturing nature's grand vistas.",
      location: "Edinburgh, UK",
    },
    {
      id: 21,
      name: "Aria Johnson",
      specialty: "Glass Art",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
      bio: "Transforming glass into ethereal art pieces.",
      location: "Venice, Italy",
    },
    {
      id: 22,
      name: "Leo Zhang",
      specialty: "Digital Animation",
      image: "https://images.unsplash.com/photo-1506901437675-cde80ff9c746?w=800&q=80",
      bio: "Creating moving digital masterpieces.",
      location: "Shanghai, China",
    },
    {
      id: 23,
      name: "Luna Garcia",
      specialty: "Ceramic Art",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
      bio: "Crafting stories in clay and glaze.",
      location: "Barcelona, Spain",
    },
    {
      id: 24,
      name: "Oliver White",
      specialty: "Street Photography",
      image: "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=800&q=80",
      bio: "Documenting urban life and culture.",
      location: "Amsterdam, Netherlands",
    },
    {
      id: 25,
      name: "Sophia Anderson",
      specialty: "Portrait Photography",
      image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80",
      bio: "Capturing the essence of humanity.",
      location: "Copenhagen, Denmark",
    },
    {
      id: 26,
      name: "Gabriel Santos",
      specialty: "Graffiti Art",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
      bio: "Making streets come alive with color.",
      location: "São Paulo, Brazil",
    },
    {
      id: 27,
      name: "Nina Petrova",
      specialty: "Oil Painting",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      bio: "Creating timeless pieces in oil.",
      location: "Moscow, Russia",
    },
    {
      id: 28,
      name: "Oscar Martinez",
      specialty: "Wildlife Photography",
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
      bio: "Capturing nature's wild beauty.",
      location: "Santiago, Chile",
    },
    {
      id: 29,
      name: "Zoe Wilson",
      specialty: "Textile Design",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
      bio: "Creating patterns that tell stories.",
      location: "Dublin, Ireland",
    },
    {
      id: 30,
      name: "Hugo Bernard",
      specialty: "Fashion Photography",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
      bio: "Capturing style in motion.",
      location: "Paris, France",
    },
    {
      id: 31,
      name: "Eva Kowalski",
      specialty: "Installation Art",
      image: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=800&q=80",
      bio: "Creating immersive art experiences.",
      location: "Warsaw, Poland",
    },
    {
      id: 32,
      name: "Sebastian Muller",
      specialty: "Architectural Photography",
      image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80",
      bio: "Documenting architectural wonders.",
      location: "Munich, Germany",
    },
    {
      id: 33,
      name: "Isabel Silva",
      specialty: "Printmaking",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80",
      bio: "Creating art through traditional printing techniques.",
      location: "Lisbon, Portugal",
    },
    {
      id: 34,
      name: "Felix Chang",
      specialty: "Digital Art",
      image: "https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=800&q=80",
      bio: "Pushing boundaries in digital creation.",
      location: "Taipei, Taiwan",
    },
    {
      id: 35,
      name: "Maya Patel",
      specialty: "Mandala Art",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      bio: "Creating geometric patterns of harmony.",
      location: "New Delhi, India",
    },
    {
      id: 36,
      name: "Thomas Anderson",
      specialty: "Night Photography",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
      bio: "Capturing the magic of night scenes.",
      location: "Oslo, Norway",
    },
    {
      id: 37,
      name: "Lily Chen",
      specialty: "Ink Painting",
      image: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&q=80",
      bio: "Merging traditional and modern ink techniques.",
      location: "Singapore",
    },
    {
      id: 38,
      name: "Arthur Lambert",
      specialty: "Food Photography",
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
      bio: "Making culinary art through the lens.",
      location: "Brussels, Belgium",
    },
    {
      id: 39,
      name: "Elena Popov",
      specialty: "Abstract Painting",
      image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236?w=800&q=80",
      bio: "Expressing emotions through abstract forms.",
      location: "St. Petersburg, Russia",
    },
    {
      id: 40,
      name: "Ryan O'Connor",
      specialty: "Documentary Photography",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      bio: "Telling stories through the lens.",
      location: "Dublin, Ireland",
    },
    {
      id: 41,
      name: "Yuki Tanaka",
      specialty: "Origami Art",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80",
      bio: "Transforming paper into art.",
      location: "Kyoto, Japan",
    },
    {
      id: 42,
      name: "Clara Mendoza",
      specialty: "Mosaic Art",
      image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80",
      bio: "Creating stories piece by piece.",
      location: "Buenos Aires, Argentina",
    },
    {
      id: 43,
      name: "Amir Hassan",
      specialty: "Calligraphy",
      image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
      bio: "Bringing words to life through art.",
      location: "Dubai, UAE",
    },
    {
      id: 44,
      name: "Ingrid Larsson",
      specialty: "Nature Art",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      bio: "Creating art with natural materials.",
      location: "Stockholm, Sweden",
    },
    {
      id: 45,
      name: "Diego Morales",
      specialty: "Surreal Photography",
      image: "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?w=800&q=80",
      bio: "Capturing dreams through the lens.",
      location: "Mexico City, Mexico",
    },
    {
      id: 46,
      name: "Anna Kowalczyk",
      specialty: "Folk Art",
      image: "https://images.unsplash.com/photo-1472806426350-603610d85659?w=800&q=80",
      bio: "Preserving cultural heritage through art.",
      location: "Krakow, Poland",
    },
    {
      id: 47,
      name: "Mohammed Al-Sayed",
      specialty: "Islamic Art",
      image: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=800&q=80",
      bio: "Creating geometric patterns inspired by tradition.",
      location: "Cairo, Egypt",
    },
    {
      id: 48,
      name: "Julieta Torres",
      specialty: "Textile Sculpture",
      image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80",
      bio: "Sculpting stories with fabric and thread.",
      location: "Lima, Peru",
    },
    {
      id: 49,
      name: "Lars Nielsen",
      specialty: "Light Art",
      image: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=800&q=80",
      bio: "Painting with light and shadow.",
      location: "Copenhagen, Denmark",
    },
    {
      id: 50,
      name: "Mei Wong",
      specialty: "Paper Art",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      bio: "Creating delicate sculptures from paper.",
      location: "Hong Kong",
    },
    {
      id: 51,
      name: "Pietro Romano",
      specialty: "Fresco Painting",
      image: "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?w=800&q=80",
      bio: "Reviving ancient fresco techniques.",
      location: "Florence, Italy",
    }
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
