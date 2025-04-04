
import { useState } from "react";
import { ArtistProfileHookReturn } from "../types";
import { useFetchArtistProfile } from "./useFetchArtistProfile";
import { useFormHandling } from "./useFormHandling";
import { useSaveArtistProfile } from "./useSaveArtistProfile";

export const useArtistProfile = (artistId: string | null): ArtistProfileHookReturn => {
  // Initialize the artist state first to fix the TypeScript error
  const [artist, setArtist] = useState<any>(null);
  
  // Use the fetch hook to get artist data
  const { 
    loading, 
    artist: fetchedArtist, 
    formData, 
    setFormData 
  } = useFetchArtistProfile(artistId);
  
  // Update our local artist state when the fetched artist changes
  useState(() => {
    if (fetchedArtist) {
      setArtist(fetchedArtist);
    }
  });
  
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
