
// Re-export all the artist API functions from their respective modules
import { fetchArtistProfile } from './fetch/fetchArtistProfile';
import { saveArtistProfile } from './save/saveArtistProfile';
import { getNextArtistId, processStringToArray } from './utils/dataProcessingUtils';

export {
  fetchArtistProfile,
  saveArtistProfile,
  getNextArtistId,
  processStringToArray
};
