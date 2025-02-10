
import React from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Artist } from "@/data/types/artist";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtistDetailsProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
}

const socialIcons = {
  Facebook: <Facebook className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  Twitter: <Twitter className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
};

const ArtistDetails = ({ artist, isOpen, onClose }: ArtistDetailsProps) => {
  if (!artist) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] p-0 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
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

          <div className="space-y-6">
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
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{artist.bio}</p>
            </div>

            {artist.techniques && artist.techniques.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Techniques</h3>
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
                <h3 className="font-semibold mb-2">Styles</h3>
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
                <h3 className="font-semibold mb-2">Social Media</h3>
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
