
import { Artist } from "@/data/types/artist";
import { logger } from "./logger";

export const transformArtist = (artistData: any): Artist => {
  if (!artistData) {
    logger.warn('Attempted to transform undefined or null artist data');
    return {
      id: 0,
      name: '',
      specialty: '',
      image: '',
      bio: '',
      published: false
    };
  }

  try {
    // Process techniques array
    let processedTechniques = artistData.techniques;
    if (typeof processedTechniques === 'string') {
      try {
        processedTechniques = JSON.parse(processedTechniques);
      } catch (e) {
        processedTechniques = processedTechniques.split(',').map((t: string) => t.trim());
      }
    }

    // Process styles array
    let processedStyles = artistData.styles;
    if (typeof processedStyles === 'string') {
      try {
        processedStyles = JSON.parse(processedStyles);
      } catch (e) {
        processedStyles = processedStyles.split(',').map((s: string) => s.trim());
      }
    }

    // Process social platforms array
    let processedSocialPlatforms = artistData.social_platforms;
    if (typeof processedSocialPlatforms === 'string') {
      try {
        processedSocialPlatforms = JSON.parse(processedSocialPlatforms);
      } catch (e) {
        processedSocialPlatforms = processedSocialPlatforms.split(',').map((p: string) => p.trim());
      }
    }

    // Process artworks array
    let processedArtworks = artistData.artworks;
    if (typeof processedArtworks === 'string') {
      try {
        processedArtworks = JSON.parse(processedArtworks);
      } catch (e) {
        processedArtworks = [];
      }
    }

    // Transform the artist data
    const transformedArtist: Artist = {
      id: artistData.id,
      name: artistData.name || '',
      specialty: artistData.specialty || '',
      bio: artistData.bio || '',
      image: artistData.image || artistData.profile_image_url || '',
      location: artistData.location || '',
      city: artistData.city || '',
      country: artistData.country || '',
      techniques: processedTechniques || [],
      styles: processedStyles || [],
      social_platforms: processedSocialPlatforms || [],
      artworks: processedArtworks || [],
      locked_artworks: artistData.locked_artworks || false,
      user_id: artistData.user_id || '',
      published: artistData.published === true  // Ensure boolean conversion
    };

    return transformedArtist;
  } catch (error) {
    logger.error('Error transforming artist data:', error);
    return {
      id: artistData.id || 0,
      name: artistData.name || '',
      specialty: artistData.specialty || '',
      image: artistData.image || '',
      bio: artistData.bio || '',
      published: artistData.published === true  // Ensure boolean conversion
    };
  }
};
