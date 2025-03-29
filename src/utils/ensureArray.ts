
import { logger } from "./logger";

/**
 * Ensures that the input is converted to an array of strings
 * Handles various input types: string, array, null, undefined, numbers, etc.
 * Also handles JSON strings with escaped quotes often found in database results
 */
export function ensureArray(input: any): string[] {
  try {
    // Handle null or undefined
    if (input === null || input === undefined) {
      return [];
    }
    
    // Handle case where input is already an array
    if (Array.isArray(input)) {
      // Convert all items to strings and filter out null/undefined
      return input
        .map(item => {
          if (item === null || item === undefined) return '';
          return String(item);
        })
        .filter(item => item !== '');
    }
    
    // Handle case where input is a string that's actually a JSON array
    if (typeof input === 'string') {
      try {
        // Handle escaped JSON strings like "[\"Photography\",\"Digital Art\"]"
        let stringToProcess = input;
        
        // Check if it contains escaped quotes and fix them
        if (input.includes('\\\"') || input.includes('\\"')) {
          stringToProcess = input.replace(/\\"/g, '"');
        }
        
        // Try to parse as JSON
        const parsed = JSON.parse(stringToProcess);
        
        if (Array.isArray(parsed)) {
          return parsed
            .map(item => {
              if (item === null || item === undefined) return '';
              return String(item);
            })
            .filter(item => item !== '');
        }
        
        // If it's not an array after parsing, treat as a single string
        return input.trim() ? [input] : [];
      } catch (e) {
        // Not valid JSON, check if it's a comma-separated list
        if (input.includes(',')) {
          return input
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        }
        
        // Not a comma-separated list, treat as a single string
        return input.trim() ? [input] : [];
      }
    }
    
    // Handle numbers, booleans, or other primitive types
    if (typeof input === 'number' || typeof input === 'boolean') {
      return [String(input)];
    }
    
    // For objects or other types, convert to string
    if (typeof input === 'object') {
      const str = JSON.stringify(input);
      return str === '{}' ? [] : [str];
    }
    
    // Default fallback
    return [];
  } catch (error) {
    logger.error("Error in ensureArray:", error);
    return [];
  }
}
