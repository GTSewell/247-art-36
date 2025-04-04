
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData, ArtistProfileHookReturn } from "../types";
import { fetchArtistProfile, saveArtistProfile } from "../api/artistProfileAPI";
import { mapArtistToFormData } from "../utils/formDataMapper";
import { logger } from "@/utils/logger";

export const useArtistProfile = (artistId: string | null): ArtistProfileHookReturn => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artist, setArtist] = useState<any>(null);
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: "",
    specialty: "",
    bio: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: [""], // Initialize as string array with empty string
    image: null
  });
  
  useEffect(() => {
    // If artist ID is specifically set to "demo", fetch the Demo Artist (id: 25)
    if (artistId === "demo") {
      fetchDemoArtistProfileData();
    } else if (artistId) {
      fetchArtistProfileData();
    } else {
      // For new artist, just set loading to false
      setLoading(false);
    }
  }, [artistId]);
  
  const fetchDemoArtistProfileData = async () => {
    try {
      setLoading(true);
      
      // Always fetch artist with ID 25 (Demo Artist) for demo accounts
      logger.info("Fetching Demo Artist profile (ID: 25)");
      const { data, error } = await fetchArtistProfile("25");
      
      if (error) {
        throw error;
      }
      
      if (data) {
        logger.info("Demo Artist profile data retrieved:", data);
        setArtist(data);
        
        // Map API data to form data
        const mappedFormData = mapArtistToFormData(data);
        logger.info("Mapped form data for Demo Artist:", mappedFormData);
        setFormData(mappedFormData);
      }
    } catch (error: any) {
      logger.error("Error fetching Demo Artist profile:", error);
      toast.error(`Failed to load Demo Artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchArtistProfileData = async () => {
    try {
      setLoading(true);
      
      if (!artistId) {
        throw new Error("Artist ID not found");
      }
      
      logger.info("Fetching artist profile for artist ID:", artistId);
      const { data, error } = await fetchArtistProfile(artistId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        logger.info("Artist profile data retrieved:", data);
        // If artist profile exists, load it
        setArtist(data);
        
        // Map API data to form data
        const mappedFormData = mapArtistToFormData(data);
        logger.info("Mapped form data:", mappedFormData);
        setFormData(mappedFormData);
      }
    } catch (error: any) {
      logger.error("Error fetching artist profile:", error);
      toast.error(`Failed to load artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    logger.info(`Form field changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSocialPlatformChange = (index: number, value: string) => {
    const updatedPlatforms = [...formData.social_platforms];
    updatedPlatforms[index] = value;
    logger.info(`Social platform ${index} changed to: ${value}`);
    setFormData(prev => ({
      ...prev,
      social_platforms: updatedPlatforms
    }));
  };
  
  const addSocialPlatform = () => {
    logger.info("Adding new social platform field");
    setFormData(prev => ({
      ...prev,
      social_platforms: [...prev.social_platforms, ""]
    }));
  };
  
  const removeSocialPlatform = (index: number) => {
    if (formData.social_platforms.length <= 1) return;
    
    logger.info(`Removing social platform at index ${index}`);
    const updatedPlatforms = [...formData.social_platforms];
    updatedPlatforms.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      social_platforms: updatedPlatforms
    }));
  };
  
  const handleImageChange = (imageUrl: string | null) => {
    logger.info(`Image URL changed to: ${imageUrl}`);
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isDemo = artistId === "demo";
    const effectiveArtistId = isDemo ? "25" : artistId;
    
    logger.info("Form submission started with artist ID:", effectiveArtistId, isDemo ? "(Demo Mode)" : "");
    
    try {
      setSaving(true);
      logger.info("Submitting artist profile form data:", formData);
      
      const result = await saveArtistProfile(formData, effectiveArtistId, artist);
      
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
