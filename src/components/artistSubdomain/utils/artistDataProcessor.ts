
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { logger } from "@/utils/logger";

/**
 * Processes raw artist data into a structured format
 */
export function processArtistData(artistData: any): Artist | null {
  if (!artistData) return null;
  
  try {
    logger.info(`Processing artist: ${artistData.name}, ID: ${artistData.id}`);
    
    const processedArtist: Artist = {
      ...artistData,
      techniques: typeof artistData.techniques === 'string' 
        ? JSON.parse(artistData.techniques) 
        : Array.isArray(artistData.techniques) ? artistData.techniques : [],
      styles: typeof artistData.styles === 'string' 
        ? JSON.parse(artistData.styles) 
        : Array.isArray(artistData.styles) ? artistData.styles : [],
      social_platforms: typeof artistData.social_platforms === 'string' 
        ? JSON.parse(artistData.social_platforms) 
        : Array.isArray(artistData.social_platforms) ? artistData.social_platforms : [],
      artworks: typeof artistData.artworks === 'string' 
        ? JSON.parse(artistData.artworks) 
        : Array.isArray(artistData.artworks) ? artistData.artworks : []
    };
    
    return processedArtist;
  } catch (error) {
    logger.error("Error processing artist data:", error);
    return null;
  }
}

/**
 * Creates a default profile for an artist
 */
export function createDefaultProfile(artist: Artist): ArtistProfile {
  const artworkBackground = artist.artworks && 
    Array.isArray(artist.artworks) && 
    artist.artworks.length > 0 
      ? artist.artworks[0] 
      : null;
  
  return {
    id: '',
    artist_id: String(artist.id), // Convert to string to match ArtistProfile type
    background_image: artworkBackground,
    background_color: '#f7cf1e',
    panel_color: '#ffffff',
    links: []
  };
}

/**
 * Extracts structured artist data from artist object
 */
export function extractArtistData(artist: Artist | null) {
  if (!artist) return {
    techniques: [],
    styles: [],
    socialPlatforms: [],
    artworks: []
  };

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
  
  const artworks = Array.isArray(artist.artworks) 
    ? artist.artworks 
    : typeof artist.artworks === 'string' && artist.artworks
      ? JSON.parse(artist.artworks)
      : [];

  return { techniques, styles, socialPlatforms, artworks };
}
