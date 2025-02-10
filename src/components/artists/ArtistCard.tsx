
import React from "react";
import { RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ArtistCardProps {
  id: number;
  name: string;
  specialty: string;
  image: string;
  onSelect: (id: number) => void;
  onRegenerateImage: () => void;
  onFavoriteToggle: (isFavorite: boolean) => void;
  isFavorite: boolean;
  isFeatured?: boolean;
}

const ArtistCard = ({ 
  id, 
  name, 
  specialty, 
  image, 
  onSelect, 
  onRegenerateImage,
  onFavoriteToggle,
  isFavorite,
  isFeatured = false 
}: ArtistCardProps) => {
  const subdomain = `${name.toLowerCase().replace(/\s+/g, '')}.247.art`;

  return (
    <div className="relative">
      <div className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Favorite Button - Always visible */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 z-[100] ${
            isFavorite 
              ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90' 
              : 'bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white'
          }`}
          onClick={() => onFavoriteToggle(!isFavorite)}
        >
          <Zap size={isFeatured ? 24 : 20} />
        </Button>

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
          <div className={`absolute bottom-0 left-0 right-0 p-${isFeatured ? '6' : '4'}`}>
            <div>
              <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold text-white mb-1`}>{name}</h3>
              <p className="text-white/80 text-sm mb-1">{specialty}</p>
              <p className="text-white/60 text-base mb-3 font-mono">{subdomain}</p>
              <Button
                variant="secondary"
                size={isFeatured ? "default" : "sm"}
                onClick={onRegenerateImage}
              >
                <RefreshCw size={isFeatured ? 20 : 16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
