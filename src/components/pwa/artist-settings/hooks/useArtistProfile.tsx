
import { useState } from "react";
import { ArtistProfileHookReturn } from "../types";
import { useFetchArtistProfile } from "./useFetchArtistProfile";
import { useFormHandling } from "./useFormHandling";
import { useSaveArtistProfile } from "./useSaveArtistProfile";

export const useArtistProfile = (artistId: string | null): ArtistProfileHookReturn => {
  // Use the fetch hook to get artist data
  const { 
    loading, 
    artist, 
    formData, 
    setFormData 
  } = useFetchArtistProfile(artistId);
  
  // Use the form handling hook
  const {
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange
  } = useFormHandling(formData, setFormData);
  
  // Use the save hook
  const {
    saving,
    handleSubmit
  } = useSaveArtistProfile(artistId, artist, setArtist, formData, setFormData);
  
  // Need to create a setter function for the artist state to pass to useSaveArtistProfile
  const [, setArtist] = useState<any>(artist);
  
  // Return all required properties
  return {
    loading,
    saving,
    artist,
    formData,
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange,
    handleSubmit
  };
};
