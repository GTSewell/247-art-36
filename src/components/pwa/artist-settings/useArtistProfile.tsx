
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

export const useArtistProfile = (artistId: string | null) => {
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
      
      // First check if user already has an artist profile
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (error) {
        // If no profile exists with user_id, we'll create one later
        console.log("No existing artist profile found, will create a new one if needed");
      }
      
      if (data) {
        // If artist profile exists, load it
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
      toast.error("User ID not found");
      return;
    }
    
    try {
      setSaving(true);
      
      // Process array values
      const processedData = {
        ...formData,
        user_id: artistId,
        techniques: formData.techniques.split(',').map(item => item.trim()),
        styles: formData.styles.split(',').map(item => item.trim()),
        social_platforms: formData.social_platforms.split(',').map(item => item.trim())
      };
      
      if (artist) {
        // Update existing artist profile
        const { error } = await supabase
          .from('artists')
          .update(processedData)
          .eq('id', artist.id);
        
        if (error) throw error;
        
        toast.success("Profile updated successfully");
      } else {
        // For new artist profiles, we need to get a new ID from the sequence
        // First, query to get the next available ID
        const { data: maxIdData, error: maxIdError } = await supabase
          .from('artists')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();
          
        if (maxIdError && !maxIdError.message.includes('No rows found')) {
          throw maxIdError;
        }
        
        // Calculate next ID (either increment max ID or start at 1)
        const nextId = maxIdData ? maxIdData.id + 1 : 1;
        
        // Create new artist profile with the new ID
        const { error } = await supabase
          .from('artists')
          .insert([{
            id: nextId,
            ...processedData,
            published: true // Set published to true by default
          }]);
        
        if (error) throw error;
        
        toast.success("Profile created successfully");
        
        // Fetch the newly created profile to update the state
        fetchArtistProfile();
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
