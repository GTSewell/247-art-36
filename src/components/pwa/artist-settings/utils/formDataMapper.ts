
import { ArtistProfileFormData } from "../types";
import { formatSocialPlatforms } from "./socialPlatformUtils";
import { logger } from "@/utils/logger";
import { ensureArray } from "@/utils/ensureArray";

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
      image: null,
      published: false
    };
  }

  logger.info("Mapping artist data to form data:", artist);

  // Process techniques and styles using the ensureArray utility
  const techniquesArray = ensureArray(artist.techniques);
  const stylesArray = ensureArray(artist.styles);
  
  // Join arrays into comma-separated strings for form fields
  const techniquesString = techniquesArray.join(", ");
  const stylesString = stylesArray.join(", ");

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
    image: artist.image || null,
    published: artist.published === true
  };

  logger.info("Mapped form data:", formData);
  return formData;
};
