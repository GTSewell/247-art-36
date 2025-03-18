
export interface Artist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  location?: string;
  city?: string;
  country?: string;
  techniques?: string[];
  styles?: string[];
  social_platforms?: string[];
  artworks?: string[];
  locked_artworks?: boolean;
  user_id?: string;
}
