
/**
 * Helper function to ensure a value is an array of strings
 * This handles the various ways array data might be stored or passed around in the app
 */
export const ensureArray = (value: string | string[] | number | number[] | any | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    // Convert all array elements to strings
    return value.map(item => String(item));
  }
  
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) {
      // Convert all parsed array elements to strings
      return parsed.map(item => String(item));
    }
    // If not an array, convert the single value to string and wrap in array
    return [String(value)];
  } catch (e) {
    // If parsing fails, treat as a single string
    return [String(value)];
  }
};
