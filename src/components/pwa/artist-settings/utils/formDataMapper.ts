
import { ArtistProfileFormData } from "../types";
import { formatSocialPlatforms } from "./socialPlatformUtils";
import { logger } from "@/utils/logger";

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
    logger.info("Mapping artist data to form:", artistData);
    
    // Map simple string fields
    formData.name = artistData.name || "";
    formData.specialty = artistData.specialty || "";
    formData.bio = artistData.bio || "";
    formData.city = artistData.city || "";
    formData.country = artistData.country || "";
    
    // Map techniques array to comma-separated string
    if (artistData.techniques) {
      if (typeof artistData.techniques === 'string') {
        try {
          const parsed = JSON.parse(artistData.techniques);
          formData.techniques = Array.isArray(parsed) ? parsed.join(", ") : "";
        } catch {
          formData.techniques = "";
        }
      } else if (Array.isArray(artistData.techniques)) {
        formData.techniques = artistData.techniques.join(", ");
      }
    }
    
    // Map styles array to comma-separated string
    if (artistData.styles) {
      if (typeof artistData.styles === 'string') {
        try {
          const parsed = JSON.parse(artistData.styles);
          formData.styles = Array.isArray(parsed) ? parsed.join(", ") : "";
        } catch {
          formData.styles = "";
        }
      } else if (Array.isArray(artistData.styles)) {
        formData.styles = artistData.styles.join(", ");
      }
    }
    
    // Map social platforms
    formData.social_platforms = formatSocialPlatforms(artistData);
    
    // Map image URL
    formData.image = artistData.image || null;
    
    logger.info("Mapped form data:", formData);
  }
  
  return formData;
};
