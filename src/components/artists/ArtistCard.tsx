
import React from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artist } from "@/data/types/artist";

interface ArtistCardProps {
  id: number;
  name: string;
  specialty: string;
  image: string;
  city?: string;
  country?: string;
  onSelect: (e: React.MouseEvent) => void;
  onRegenerateImage: (e: React.MouseEvent) => void;
  onFavoriteToggle: (isFavorite: boolean) => void;
  isFavorite: boolean;
  isFeatured?: boolean;
  bio: string;
  techniques?: string[];
  styles?: string[];
  social_platforms?: string[];
}

const ArtistCard = ({ 
  id, 
  name, 
  specialty, 
  image,
  city,
  country,
  onSelect, 
  onRegenerateImage,
  onFavoriteToggle,
  isFavorite,
  isFeatured = false,
  bio,
  techniques,
  styles,
  social_platforms
}: ArtistCardProps) => {
  const subdomain = `${name.toLowerCase().replace(/\s+/g, '')}.247.art`;
  const location = [city, country].filter(Boolean).join(", ");

  const handleRegenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    console.log("Regenerating artworks for:", name); // Add logging
    onRegenerateImage(e);
  };

  return (
    <div className="relative">
      <div 
        className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
        onClick={onSelect}
      >
        {/* Artist Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        {/* Artist Information - Visible on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div>
              <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold text-white mb-1`}>{name}</h3>
              <p className="text-white/80 text-sm mb-1">{specialty}</p>
              {location && (
                <p className="text-white/70 text-sm mb-1">{location}</p>
              )}
              <p className="text-white/60 text-base font-mono">{subdomain}</p>
            </div>
          </div>
        </div>

        {/* Favorite and Generate Buttons - Always visible at bottom */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={`${
              isFavorite 
                ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90' 
                : 'bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(!isFavorite);
            }}
          >
            <Zap size={isFeatured ? 24 : 20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRegenerateClick}
            className="bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white"
          >
            <Zap size={isFeatured ? 24 : 20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
