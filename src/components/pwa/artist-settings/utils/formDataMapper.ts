
import { ArtistProfileFormData } from "../types";
import { formatSocialPlatforms } from "./socialPlatformUtils";

/**
 * Map artist data from API to form data format
 */
export const mapArtistToFormData = (data: any): ArtistProfileFormData => {
  if (!data) {
    return {
      name: "",
      specialty: "",
      bio: "",
      city: "",
      country: "",
      techniques: "",
      styles: "",
      social_platforms: "",
      image: null
    };
  }
  
  return {
    name: data.name || "",
    specialty: data.specialty || "",
    bio: data.bio || "",
    city: data.city || "",
    country: data.country || "",
    techniques: Array.isArray(data.techniques) 
      ? data.techniques.join(', ') 
      : typeof data.techniques === 'string' ? data.techniques : "",
    styles: Array.isArray(data.styles) 
      ? data.styles.join(', ') 
      : typeof data.styles === 'string' ? data.styles : "",
    social_platforms: formatSocialPlatforms(data),
    image: data.image || null
  };
};
