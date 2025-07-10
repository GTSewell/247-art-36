
import { useState, useEffect } from 'react';
import { useSaveArtistProfile } from './useSaveArtistProfile';
import { useFormHandling } from './useFormHandling';
import { fetchArtistProfile } from '../api/fetch/fetchArtistProfile';
import { ArtistProfile, ArtistProfileFormData } from '../types';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { mapArtistToFormData } from '../utils/formDataMapper';
import { supabase } from '@/integrations/supabase/client';

export const useArtistProfile = (artistId: string | null) => {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { formData, setFormData, handleChange, handleSocialPlatformChange, addSocialPlatform, removeSocialPlatform, handleImageChange, handleBackgroundChange } = useFormHandling();
  const { saveProfile, isSaving } = useSaveArtistProfile();

  useEffect(() => {
    const loadArtistProfile = async () => {
      if (!artistId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // If artist ID is specifically set to "demo", fetch the Demo Artist (id: 25)
        const effectiveId = artistId === "demo" ? "25" : artistId;
        
        logger.info("Fetching artist profile for artist ID:", effectiveId);
        const { data, error } = await fetchArtistProfile(effectiveId);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          logger.info("Artist profile data retrieved:", data);
          setArtist(data);
          
          // Map API data to form data
          const mappedFormData = mapArtistToFormData(data);
          logger.info("Mapped form data:", mappedFormData);
          setFormData(mappedFormData);

          // Fetch background image from artist_profiles table
          const numericId = parseInt(effectiveId, 10);
          if (!isNaN(numericId)) {
            try {
              const { data: profileData } = await supabase
                .from('artist_profiles')
                .select('background_image')
                .eq('artist_id', numericId)
                .maybeSingle();
              
              if (profileData?.background_image) {
                setBackgroundImage(profileData.background_image);
                setFormData(prev => ({ ...prev, backgroundImage: profileData.background_image }));
              }
            } catch (profileError) {
              console.error("Error fetching artist profile background:", profileError);
            }
          }
        }
      } catch (error: any) {
        logger.error("Error loading artist profile:", error);
        toast.error("Failed to load artist profile");
      } finally {
        setLoading(false);
      }
    };

    loadArtistProfile();
  }, [artistId, setFormData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    logger.info("Form submission triggered", { artistId, formData });
    
    try {
      const isDemo = artistId === "demo";
      const effectiveArtistId = isDemo ? "25" : artistId;
      
      logger.info("Saving artist profile with ID:", { artistId, effectiveArtistId });
      
      const result = await saveProfile(formData, effectiveArtistId);
      
      if (result.success && result.data) {
        setArtist(result.data);
        
        // For new artists, update the URL
        if (!artistId || artistId === 'new') {
          // Navigate to the new artist's edit page
          const newId = result.data.id;
          logger.info("New artist created with ID:", newId);
          
          // Use the window.location.replace to avoid adding to browser history stack
          window.location.href = window.location.href.replace('isCreatingNew=true', 
            `selectedArtistId=${newId}`);
        }
      }
      
      return result;
    } catch (error: any) {
      logger.error("Form submission error:", error);
      toast.error(`Error saving artist: ${error.message}`);
      return { 
        success: false, 
        message: error.message,
        data: null
      };
    }
  };

  return {
    artist,
    formData,
    loading,
    saving: isSaving,
    backgroundImage,
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange,
    handleBackgroundChange,
    handleSubmit
  };
};
