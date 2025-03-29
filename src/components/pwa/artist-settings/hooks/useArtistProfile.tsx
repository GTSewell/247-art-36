
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
    if (artistId) {
      fetchArtistProfileData();
    } else {
      setLoading(false);
    }
  }, [artistId]);
  
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
    
    if (!artistId) {
      toast.error("Artist ID not found");
      return;
    }
    
    try {
      setSaving(true);
      logger.info("Submitting artist profile form data:", formData);
      
      const result = await saveArtistProfile(formData, artistId, artist);
      
      if (result.success) {
        toast.success(result.message);
        
        // If we created a new profile or updated an existing one, refresh data
        fetchArtistProfileData();
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
