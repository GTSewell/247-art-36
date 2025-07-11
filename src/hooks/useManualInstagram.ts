import { useState } from 'react';

export interface ManualInstagramData {
  username: string;
  bio: string;
  fullName: string;
  profileImageFile: File | null;
  profileImageUrl: string;
}

export const useManualInstagram = () => {
  const [manualData, setManualData] = useState<ManualInstagramData>({
    username: '',
    bio: '',
    fullName: '',
    profileImageFile: null,
    profileImageUrl: ''
  });

  const updateManualData = (updates: Partial<ManualInstagramData>) => {
    setManualData(prev => ({ ...prev, ...updates }));
  };

  const validateUsername = (username: string): boolean => {
    // Basic Instagram username validation
    const instagramUsernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    return instagramUsernameRegex.test(username);
  };

  const clearManualData = () => {
    setManualData({
      username: '',
      bio: '',
      fullName: '',
      profileImageFile: null,
      profileImageUrl: ''
    });
  };

  const formatForProfileGeneration = () => {
    return {
      name: manualData.fullName || manualData.username,
      bio: manualData.bio,
      profile_image: manualData.profileImageUrl,
      social_platforms: [`https://instagram.com/${manualData.username}`],
      specialty: '', // Will be filled by AI based on bio
      techniques: '', // Will be filled by AI based on bio
      styles: '' // Will be filled by AI based on bio
    };
  };

  return {
    manualData,
    updateManualData,
    validateUsername,
    clearManualData,
    formatForProfileGeneration
  };
};