
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { SearchResult } from "../types";

/**
 * Try removing all spaces and comparing
 */
export async function normalizedNameSearch(artistName: string): Promise<SearchResult> {
  logger.info(`Attempting normalized name search for: ${artistName}`);
  
  // Get all artists and filter manually
  const allArtistsResult = await supabase
    .from('artists')
    .select('*')
    .eq('published', true);
    
  const allArtists = allArtistsResult.data || [];
  
  // Find the artist whose name with spaces removed matches the artistName
  const normalizedSearchName = artistName.toLowerCase().replace(/\s+/g, '');
  const artistData = allArtists.find(a => 
    (a.name?.replace(/\s+/g, '').toLowerCase() === normalizedSearchName)
  ) || null;
  
  if (artistData) {
    logger.info(`Found artist using normalized name matching: ${artistData.name}`);
  }
  
  return { 
    artistData,
    artistError: allArtistsResult.error
  };
}

/**
 * Try substring matching approaches
 */
export async function substringSearch(artistName: string): Promise<SearchResult> {
  logger.info(`Attempting substring search for: ${artistName}`);
  
  // Try matching by checking if the input is a substring of any artist name
  const allNamesResult = await supabase
    .from('artists')
    .select('id, name')
    .eq('published', true);
    
  const allNames = allNamesResult.data || [];
  
  // First try direct substring match
  let matchedArtist = allNames.find(a => 
    a.name?.toLowerCase().includes(artistName.toLowerCase())
  );
  
  if (matchedArtist) {
    logger.info(`Found substring match: "${matchedArtist.name}" for search: "${artistName}"`);
  }
  
  return await fetchArtistById(matchedArtist?.id);
}

/**
 * Try fuzzy matching approaches by comparing normalized names
 */
export async function fuzzyNameSearch(artistName: string): Promise<SearchResult> {
  logger.info(`Attempting fuzzy name search for: ${artistName}`);
  
  const allNamesResult = await supabase
    .from('artists')
    .select('id, name')
    .eq('published', true);
    
  const allNames = allNamesResult.data || [];
  
  // Try removing spaces from both sides and compare
  const normalizedInputName = artistName.toLowerCase().replace(/\s+/g, '');
  const matchedArtist = allNames.find(a => {
    if (!a.name) return false;
    const normalizedDbName = a.name.toLowerCase().replace(/\s+/g, '');
    return normalizedDbName.includes(normalizedInputName) || 
            normalizedInputName.includes(normalizedDbName);
  });
  
  if (matchedArtist) {
    logger.info(`Found fuzzy match: "${matchedArtist.name}" for search: "${artistName}"`);
  }
  
  return await fetchArtistById(matchedArtist?.id);
}

/**
 * Try partial word matching as a last resort
 */
export async function partialWordSearch(artistName: string): Promise<SearchResult> {
  logger.info(`Attempting partial word search for: ${artistName}`);
  
  const allNamesResult = await supabase
    .from('artists')
    .select('id, name')
    .eq('published', true);
    
  const allNames = allNamesResult.data || [];
  
  // Even looser matching - find if any word in the artist name matches
  const matchedArtist = allNames.find(a => {
    if (!a.name) return false;
    const artistNameWords = a.name.toLowerCase().split(' ');
    const searchTermWords = artistName.toLowerCase().split(/[^a-z0-9]/);
    return artistNameWords.some(word => 
      searchTermWords.some(searchWord => 
        word.includes(searchWord) || searchWord.includes(word)
      )
    );
  });
  
  if (matchedArtist) {
    logger.info(`Found partial word match: "${matchedArtist.name}" for search: "${artistName}"`);
  }
  
  return await fetchArtistById(matchedArtist?.id);
}

/**
 * Helper function to fetch full artist data by ID
 */
async function fetchArtistById(artistId: number | undefined): Promise<SearchResult> {
  if (!artistId) {
    return { artistData: null, artistError: null };
  }
  
  const matchResult = await supabase
    .from('artists')
    .select('*')
    .eq('id', artistId)
    .maybeSingle();
    
  return { 
    artistData: matchResult.data, 
    artistError: matchResult.error 
  };
}
