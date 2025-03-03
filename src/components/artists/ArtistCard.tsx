
import React, { useState, useEffect } from "react";
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
  const [imageError, setImageError] = useState(false);
  const [displayImage, setDisplayImage] = useState(image);
  const [retryCount, setRetryCount] = useState(0);
  
  // Expanded fallback images list for more diversity
  const fallbackImages = [
    '/placeholder.svg',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd',
    'https://images.unsplash.com/photo-1561948955-570b270e7c36',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7',
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb'
  ];

  useEffect(() => {
    // Reset state when image prop changes
    setImageError(false);
    setDisplayImage(image);
    setRetryCount(0);
  }, [image]);
  
  const getNextFallbackImage = (): string => {
    // Create a deterministic but varied selection based on artist id
    const index = (id + retryCount) % fallbackImages.length;
    return fallbackImages[index];
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Artist card image failed to load:", displayImage);
    
    // If we've tried the original image and it failed, try a fallback
    if (retryCount < 2) {
      setRetryCount(prevCount => prevCount + 1);
      
      // If the image URL contains runware.ai (which seems to be failing consistently)
      // immediately use a fallback image instead of retrying
      if (displayImage.includes('runware.ai') || displayImage.includes('im.runware')) {
        setImageError(true);
        setDisplayImage(getNextFallbackImage());
        return;
      }
      
      // If it's not a runware URL but still failed, try with cache busting
      if (!displayImage.includes('unsplash.com')) {
        const newUrl = displayImage.includes('?') 
          ? `${displayImage}&retry=${retryCount}` 
          : `${displayImage}?retry=${retryCount}`;
        setDisplayImage(newUrl);
      } else {
        // If it's unsplash and still failed, use a different fallback
        setImageError(true);
        setDisplayImage(getNextFallbackImage());
      }
    } else {
      // If we've already retried twice, use fallback image
      setImageError(true);
      setDisplayImage(getNextFallbackImage());
    }
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
            src={displayImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
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

        {/* Favorite Button - Always visible at bottom */}
        <div className="absolute bottom-4 right-4 z-10">
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
            title="Favorite"
          >
            <Zap size={isFeatured ? 24 : 20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
