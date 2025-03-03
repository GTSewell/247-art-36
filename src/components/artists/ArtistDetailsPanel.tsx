
import React from 'react';
import { Artist } from '@/data/types/artist';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ArtistSocialSection from './ArtistSocialSection';
import ArtistArtworksSection from './ArtistArtworksSection';
import GenerateArtistImage from './GenerateArtistImage';

interface ArtistDetailsPanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
}

const ArtistDetailsPanel = ({ artist, onFavoriteToggle, isFavorite }: ArtistDetailsPanelProps) => {
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
          {/* Additional content could go here */}
        </CardFooter>
      </Card>
      
      <Separator />
      
      {/* Social Media Presence */}
      <ArtistSocialSection artist={artist} />
      
      {/* Artworks Section */}
      <ArtistArtworksSection artist={artist} />
    </div>
  );
};

export default ArtistDetailsPanel;
