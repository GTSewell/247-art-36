
export interface SocialPlatform {
  platform: string;
  username: string;
}

export interface ArtistProfileFormData {
  name: string;
  specialty: string;
  bio: string;
  location: string;
  city: string;
  country: string;
  techniques: string;
  styles: string;
  social_platforms: SocialPlatform[];
}

export interface ArtistProfileHookReturn {
  loading: boolean;
  saving: boolean;
  artist: any;
  formData: ArtistProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
