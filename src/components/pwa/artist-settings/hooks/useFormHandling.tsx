
import { useState } from "react";
import { logger } from "@/utils/logger";
import { ArtistProfileFormData } from "../types";

export const useFormHandling = () => {
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: "",
    specialty: "",
    bio: "",
    profileImage: "",
    backgroundImage: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: [""],
    image: null,
    published: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    logger.info(`Form field changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSocialPlatformChange = (index: number, value: string) => {
    const updatedPlatforms = [...formData.social_platforms];
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
    if (formData.social_platforms.length <= 1) return;
    
    logger.info(`Removing social platform at index ${index}`);
    const updatedPlatforms = [...formData.social_platforms];
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
      profileImage: imageUrl || "",
      image: imageUrl
    }));
  };

  const handleBackgroundChange = (backgroundUrl: string | null) => {
    logger.info(`Background URL changed to: ${backgroundUrl}`);
    setFormData(prev => ({
      ...prev,
      backgroundImage: backgroundUrl || ""
    }));
  };
  
  return {
    formData,
    setFormData,
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange,
    handleBackgroundChange
  };
};
