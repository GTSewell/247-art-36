
export interface Artist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  profile_image_url?: string;
  bio: string;
  location?: string;
  city?: string;
  country?: string;
  techniques?: string[] | string;
  styles?: string[] | string;
  social_platforms?: string[] | string;
  artworks?: string[] | string;
  artwork_files?: any; // This will hold the background_image and other artwork-related data
  locked_artworks?: boolean;
  user_id?: string;
  published: boolean;
}
