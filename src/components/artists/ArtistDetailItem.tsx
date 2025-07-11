
import React from "react";
import { Artist } from "@/data/types/artist";
import { CarouselItem } from "@/components/ui/carousel";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import { useColorTheme } from "@/hooks/useColorTheme";

interface ArtistDetailItemProps {
  artist: Artist;
  processedArtist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists: () => void;
  onSelect: (artist: Artist) => void;
}

const ArtistDetailItem: React.FC<ArtistDetailItemProps> = ({
  artist,
  processedArtist,
  onFavoriteToggle,
  isFavorite,
  refreshArtists,
  onSelect
}) => {
  // Get artworks array from the processed artist
  const artworks = Array.isArray(processedArtist.artworks) 
    ? processedArtist.artworks 
    : typeof processedArtist.artworks === 'string' && processedArtist.artworks
      ? JSON.parse(processedArtist.artworks).slice(0, 4)
      : [];
      
  // Generate a color theme for this specific artist
  const profile = { 
    id: '',
    artist_id: String(processedArtist.id),
    background_image: artworks[0] || null,
    background_color: '#f7cf1e',
    panel_color: '#ffffff',
    links: []
  };
  
  const { colorTheme } = useColorTheme(processedArtist, profile, artworks);
  
  return (
    <CarouselItem className="pl-0 sm:pl-2 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4" style={{ backgroundColor: colorTheme.panel }}>
        <div className="aspect-square md:aspect-auto md:h-auto">
          <ArtistImagePanel 
            artist={processedArtist}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
            refreshArtists={refreshArtists}
          />
        </div>
        <div className="aspect-auto md:h-auto">
          <ArtistDetailsPanel 
            artist={processedArtist}
            onSelect={() => onSelect(artist)}
            onFavoriteToggle={(artistId, isFavorite) => onFavoriteToggle(artistId, isFavorite)}
            isFavorite={isFavorite}
            onClose={(e) => {
              e.stopPropagation();
            }}
            colorTheme={colorTheme}
            showReturnButton={false}
          />
        </div>
      </div>
    </CarouselItem>
  );
};

export default ArtistDetailItem;
