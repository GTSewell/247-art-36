
export interface ArtistProfile {
  id: string;
  artist_id: number;
  background_image: string | null;
  background_color: string;
  panel_color: string;
  links: ArtistLink[];
  created_at?: string;
  updated_at?: string;
}

export interface ArtistLink {
  type: string;
  title: string;
  url: string;
}
