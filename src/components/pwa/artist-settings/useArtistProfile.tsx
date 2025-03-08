
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArtistProfileFormData {
  name: string;
  specialty: string;
  bio: string;
  city: string;
  country: string;
  techniques: string;
  styles: string;
  social_platforms: string;
}

export const useArtistProfile = (artistId: number | null) => {
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
    social_platforms: ""
  });
  
  useEffect(() => {
    if (artistId) {
      fetchArtistProfile();
    }
  }, [artistId]);
  
  const fetchArtistProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setArtist(data);
        setFormData({
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
            : typeof data.social_platforms === 'string' ? data.social_platforms : ""
        });
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
      toast.error("Artist ID not found");
      return;
    }
    
    try {
      setSaving(true);
      
      // Process array values
      const processedData = {
        ...formData,
        techniques: formData.techniques.split(',').map(item => item.trim()),
        styles: formData.styles.split(',').map(item => item.trim()),
        social_platforms: formData.social_platforms.split(',').map(item => item.trim())
      };
      
      const { error } = await supabase
        .from('artists')
        .update(processedData)
        .eq('id', artistId);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
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
