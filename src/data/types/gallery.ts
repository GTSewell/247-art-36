
import { GalleryStyle, GalleryType, SocialPlatform } from "@/integrations/supabase/types";

export interface Gallery {
  id: number;
  name: string;
  bio: string;
  specialty: string;
  image: string;
  styles: GalleryStyle[] | null;
  gallery_types: GalleryType[] | null;
  social_platforms: SocialPlatform[] | null;
  location: string | null;
  city: string | null;
  country: string | null;
  established_year: number | null;
  size_sqm: number | null;
  website: string | null;
}
