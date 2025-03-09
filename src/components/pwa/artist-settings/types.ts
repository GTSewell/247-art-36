
import { Json } from "@/integrations/supabase/types";

export interface ArtistProfileFormData {
  name: string;
  specialty: string;
  bio: string;
  city: string;
  country: string;
  techniques: string;
  styles: string;
  social_platforms: string;
  is_published?: boolean;
}

export interface ArtistProfileHookReturn {
  loading: boolean;
  saving: boolean;
  artist: any;
  formData: ArtistProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isAdmin: boolean;
}
