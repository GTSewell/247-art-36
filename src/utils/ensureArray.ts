
/**
 * Helper function to ensure a value is an array of strings
 * This handles the various ways array data might be stored or passed around in the app
 */
export const ensureArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch (e) {
    return [value];
  }
};
