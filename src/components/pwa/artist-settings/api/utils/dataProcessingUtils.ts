
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

/**
 * Get the next available ID for a new artist
 */
export const getNextArtistId = async (): Promise<number> => {
  try {
    logger.info("Getting next available artist ID");
    
    // Get the highest artist ID currently in the database
    const { data, error } = await supabase
      .from('artists')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    if (error) {
      logger.error("Error fetching highest artist ID:", error);
      throw error;
    }
    
    // Start from ID 26 for signature artist accounts
    const highestId = data && data.length > 0 ? data[0].id : 25;
    const nextId = highestId + 1;
    
    logger.info(`Next available artist ID: ${nextId}`);
    return nextId;
  } catch (error) {
    logger.error("Error getting next artist ID:", error);
    // Fallback to a safe starting ID if there's an error
    return 26;
  }
};

/**
 * Convert string input to an array, handling various format possibilities
 */
export const processStringToArray = (input: string | string[] | null | undefined): string[] => {
  if (!input) return [];
  
  // If already an array, return as is
  if (Array.isArray(input)) return input;
  
  try {
    // Try to parse as JSON if it's a string representation of an array
    if (input.trim().startsWith('[') && input.trim().endsWith(']')) {
      return JSON.parse(input);
    }
    
    // Split by commas and trim each item
    return input.split(',').map(item => item.trim()).filter(Boolean);
  } catch (e) {
    logger.warn("Error processing string to array:", e);
    // If parsing fails, try simple comma split
    return input.split(',').map(item => item.trim()).filter(Boolean);
  }
};
