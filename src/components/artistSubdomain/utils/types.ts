
import { Artist } from '@/data/types/artist';

export interface ArtistSearchResult {
  artistData: Artist | null;
  artistError: Error | null;
}
