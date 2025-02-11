
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

  return (
    <div className="group relative h-full">
      <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
          <div className="relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
            {/* Artist Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Front overlay - Visible on hover */}
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

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute bottom-4 right-4 z-10 ${
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
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]"
          onClick={onSelect}
        >
          <div className="h-full rounded-lg bg-card shadow-lg p-4 flex flex-col justify-between">
            <div>
              <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold mb-2`}>{name}</h3>
              <p className="text-sm text-gray-600 mb-2">{bio}</p>
              {techniques && techniques.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-sm font-semibold mb-1">Techniques:</h4>
                  <div className="flex flex-wrap gap-1">
                    {techniques.map((technique, index) => (
                      <span key={index} className="text-xs bg-gray-100 rounded-full px-2 py-1">{technique}</span>
                    ))}
                  </div>
                </div>
              )}
              {styles && styles.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-sm font-semibold mb-1">Styles:</h4>
                  <div className="flex flex-wrap gap-1">
                    {styles.map((style, index) => (
                      <span key={index} className="text-xs bg-gray-100 rounded-full px-2 py-1">{style}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {location && (
              <p className="text-sm text-gray-500 mt-auto">{location}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;

