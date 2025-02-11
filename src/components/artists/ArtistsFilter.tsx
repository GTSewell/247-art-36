
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
    // If showFavorites is true, only show favorited artists
    if (showFavorites && !favoriteArtists.has(artist.id)) {
      return false;
    }

    // Text search filters
    const nameMatch = artist.name.toLowerCase().includes(allArtistsSearch.toLowerCase());
    const specialtyMatch = artist.specialty.toLowerCase().includes(allArtistsSearch.toLowerCase());
    const searchMatch = !allArtistsSearch || nameMatch || specialtyMatch;
    
    // Location filter
    const locationMatch = !locationSearch || (
      (artist.location && artist.location.toLowerCase().includes(locationSearch.toLowerCase())) ||
      (artist.city && artist.city.toLowerCase().includes(locationSearch.toLowerCase())) ||
      (artist.country && artist.country.toLowerCase().includes(locationSearch.toLowerCase()))
    );

    // Technique filter - only apply if techniques are selected
    const techniqueMatch = selectedTechniques.length === 0 || 
      selectedTechniques.some(technique => 
        artist.techniques?.includes(technique)
      );

    // Style filter - only apply if styles are selected
    const styleMatch = selectedStyles.length === 0 || 
      selectedStyles.some(style => 
        artist.styles?.includes(style)
      );

    // Social platform filter - only apply if social platforms are selected
    const socialMatch = selectedSocials.length === 0 || 
      selectedSocials.some(social => 
        artist.social_platforms?.includes(social)
      );

    return searchMatch && locationMatch && techniqueMatch && styleMatch && socialMatch;
  });
};
