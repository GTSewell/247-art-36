
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';

interface ArtistProfileRightPanelProps {
  artist: Artist;
  artworks: string[];
  panelColor: string;
  textColor?: string;
}

const ArtistProfileRightPanel: React.FC<ArtistProfileRightPanelProps> = ({
  artist,
  artworks,
  panelColor,
  textColor = '#000000'
}) => {
  const isMobile = useIsMobile();
  
  // If no artworks are provided, display placeholder images
  const displayArtworks = artworks.length > 0 
    ? artworks 
    : Array(4).fill('/placeholder.svg');
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      {/* Only show the header section on mobile */}
      {isMobile && (
        <div className="flex items-start mb-4">
          <div className="mr-4">
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <img 
                src={artist.image || '/placeholder.svg'} 
                alt={artist.name || 'Artist'} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: textColor }}>{artist.name}</h2>
            <p className="text-sm" style={{ color: `${textColor}99` }}>{artist.specialty}</p>
            <p className="text-xs" style={{ color: `${textColor}77` }}>
              {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
            </p>
          </div>
        </div>
      )}
      
      {/* Artworks Section with ScrollArea */}
      <div className="flex-grow overflow-hidden">
        <h3 className="text-base font-bold mb-3" style={{ color: textColor }}>Featured Artworks</h3>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="flex flex-col space-y-4 pr-4 pb-4">
            {displayArtworks.map((artwork, index) => (
              <div 
                key={index}
                className="min-h-fit rounded-md overflow-hidden shadow-sm"
              >
                <img 
                  src={artwork} 
                  alt={`Artwork ${index + 1}`}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ArtistProfileRightPanel;
