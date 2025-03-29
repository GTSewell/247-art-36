
import { ArtistProfileFormData } from "../types";
import { formatSocialPlatforms } from "./socialPlatformUtils";
import { logger } from "@/utils/logger";

export const mapArtistToFormData = (artist: any): ArtistProfileFormData => {
  if (!artist) {
    logger.warn("Attempted to map null or undefined artist to form data");
    return {
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
  }

  logger.info("Mapping artist data to form data:", artist);

  // Format techniques
  let techniquesString = "";
  if (artist.techniques) {
    if (Array.isArray(artist.techniques)) {
      techniquesString = artist.techniques.join(", ");
    } else if (typeof artist.techniques === 'string') {
      try {
        const parsed = JSON.parse(artist.techniques);
        techniquesString = Array.isArray(parsed) ? parsed.join(", ") : artist.techniques;
      } catch (e) {
        techniquesString = artist.techniques;
      }
    } else if (typeof artist.techniques === 'object') {
      techniquesString = Object.values(artist.techniques).join(", ");
    }
  }

  // Format styles
  let stylesString = "";
  if (artist.styles) {
    if (Array.isArray(artist.styles)) {
      stylesString = artist.styles.join(", ");
    } else if (typeof artist.styles === 'string') {
      try {
        const parsed = JSON.parse(artist.styles);
        stylesString = Array.isArray(parsed) ? parsed.join(", ") : artist.styles;
      } catch (e) {
        stylesString = artist.styles;
      }
    } else if (typeof artist.styles === 'object') {
      stylesString = Object.values(artist.styles).join(", ");
    }
  }

  // Format social platforms
  const socialPlatforms = formatSocialPlatforms(artist);

  // Create the mapped form data
  const formData: ArtistProfileFormData = {
    name: artist.name || "",
    specialty: artist.specialty || "",
    bio: artist.bio || "",
    city: artist.city || "",
    country: artist.country || "",
    techniques: techniquesString,
    styles: stylesString,
    social_platforms: socialPlatforms,
    image: artist.image || null
  };

  logger.info("Mapped form data:", formData);
  return formData;
};
