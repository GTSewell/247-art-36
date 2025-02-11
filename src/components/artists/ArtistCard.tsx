
import React, { useState, useRef, useEffect } from "react";
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
  artworks?: string[];
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
  social_platforms,
  artworks = []
}: ArtistCardProps) => {
  const [rotateY, setRotateY] = useState(0);
  const rotateTimeout = useRef<NodeJS.Timeout | null>(null);
  const subdomain = `${name.toLowerCase().replace(/\s+/g, '')}.247.art`;
  const location = [city, country].filter(Boolean).join(", ");

  const handleMouseEnter = () => {
    if (rotateTimeout.current) {
      clearInterval(rotateTimeout.current);
    }
    
    rotateTimeout.current = setInterval(() => {
      setRotateY(prev => {
        if (prev >= 180) {
          if (rotateTimeout.current) {
            clearInterval(rotateTimeout.current);
          }
          return 180;
        }
        return prev + 3;
      });
    }, 16); // approximately 60fps
  };

  const handleMouseLeave = () => {
    if (rotateTimeout.current) {
      clearInterval(rotateTimeout.current);
    }
    
    rotateTimeout.current = setInterval(() => {
      setRotateY(prev => {
        if (prev <= 0) {
          if (rotateTimeout.current) {
            clearInterval(rotateTimeout.current);
          }
          return 0;
        }
        return prev - 6; // Return to original position faster
      });
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (rotateTimeout.current) {
        clearInterval(rotateTimeout.current);
      }
    };
  }, []);

  return (
    <div className="relative preserve-3d" style={{ perspective: '1000px' }}>
      <div 
        className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
        onClick={onSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s linear'
        }}
      >
        {/* Front face */}
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
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
        </div>

        {/* Back face - Artworks Grid */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="p-3 h-full">
            <div className="grid grid-cols-2 gap-2 h-full">
              {artworks && artworks.length > 0 ? (
                artworks.slice(0, 4).map((artwork, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img
                      src={artwork}
                      alt={`Artwork ${index + 1} by ${name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500 italic">No artworks available</p>
                </div>
              )}
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500 truncate">{specialty}</p>
            </div>
          </div>
        </div>

        {/* Favorite Button - Always visible at bottom right */}
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
  );
};

export default ArtistCard;
