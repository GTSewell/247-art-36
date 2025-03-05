
import React from "react";
import { Artist } from "@/data/types/artist";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistDetailsHeader from "./ArtistDetailsHeader";
import ArtistArtworksSection from "./ArtistArtworksSection";
import ArtistSocialSection from "./ArtistSocialSection";

interface ArtistDetailsProps {
  artist: Artist | null;
  isOpen?: boolean;
  onClose: () => void;
  onRegenerateArtworks?: (artist: Artist) => Promise<void>;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const ArtistDetails = ({ 
  artist, 
  isOpen = true,
  onClose, 
  onRegenerateArtworks,
  onFavoriteToggle,
  isFavorite 
}: ArtistDetailsProps) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  if (!artist) return null;

  // Parse techniques, styles, and social_platforms if they're strings
  const techniques = Array.isArray(artist.techniques) 
    ? artist.techniques 
    : typeof artist.techniques === 'string' && artist.techniques
      ? JSON.parse(artist.techniques)
      : [];
  
  const styles = Array.isArray(artist.styles) 
    ? artist.styles 
    : typeof artist.styles === 'string' && artist.styles
      ? JSON.parse(artist.styles)
      : [];
  
  const socialPlatforms = Array.isArray(artist.social_platforms) 
    ? artist.social_platforms 
    : typeof artist.social_platforms === 'string' && artist.social_platforms
      ? JSON.parse(artist.social_platforms)
      : [];

  const handleRegenerateArtworks = async (artist: Artist) => {
    if (!onRegenerateArtworks || isGenerating || artist.locked_artworks) return;
    
    setIsGenerating(true);
    try {
      await onRegenerateArtworks(artist);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollArea className="h-[80vh] md:h-[70vh]">
      <div className="p-6">
        <ArtistDetailsHeader 
          artist={artist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
        />

        <div className="space-y-8 mt-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{artist.name}</h2>
            <p className="text-muted-foreground">{artist.specialty}</p>
            {(artist.city || artist.country) && (
              <p className="text-sm text-muted-foreground mt-1">
                {[artist.city, artist.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{artist.bio}</p>
          </div>

          <ArtistArtworksSection 
            artist={artist}
            onRegenerateArtworks={handleRegenerateArtworks}
            isGenerating={isGenerating}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />

          {techniques && techniques.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Techniques</h3>
              <div className="flex flex-wrap gap-2">
                {techniques.map((technique: string) => (
                  <Badge
                    key={technique}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {technique}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {styles && styles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Styles</h3>
              <div className="flex flex-wrap gap-2">
                {styles.map((style: string) => (
                  <Badge
                    key={style}
                    variant="outline"
                    className="rounded-full"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <ArtistSocialSection socialPlatforms={socialPlatforms} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default ArtistDetails;
