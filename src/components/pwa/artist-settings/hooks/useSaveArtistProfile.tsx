
import { useState } from 'react';
import { toast } from 'sonner';
import { saveArtistProfile } from '../api/save/saveArtistProfile';
import { logger } from '@/utils/logger';
import { ArtistProfile, ArtistProfileFormData } from '../types';

export const useSaveArtistProfile = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (
    profileData: ArtistProfileFormData,
    artistId: string
  ) => {
    setIsSaving(true);

    try {
      logger.info('Saving artist profile', { artistId, profileData });
      
      const result = await saveArtistProfile(profileData, artistId);
      
      if (result.success) {
        toast.success('Profile saved successfully!');
      } else {
        toast.error(`Failed to save profile: ${result.message}`);
        logger.error('Error saving artist profile:', result.message);
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error?.message || 'An unknown error occurred';
      toast.error(`Error saving profile: ${errorMessage}`);
      logger.error('Exception while saving artist profile:', error);
      
      return { 
        success: false, 
        message: errorMessage,
        data: null
      };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveProfile,
    isSaving
  };
};
