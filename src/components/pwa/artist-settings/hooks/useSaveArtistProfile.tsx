import { useState } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData } from "../types";
import { saveArtistProfile } from "../api/artistProfileAPI";
import { logger } from "@/utils/logger";

export const useSaveArtistProfile = (
  artistId: string | null,
  artist: any,
  setArtist: React.Dispatch<React.SetStateAction<any>>,
  formData: ArtistProfileFormData,
  setFormData: React.Dispatch<React.SetStateAction<ArtistProfileFormData>>
) => {
  const [saving, setSaving] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isDemo = artistId === "demo";
    const effectiveArtistId = isDemo ? "25" : artistId;
    
    logger.info("Form submission started with artist ID:", effectiveArtistId, isDemo ? "(Demo Mode)" : "");
    
    try {
      setSaving(true);
      logger.info("Submitting artist profile form data:", formData);
      
      const result = await saveArtistProfile(formData, effectiveArtistId);
      
      if (result.success) {
        // Get the updated data from the result
        if (result.data && result.data.length > 0) {
          const updatedArtist = result.data[0];
          setArtist(updatedArtist);
          
          // Update form data with the new values to keep form state consistent
          const updatedFormData = mapArtistToFormData(updatedArtist);
          setFormData(updatedFormData);
          
          logger.info("Updated artist profile state with new data:", updatedArtist);
        }
        
        toast.success(result.message);
        
        // For new artists, we should refresh the page to show artwork manager
        if (!effectiveArtistId) {
          // Update the URL with the new artist ID instead of reloading the page
          window.location.href = window.location.href.replace('isCreatingNew=true', `selectedArtistId=${result.data[0].id}`);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      logger.error("Error updating artist profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  return {
    saving,
    handleSubmit
  };
};

// Import the mapping function here to avoid circular dependencies
import { mapArtistToFormData } from "../utils/formDataMapper";
