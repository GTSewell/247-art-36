// For the ArtistProfileFormData interface, add or update these fields
export interface ArtistProfileFormData {
  name: string;
  specialty: string;
  bio: string;
  profileImage: string;
  backgroundImage: string;
  city: string;
  country: string;
  techniques: string;
  styles: string;
  social_platforms: string[];
  image: string | null;
  published?: boolean;
}

// For the ArtistProfileHookReturn interface, add or update these fields
export interface ArtistProfileHookReturn {
  loading: boolean;
  saving: boolean;
  artist: any;
  formData: ArtistProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSocialPlatformChange: (index: number, value: string) => void;
  addSocialPlatform: () => void;
  removeSocialPlatform: (index: number) => void;
  handleImageChange: (imageUrl: string | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

// Add ArtistProfile type if it doesn't exist
export interface ArtistProfile {
  id?: number;
  user_id?: string;
  name: string;
  bio?: string;
  image?: string;
  website?: string;
  social_links?: Record<string, string>;
  city?: string;
  country?: string;
  location?: string;
  techniques?: string[];
  styles?: string[];
  artist_tags?: string[];
  artwork_files?: Record<string, any>;
  artworks?: any[];
  [key: string]: any;
}
