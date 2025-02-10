
import React from "react";
import { Eye } from "lucide-react";

interface ArtistCardProps {
  id: number;
  name: string;
  specialty: string;
  image: string;
  onSelect: (id: number) => void;
  isFeatured?: boolean;
}

const ArtistCard = ({ id, name, specialty, image, onSelect, isFeatured = false }: ArtistCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className={`absolute bottom-0 left-0 right-0 p-${isFeatured ? '6' : '4'}`}>
          <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold text-white mb-1`}>{name}</h3>
          <p className="text-white/80 text-sm mb-3">{specialty}</p>
          <button 
            onClick={() => onSelect(id)}
            className={`flex items-center gap-2 px-${isFeatured ? '4' : '3'} py-${isFeatured ? '2' : '1.5'} ${!isFeatured && 'text-sm'} rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors`}
          >
            <Eye size={isFeatured ? 20 : 16} />
            <span>View Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
