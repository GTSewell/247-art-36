
import { ArtistProfileFormData } from "./types";

export const processArtistFormData = (formData: ArtistProfileFormData, userId: string) => {
  return {
    user_id: userId,
    name: formData.name,
    specialty: formData.specialty,
    bio: formData.bio,
    city: formData.city,
    country: formData.country,
    techniques: formData.techniques.split(',').map(item => item.trim()),
    styles: formData.styles.split(',').map(item => item.trim()),
    social_platforms: formData.social_platforms.split(',').map(item => item.trim()),
    published: formData.published
  };
};

export const formatArtistDataForForm = (data: any): ArtistProfileFormData => {
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
    social_platforms: Array.isArray(data.social_platforms) 
      ? data.social_platforms.join(', ') 
      : typeof data.social_platforms === 'string' ? data.social_platforms : "",
    published: data.published
  };
};
