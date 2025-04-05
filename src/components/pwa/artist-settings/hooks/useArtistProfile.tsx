
import { useState, useEffect } from 'react';
import { useSaveArtistProfile } from './useSaveArtistProfile';
import { useFormHandling } from './useFormHandling';
import { useFetchArtistProfile } from './useFetchArtistProfile';
import { ArtistProfile } from '../types';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { mapArtistToFormData } from '../utils/formDataMapper';

export const useArtistProfile = (artistId: string | null) => {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const { formData, setFormData, handleChange } = useFormHandling();
  const { fetchProfile, isLoading } = useFetchArtistProfile();
  const { saveProfile, isSaving } = useSaveArtistProfile();

  useEffect(() => {
    const loadArtistProfile = async () => {
      if (!artistId) return;
      
      try {
        const fetchedArtist = await fetchProfile(artistId);
        if (fetchedArtist) {
          setArtist(fetchedArtist);
          setFormData(mapArtistToFormData(fetchedArtist));
        }
      } catch (error) {
        logger.error("Error loading artist profile:", error);
        toast.error("Failed to load artist profile");
      }
    };

    loadArtistProfile();
  }, [artistId, fetchProfile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artistId) return;
    
    const isDemo = artistId === "demo";
    const effectiveArtistId = isDemo ? "25" : artistId;
    
    const result = await saveProfile(formData as any, effectiveArtistId, (updatedArtist: ArtistProfile) => {
      setArtist(updatedArtist);
      
      // For new artists, update the URL
      if (!artistId || artistId === 'new') {
        window.location.href = window.location.href.replace('isCreatingNew=true', 
          `selectedArtistId=${updatedArtist.id}`);
      }
    });
    
    return result;
  };

  return {
    artist,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isLoading,
    isSaving
  };
};
