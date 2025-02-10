
import React from 'react';
import { Artist } from '@/data/types/artist';

interface ArtistsFilterProps {
  artists: Artist[];
  allArtistsSearch: string;
  locationSearch: string;
  selectedTechniques: string[];
  selectedStyles: string[];
  selectedSocials: string[];
  showFavorites: boolean;
  favoriteArtists: Set<number>;
}

export const filterArtists = ({
  artists,
  allArtistsSearch,
  locationSearch,
  selectedTechniques,
  selectedStyles,
  selectedSocials,
  showFavorites,
  favoriteArtists,
}: ArtistsFilterProps) => {
  return artists.filter(artist => {
    // Text search filters
    const matchesSearch = artist.name.toLowerCase().includes(allArtistsSearch.toLowerCase()) ||
      artist.specialty.toLowerCase().includes(allArtistsSearch.toLowerCase());
    
    const matchesLocation = !locationSearch || 
      (artist.location && artist.location.toLowerCase().includes(locationSearch.toLowerCase()));

    // Technique filter
    const matchesTechniques = selectedTechniques.length === 0 || 
      selectedTechniques.every(technique => 
        artist.techniques?.includes(technique as any)
      );

    // Style filter
    const matchesStyles = selectedStyles.length === 0 || 
      selectedStyles.every(style => 
        artist.styles?.includes(style as any)
      );

    // Social platform filter
    const matchesSocials = selectedSocials.length === 0 || 
      selectedSocials.every(social => 
        artist.social_platforms?.includes(social as any)
      );

    // Favorites filter
    const matchesFavorites = !showFavorites || favoriteArtists.has(artist.id);

    return matchesSearch && matchesLocation && matchesTechniques && 
           matchesStyles && matchesSocials && matchesFavorites;
  });
};
