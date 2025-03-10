
import { searchArtistBasic } from './searchStrategies/basicSearch';
import { searchArtistAdvanced } from './searchStrategies/advancedSearch';
import { logger } from '@/utils/logger';

/**
 * Finds an artist by name using multiple search strategies
 */
export const findArtistByName = async (artistName: string | undefined) => {
  try {
    // Return early if the artist name is undefined or empty
    if (!artistName || artistName.trim() === '') {
      logger.warn('Artist name is undefined or empty, cannot fetch artist data');
      return { artistData: null, artistError: new Error('Artist name is undefined or empty') };
    }
    
    // Normalize the artist name by trimming it
    const normalizedName = artistName.trim();
    logger.info(`Searching for artist with name: ${normalizedName}`);
    
    // First try a basic search (exact match)
    const { artistData: basicData, artistError: basicError } = await searchArtistBasic(normalizedName);
    
    if (basicData && !basicError) {
      logger.info(`Artist found with basic search: ${normalizedName}`);
      return { artistData: basicData, artistError: null };
    }
    
    // If basic search fails, try advanced search (fuzzy match)
    const { artistData: advancedData, artistError: advancedError } = await searchArtistAdvanced(normalizedName);
    
    if (advancedData && !advancedError) {
      logger.info(`Artist found with advanced search: ${normalizedName}`);
      return { artistData: advancedData, artistError: null };
    }
    
    // If both searches fail, return null data
    logger.warn(`No artist found with name: ${normalizedName}`);
    return { artistData: null, artistError: null };
    
  } catch (error: any) {
    logger.error(`Error searching for artist: ${error.message}`);
    return { artistData: null, artistError: error };
  }
};
