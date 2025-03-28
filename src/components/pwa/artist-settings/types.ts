
export interface ArtistProfileFormData {
  name: string;
  specialty: string;
  bio: string;
  city: string;
  country: string;
  techniques: string;
  styles: string;
  social_platforms: string[];
  image: string | null;
}

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
  handleSubmit: (e: React.FormEvent) => void;
}
