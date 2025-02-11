
import { Database } from "@/integrations/supabase/types";

export interface Gallery {
  id: number;
  name: string;
  bio: string;
  specialty: string;
  image: string;
  styles: Database['public']['Enums']['gallery_style'][] | null;
  gallery_types: Database['public']['Enums']['gallery_type'][] | null;
  social_platforms: Database['public']['Enums']['social_platform'][] | null;
  location: string | null;
  city: string | null;
  country: string | null;
  established_year: number | null;
  size_sqm: number | null;
  website: string | null;
}
