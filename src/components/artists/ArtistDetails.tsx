
import React from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Artist } from "@/data/types/artist";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistDetailsHeader from "./ArtistDetailsHeader";
import ArtistArtworksSection from "./ArtistArtworksSection";
import ArtistSocialSection from "./ArtistSocialSection";

interface ArtistDetailsProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerateArtworks?: (artist: Artist) => Promise<void>;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const ArtistDetails = ({ 
  artist, 
  isOpen, 
  onClose, 
  onRegenerateArtworks,
  onFavoriteToggle,
  isFavorite 
}: ArtistDetailsProps) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  if (!artist) return null;

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] p-0 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ScrollArea className="h-full w-full rounded-md p-6">
          <SheetHeader className="mb-6">
            <ArtistDetailsHeader 
              artist={artist}
              onFavoriteToggle={onFavoriteToggle}
              isFavorite={isFavorite}
            />
          </SheetHeader>

          <div className="space-y-8">
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

            {artist.techniques && artist.techniques.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Techniques</h3>
                <div className="flex flex-wrap gap-2">
                  {artist.techniques.map((technique) => (
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

            {artist.styles && artist.styles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {artist.styles.map((style) => (
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

            <ArtistSocialSection socialPlatforms={artist.social_platforms} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ArtistDetails;
