
import { basicSearch } from './searchStrategies/basicSearch';
import { advancedSearch } from './searchStrategies/advancedSearch';
import { logger } from '@/utils/logger';

/**
 * Finds an artist by name using multiple search strategies
 */
export const findArtistByName = async (artistName: string | undefined) => {
  try {
    // Return early if the artist name is undefined or empty
    if (!artistName || artistName.trim() === '') {
      logger.error('Cannot search for artist: name is undefined or empty');
      return { artistData: null, artistError: new Error('Artist name is undefined or empty') };
    }
    
    // First try a basic search (exact match)
    const { data: basicData, error: basicError } = await basicSearch(artistName);
    
    if (basicData && !basicError) {
      logger.info(`Artist found with basic search: ${artistName}`);
      return { artistData: basicData, artistError: null };
    }
    
    // If basic search fails, try advanced search (fuzzy match)
    const { data: advancedData, error: advancedError } = await advancedSearch(artistName);
    
    if (advancedData && !advancedError) {
      logger.info(`Artist found with advanced search: ${artistName}`);
      return { artistData: advancedData, artistError: null };
    }
    
    // If both searches fail, return null data
    logger.warn(`No artist found with name: ${artistName}`);
    return { artistData: null, artistError: null };
    
  } catch (error: any) {
    logger.error(`Error searching for artist: ${error.message}`);
    return { artistData: null, artistError: error };
  }
};
