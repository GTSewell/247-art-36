
import { useState } from "react";
import { logger } from "@/utils/logger";
import { ArtistProfileFormData } from "../types";

export const useFormHandling = (
  initialFormData: ArtistProfileFormData,
  setFormData: React.Dispatch<React.SetStateAction<ArtistProfileFormData>>
) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    logger.info(`Form field changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSocialPlatformChange = (index: number, value: string) => {
    const updatedPlatforms = [...initialFormData.social_platforms];
    updatedPlatforms[index] = value;
    logger.info(`Social platform ${index} changed to: ${value}`);
    setFormData(prev => ({
      ...prev,
      social_platforms: updatedPlatforms
    }));
  };
  
  const addSocialPlatform = () => {
    logger.info("Adding new social platform field");
    setFormData(prev => ({
      ...prev,
      social_platforms: [...prev.social_platforms, ""]
    }));
  };
  
  const removeSocialPlatform = (index: number) => {
    if (initialFormData.social_platforms.length <= 1) return;
    
    logger.info(`Removing social platform at index ${index}`);
    const updatedPlatforms = [...initialFormData.social_platforms];
    updatedPlatforms.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      social_platforms: updatedPlatforms
    }));
  };
  
  const handleImageChange = (imageUrl: string | null) => {
    logger.info(`Image URL changed to: ${imageUrl}`);
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };
  
  return {
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange
  };
};
