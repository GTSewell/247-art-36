
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
      id: artistData.id,
      name: artistData.name || '',
      specialty: artistData.specialty || '',
      bio: artistData.bio || '',
      image: artistData.image || '',
      location: artistData.location || '',
      city: artistData.city || '',
      country: artistData.country || '',
      techniques: parsePotentialJsonArray(artistData.techniques),
      styles: parsePotentialJsonArray(artistData.styles),
      social_platforms: parsePotentialJsonArray(artistData.social_platforms),
      artworks: parsePotentialJsonArray(artistData.artworks),
      locked_artworks: artistData.locked_artworks || false,
      published: artistData.published === true
    };
    
    return processedArtist;
  } catch (error) {
    logger.error("Error processing artist data:", error);
    return null;
  }
}

/**
 * Helper function to parse a value that could be a JSON string, an array, or something else
 * Returns an array of strings regardless of input type
 */
function parsePotentialJsonArray(value: any): string[] {
  if (!value) {
    return [];
  }

  // If already an array, return as is
  if (Array.isArray(value)) {
    return value;
  }

  // If it's a string that might be JSON, try to parse it
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch (e) {
      // If it fails to parse as JSON, return it as a single-item array
      return [value];
    }
  }

  // For any other type, convert to string and return as single-item array
  return [String(value)];
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

  return {
    techniques: artist.techniques || [],
    styles: artist.styles || [],
    socialPlatforms: artist.social_platforms || [],
    artworks: artist.artworks || []
  };
}
