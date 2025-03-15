
export { type Artist } from './types/artist';

// This is a utility function to determine the correct label for the favorite action
export const getFavoriteActionLabel = (isFavorite: boolean): string => {
  return isFavorite ? 'Remove from favorites' : 'Add to favorites';
};
