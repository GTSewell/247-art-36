
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface ArtistProfileFormData {
  name: string;
  specialty: string;
  bio: string;
  city: string;
  country: string;
  techniques: string;
  styles: string;
  social_platforms: string;
  published: boolean;
  profile_image_url: string;
}

export const useArtistProfile = (userId: string | null) => {
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
    published: false,
    profile_image_url: ""
  });
  
  useEffect(() => {
    if (userId) {
      fetchArtistProfile();
    }
  }, [userId]);
  
  const fetchArtistProfile = async () => {
    try {
      setLoading(true);
      
      // Check if user already has an artist profile
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching artist profile:", error);
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
            : typeof data.social_platforms === 'string' ? data.social_platforms : "",
          published: data.published || false,
          profile_image_url: data.profile_image_url || data.image || ""
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
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleProfileImageUpload = async (file: File) => {
    if (!userId) {
      toast.error("User ID not found");
      return null;
    }

    try {
      setSaving(true);
      
      // Create a unique filename using the artist ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      setFormData(prev => ({
        ...prev,
        profile_image_url: publicUrl
      }));
      
      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      toast.error(`Failed to upload profile image: ${error.message}`);
      return null;
    } finally {
      setSaving(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setSaving(true);
      
      // Process array values
      const processedData = {
        user_id: userId,
        name: formData.name,
        specialty: formData.specialty,
        bio: formData.bio,
        city: formData.city,
        country: formData.country,
        techniques: formData.techniques.split(',').map(item => item.trim()),
        styles: formData.styles.split(',').map(item => item.trim()),
        social_platforms: formData.social_platforms.split(',').map(item => item.trim()),
        published: formData.published,
        profile_image_url: formData.profile_image_url,
        image: formData.profile_image_url // Set image field to same value for backward compatibility
      };
      
      if (artist) {
        // Update existing artist profile
        const { error } = await supabase
          .from('artists')
          .update(processedData)
          .eq('user_id', userId);
        
        if (error) throw error;
        
        toast.success("Profile updated successfully");
      } else {
        // Create new artist profile - we need to generate a numeric ID
        // First, get the next available ID by checking the max ID in the table
        const { data: maxIdData, error: maxIdError } = await supabase
          .from('artists')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();
          
        if (maxIdError && !maxIdError.message.includes('No rows found')) {
          throw maxIdError;
        }
        
        // Set the new ID as max + 1, or start at 1 if no records exist
        const newId = maxIdData ? maxIdData.id + 1 : 1;
        
        // Create new artist profile with the ID
        const { error } = await supabase
          .from('artists')
          .insert([{ ...processedData, id: newId }]);
        
        if (error) throw error;
        
        toast.success("Profile created successfully");
        
        // Fetch the newly created profile to update the UI
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
    handleCheckboxChange,
    handleProfileImageUpload,
    handleSubmit
  };
};
