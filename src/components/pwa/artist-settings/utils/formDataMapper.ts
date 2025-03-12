
import { ArtistProfileFormData, SocialPlatform } from "../types";
import { parseSocialPlatforms } from "./socialPlatformUtils";

/**
 * Map artist data from API to form data format
 */
export const mapArtistToFormData = (data: any): ArtistProfileFormData => {
  if (!data) {
    return {
      name: "",
      specialty: "",
      bio: "",
      location: "",
      city: "",
      country: "",
      techniques: "",
      styles: "",
      social_platforms: []
    };
  }
  
  return {
    name: data.name || "",
    specialty: data.specialty || "",
    bio: data.bio || "",
    location: data.location || "",
    city: data.city || "",
    country: data.country || "",
    techniques: Array.isArray(data.techniques) 
      ? data.techniques.join(', ') 
      : typeof data.techniques === 'string' ? data.techniques : "",
    styles: Array.isArray(data.styles) 
      ? data.styles.join(', ') 
      : typeof data.styles === 'string' ? data.styles : "",
    social_platforms: Array.isArray(data.social_platforms) 
      ? parseSocialPlatforms(data.social_platforms)
      : []
  };
};
