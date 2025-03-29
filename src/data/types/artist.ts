
export interface Artist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  location?: string;
  city?: string;
  country?: string;
  techniques?: string[] | string;
  styles?: string[] | string;
  social_platforms?: string[] | string;
  artworks?: string[] | string;
  locked_artworks?: boolean;
  user_id?: string;
  published: boolean;
}
