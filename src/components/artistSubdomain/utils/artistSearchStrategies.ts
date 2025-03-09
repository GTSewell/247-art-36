
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

/**
 * Utility for finding an artist using multiple search strategies
 */
export async function findArtistByName(artistName: string) {
  // Log all artists for debugging
  const allArtistsDebug = await supabase
    .from('artists')
    .select('id, name')
    .eq('published', true);
  
  logger.info(`Available artists: ${JSON.stringify(allArtistsDebug.data?.map(a => ({id: a.id, name: a.name})))}`);
  
  // Try multiple query approaches to find the artist
  let artistData = null;
  let artistError = null;

  // 1. Try exact match (for no spaces)
  let result = await supabase
    .from('artists')
    .select('*')
    .eq('name', artistName)
    .eq('published', true)
    .maybeSingle();
    
  artistData = result.data;
  artistError = result.error;
  
  // 2. If not found, try with spaces re-added
  if (!artistData && artistName) {
    // Try adding spaces in common positions (before uppercase letters)
    const nameWithPossibleSpaces = artistName.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    result = await supabase
      .from('artists')
      .select('*')
      .eq('name', nameWithPossibleSpaces)
      .eq('published', true)
      .maybeSingle();
      
    artistData = result.data;
    artistError = result.error;
  }
  
  // 3. If still not found, try case-insensitive search
  if (!artistData) {
    result = await supabase
      .from('artists')
      .select('*')
      .ilike('name', artistName.replace(/([A-Z])/g, ' $1').trim())
      .eq('published', true)
      .maybeSingle();
      
    artistData = result.data;
    artistError = result.error;
  }
  
  // 4. Try one more approach - removing all spaces and comparing
  if (!artistData) {
    // Get all artists and filter manually
    const allArtistsResult = await supabase
      .from('artists')
      .select('*')
      .eq('published', true);
      
    const allArtists = allArtistsResult.data || [];
    
    // Find the artist whose name with spaces removed matches the artistName
    const normalizedSearchName = artistName.toLowerCase().replace(/\s+/g, '');
    artistData = allArtists.find(a => 
      (a.name?.replace(/\s+/g, '').toLowerCase() === normalizedSearchName)
    ) || null;
    
    if (artistData) {
      logger.info(`Found artist using normalized name matching: ${artistData.name}`);
    }
  }
  
  // 5. Try additional fuzzy matching approaches
  if (!artistData) {
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
    
    // If no match, try removing spaces from both sides and compare
    if (!matchedArtist) {
      const normalizedInputName = artistName.toLowerCase().replace(/\s+/g, '');
      matchedArtist = allNames.find(a => {
        if (!a.name) return false;
        const normalizedDbName = a.name.toLowerCase().replace(/\s+/g, '');
        return normalizedDbName.includes(normalizedInputName) || 
                normalizedInputName.includes(normalizedDbName);
      });
      
      if (matchedArtist) {
        logger.info(`Found fuzzy match: "${matchedArtist.name}" for search: "${artistName}"`);
      }
    }
    
    // 6. Try treating the input as potentially part of the name
    if (!matchedArtist) {
      // Even looser matching - find if any word in the artist name matches
      matchedArtist = allNames.find(a => {
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
    }
    
    if (matchedArtist) {
      // If we found a match, fetch the full artist data
      const matchResult = await supabase
        .from('artists')
        .select('*')
        .eq('id', matchedArtist.id)
        .maybeSingle();
        
      artistData = matchResult.data;
    }
  }
  
  return { artistData, artistError };
}
