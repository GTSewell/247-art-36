
export interface Artist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  location: string;
  techniques?: string[];
  styles?: string[];
  social_platforms?: string[];
}
