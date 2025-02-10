
import React from "react";
import { Zap } from "lucide-react";
import { Artist } from "@/data/types/artist";
import { Button } from "@/components/ui/button";

interface ArtistDetailsHeaderProps {
  artist: Artist;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const ArtistDetailsHeader = ({ artist, onFavoriteToggle, isFavorite }: ArtistDetailsHeaderProps) => {
  return (
    <div className="relative">
      <div className="aspect-[3/2] w-full overflow-hidden rounded-lg">
        <img
          src={artist.image}
          alt={artist.name}
          className="h-full w-full object-cover"
        />
      </div>
      {onFavoriteToggle && (
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 z-10 ${
            isFavorite
              ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90'
              : 'bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(artist.id, !isFavorite);
          }}
        >
          <Zap size={24} />
        </Button>
      )}
    </div>
  );
};

export default ArtistDetailsHeader;
