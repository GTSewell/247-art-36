
import { ArtistProfileFormData } from "../types";
import { formatSocialPlatforms } from "./socialPlatformUtils";

export const mapArtistToFormData = (artistData: any): ArtistProfileFormData => {
  // Set default empty values
  const formData: ArtistProfileFormData = {
    name: "",
    specialty: "",
    bio: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: [""],
    image: null
  };
  
  // If artist data exists, map fields
  if (artistData) {
    // Map simple string fields
    formData.name = artistData.name || "";
    formData.specialty = artistData.specialty || "";
    formData.bio = artistData.bio || "";
    formData.city = artistData.city || "";
    formData.country = artistData.country || "";
    
    // Map techniques and styles arrays to comma-separated strings
    formData.techniques = Array.isArray(artistData.techniques) 
      ? artistData.techniques.join(", ") 
      : "";
      
    formData.styles = Array.isArray(artistData.styles) 
      ? artistData.styles.join(", ") 
      : "";
    
    // Map social platforms from array to array (or create from string)
    formData.social_platforms = formatSocialPlatforms(artistData);
    
    // Map image URL
    formData.image = artistData.image || null;
  }
  
  return formData;
};
