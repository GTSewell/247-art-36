
import React, { useState } from 'react';
import { Artist } from '@/data/types/artist';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ArtistSocialSection from './ArtistSocialSection';
import ArtistArtworksSection from './ArtistArtworksSection';
import GenerateArtistImage from './GenerateArtistImage';

interface ArtistDetailsPanelProps {
  artist: Artist;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  isFavorite?: boolean;
  onSelect?: (artist: Artist) => void;
  onClose?: (e?: React.MouseEvent) => void;
}

const ArtistDetailsPanel = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite = false,
  onSelect,
  onClose
}: ArtistDetailsPanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const location = artist.city && artist.country 
    ? `${artist.city}, ${artist.country}` 
    : artist.city || artist.country || '';

  return (
    <div className="flex flex-col space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{artist.name}</CardTitle>
          <CardDescription>{artist.specialty}</CardDescription>
          {location && (
            <CardDescription className="text-sm text-muted-foreground">{location}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {artist.bio && (
            <p className="text-sm mb-4">{artist.bio}</p>
          )}
          
          <GenerateArtistImage artist={artist} />
          
          {/* Techniques */}
          {artist.techniques && artist.techniques.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold">Techniques</h4>
              <div className="flex flex-wrap gap-2">
                {artist.techniques.map((technique, index) => (
                  <Badge key={index} variant="outline" className="bg-accent text-accent-foreground">
                    {technique}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Styles */}
          {artist.styles && artist.styles.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Styles</h4>
              <div className="flex flex-wrap gap-2">
                {artist.styles.map((style, index) => (
                  <Badge key={index} variant="outline" className="bg-accent text-accent-foreground">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {onSelect && (
            <button 
              onClick={() => onSelect(artist)}
              className="text-sm text-primary hover:underline"
            >
              View Full Profile
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Close
            </button>
          )}
        </CardFooter>
      </Card>
      
      <Separator />
      
      {/* Social Media Presence */}
      <ArtistSocialSection socialPlatforms={artist.social_platforms} />
      
      {/* Artworks Section */}
      <ArtistArtworksSection 
        artist={artist} 
        isGenerating={isGenerating}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        onRegenerateArtworks={async () => {
          setIsGenerating(true);
          // Normally would have implementation here
          setTimeout(() => setIsGenerating(false), 2000);
        }}
      />
    </div>
  );
};

export default ArtistDetailsPanel;
