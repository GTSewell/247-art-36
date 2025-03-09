
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { SearchResult } from "../types";

/**
 * Try exact match (for no spaces)
 */
export async function exactMatchSearch(artistName: string): Promise<SearchResult> {
  logger.info(`Attempting exact match search for: ${artistName}`);
  
  const result = await supabase
    .from('artists')
    .select('*')
    .eq('name', artistName)
    .eq('published', true)
    .maybeSingle();
    
  return { 
    artistData: result.data,
    artistError: result.error
  };
}

/**
 * Try with spaces re-added
 */
export async function spacedNameSearch(artistName: string): Promise<SearchResult> {
  // Try adding spaces in common positions (before uppercase letters)
  const nameWithPossibleSpaces = artistName.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  logger.info(`Attempting spaced name search for: ${nameWithPossibleSpaces}`);
  
  const result = await supabase
    .from('artists')
    .select('*')
    .eq('name', nameWithPossibleSpaces)
    .eq('published', true)
    .maybeSingle();
    
  return { 
    artistData: result.data,
    artistError: result.error
  };
}

/**
 * Try case-insensitive search
 */
export async function caseInsensitiveSearch(artistName: string): Promise<SearchResult> {
  logger.info(`Attempting case-insensitive search for: ${artistName}`);
  
  const result = await supabase
    .from('artists')
    .select('*')
    .ilike('name', artistName.replace(/([A-Z])/g, ' $1').trim())
    .eq('published', true)
    .maybeSingle();
    
  return { 
    artistData: result.data,
    artistError: result.error
  };
}
