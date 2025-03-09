
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData, ArtistProfileHookReturn } from "./types";
import { fetchArtistProfile, updateArtistProfile, checkUserIsAdmin } from "./artistProfileApi";
import { formatArtistDataForForm } from "./artistProfileUtils";

export const useArtistProfile = (userId: string | null): ArtistProfileHookReturn => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artist, setArtist] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: "",
    specialty: "",
    bio: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: "",
    is_published: false
  });
  
  useEffect(() => {
    if (userId) {
      loadArtistProfile();
      checkAdminStatus();
    }
  }, [userId]);
  
  const loadArtistProfile = async () => {
    try {
      setLoading(true);
      
      if (!userId) return;
      
      const data = await fetchArtistProfile(userId);
      
      if (data) {
        // If artist profile exists, load it
        setArtist(data);
        setFormData(formatArtistDataForForm(data));
      }
    } catch (error: any) {
      console.error("Error fetching artist profile:", error);
      toast.error(`Failed to load artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const checkAdminStatus = async () => {
    if (!userId) return;
    
    const adminStatus = await checkUserIsAdmin(userId);
    setIsAdmin(adminStatus);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setSaving(true);
      
      // If user is not admin, ensure we don't change publish status
      const submissionData = { ...formData };
      if (!isAdmin && artist) {
        // For non-admins, preserve the existing published status
        submissionData.is_published = artist.is_published;
      }
      
      const updatedArtist = await updateArtistProfile(submissionData, userId, artist);
      
      // Update the local artist state with the new data
      if (updatedArtist) {
        setArtist(updatedArtist);
      }
      
      // Refresh the form data after the update
      await loadArtistProfile();
      
    } catch (error: any) {
      console.error("Error updating artist profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    artist,
    formData,
    handleChange,
    handleSubmit,
    isAdmin
  };
};
