
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData, ArtistProfileHookReturn } from "../types";
import { fetchArtistProfile, saveArtistProfile } from "../api/artistProfileAPI";
import { mapArtistToFormData } from "../utils/formDataMapper";

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
    social_platforms: "",
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
      
      console.log("Fetching artist profile for artist ID:", artistId);
      const { data, error } = await fetchArtistProfile(artistId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Artist profile data retrieved:", data);
        // If artist profile exists, load it
        setArtist(data);
        
        // Map API data to form data
        const mappedFormData = mapArtistToFormData(data);
        console.log("Mapped form data:", mappedFormData);
        setFormData(mappedFormData);
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
  
  const handleImageChange = (imageUrl: string | null) => {
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
      console.log("Submitting artist profile form data:", formData);
      
      const result = await saveArtistProfile(formData, artistId, artist);
      
      if (result.success) {
        toast.success(result.message);
        
        // If we created a new profile or updated an existing one, refresh data
        fetchArtistProfileData();
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
    handleImageChange,
    handleSubmit
  };
};
