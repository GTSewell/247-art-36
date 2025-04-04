
import { logger } from "@/utils/logger";

/**
 * Helper function to process comma or space separated string to array
 */
export const processStringToArray = (input: string): string[] => {
  if (!input || input.trim() === '') return [];
  
  // First check if it contains commas
  if (input.includes(',')) {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  
  // If no commas, try splitting by spaces, but be careful with multi-word phrases
  return input
    .split(/\s+/)
    .filter(item => item.length > 0);
};

/**
 * Get the next available artist ID
 */
export const getNextArtistId = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.message.includes('No rows found')) {
        return 1; // Start with ID 1 if no artists exist
      }
      throw error;
    }
    
    return data.id + 1;
  } catch (error: any) {
    logger.error("Error getting next artist ID:", error);
    throw error;
  }
};

// Add supabase import at the top
import { supabase } from "@/integrations/supabase/client";
