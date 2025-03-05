
export interface ArtistProfile {
  id: string;
  artist_id: string;
  background_image: string | null;
  background_color: string;
  panel_color: string;
  text_color?: string;
  accent_color?: string;
  links: Array<{
    title: string;
    url: string;
  }>;
}
