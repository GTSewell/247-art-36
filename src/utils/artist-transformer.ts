
import { Artist } from "@/data/types/artist";
import { Database } from "@/integrations/supabase/types";

type ArtistRow = Database['public']['Tables']['artists']['Row'];

const parseJsonField = <T>(field: unknown): T[] => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return Array.isArray(field) ? field : [];
};

export const transformArtist = (artist: ArtistRow): Artist => {
  const techniques = parseJsonField<string>(artist.techniques);
  const styles = parseJsonField<string>(artist.styles);
  const social_platforms = parseJsonField<string>(artist.social_platforms);
  const artworks = parseJsonField<string>(artist.artworks);

  return {
    id: artist.id,
    name: artist.name || '',
    specialty: artist.specialty || '',
    image: artist.image || '',
    bio: artist.bio || '',
    location: artist.location || '',
    city: artist.city || '',
    country: artist.country || '',
    techniques,
    styles,
    social_platforms,
    artworks,
    locked_artworks: artist.locked_artworks || false,
    user_id: artist.user_id || undefined
  };
};
