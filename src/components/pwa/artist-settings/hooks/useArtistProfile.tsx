
import { useState, useEffect } from 'react';
import { useSaveArtistProfile } from './useSaveArtistProfile';
import { useFormHandling } from './useFormHandling';
import { fetchArtistProfile } from '../api/fetch/fetchArtistProfile';
import { ArtistProfile, ArtistProfileFormData } from '../types';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { mapArtistToFormData } from '../utils/formDataMapper';

export const useArtistProfile = (artistId: string | null) => {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { formData, setFormData, handleChange, handleSocialPlatformChange, addSocialPlatform, removeSocialPlatform, handleImageChange } = useFormHandling();
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
    
    if (!artistId) return;
    
    const isDemo = artistId === "demo";
    const effectiveArtistId = isDemo ? "25" : artistId;
    
    const result = await saveProfile(formData, effectiveArtistId);
    
    if (result.success && result.data) {
      setArtist(result.data);
      
      // For new artists, update the URL
      if (!artistId || artistId === 'new') {
        window.location.href = window.location.href.replace('isCreatingNew=true', 
          `selectedArtistId=${result.data.id}`);
      }
    }
    
    return result;
  };

  return {
    artist,
    formData,
    loading,
    saving: isSaving,
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange,
    handleSubmit
  };
};
