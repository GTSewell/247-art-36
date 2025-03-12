
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData, ArtistProfileHookReturn } from "./types";
import { fetchArtistProfile, saveArtistProfile } from "./api/artistProfileAPI";
import { mapArtistToFormData } from "./utils/formDataMapper";
import { parseSocialPlatforms } from "./utils/socialPlatformUtils";

export const useArtistProfile = (artistId: string | null): ArtistProfileHookReturn => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artist, setArtist] = useState<any>(null);
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: "",
    specialty: "",
    bio: "",
    location: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: []
  });
  
  useEffect(() => {
    if (artistId) {
      fetchArtistProfileData();
    }
  }, [artistId]);
  
  const fetchArtistProfileData = async () => {
    try {
      setLoading(true);
      
      if (!artistId) {
        throw new Error("User ID not found");
      }
      
      const { data, error } = await fetchArtistProfile(artistId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // If artist profile exists, load it
        setArtist(data);
        
        // Map API data to form data
        setFormData(mapArtistToFormData(data));
      }
    } catch (error: any) {
      console.error("Error fetching artist profile:", error);
      toast.error(`Failed to load artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
    
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setSaving(true);
      
      const result = await saveArtistProfile(formData, artistId, artist);
      
      if (result.success) {
        toast.success(result.message);
        
        // If we created a new profile, fetch it to update the state
        if (!artist) {
          fetchArtistProfileData();
        }
      } else {
        throw new Error(result.message);
      }
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
    handleSubmit
  };
};
