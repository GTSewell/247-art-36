
import React from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Artist } from "@/data/types/artist";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Linkedin, Twitter, RefreshCw, SaveAll } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArtistDetailsProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerateArtworks?: (artist: Artist) => Promise<void>;
}

const socialIcons = {
  Facebook: <Facebook className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  Twitter: <Twitter className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
};

const ArtistDetails = ({ artist, isOpen, onClose, onRegenerateArtworks }: ArtistDetailsProps) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  if (!artist) return null;

  const handleRegenerateArtworks = async () => {
    if (!onRegenerateArtworks || isGenerating || artist.locked_artworks) return;
    
    setIsGenerating(true);
    try {
      await onRegenerateArtworks(artist);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveArtworks = async () => {
    if (!artist.artworks || artist.artworks.length === 0) {
      toast.error("No artworks to save!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('artists')
        .update({ 
          locked_artworks: true,
          artworks: artist.artworks // Save the actual artworks array
        })
        .eq('id', artist.id);

      if (error) throw error;
      
      toast.success("Artworks saved successfully!");
      window.location.reload(); // Refresh to show updated state
    } catch (error) {
      console.error('Error saving artworks:', error);
      toast.error("Failed to save artworks");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] p-0 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ScrollArea className="h-full w-full rounded-md p-6">
          <SheetHeader className="mb-6">
            <div className="aspect-[3/2] w-full overflow-hidden rounded-lg">
              <img
                src={artist.image}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
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

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Artworks</h3>
                {!artist.locked_artworks && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveArtworks}
                      disabled={isSaving || !artist.artworks?.length}
                      className="flex items-center gap-2"
                    >
                      <SaveAll className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save All'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateArtworks}
                      disabled={isGenerating}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Generate Artworks'}
                    </Button>
                  </div>
                )}
              </div>
              {artist.artworks && artist.artworks.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {artist.artworks.map((artwork, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border/40">
                      <img
                        src={artwork}
                        alt={`Artwork ${index + 1} by ${artist.name}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">No artworks generated yet. Click the button above to generate some!</p>
              )}
            </div>

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

            {artist.social_platforms && artist.social_platforms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Social Media</h3>
                <div className="flex gap-4">
                  {artist.social_platforms.map((platform) => (
                    <button
                      key={platform}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        console.log(`Opening ${platform} profile`);
                      }}
                    >
                      {socialIcons[platform as keyof typeof socialIcons]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ArtistDetails;

