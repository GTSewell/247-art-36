import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../../types";
import { isValidUrl, getPlatformName } from "../utils";
import { formatProfileData, getEnhancedErrorMessage } from "../profileGenerationUtils";

export const useUrlProfileGeneration = (
  onProfileGenerated: (profileData: Partial<ArtistProfileFormData>) => void,
  artistId: string | null,
  onShowSaveModal?: () => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const generateProfile = async (urls: string[]) => {
    const validUrls = urls.filter(url => url.trim() && isValidUrl(url.trim()));
    
    if (validUrls.length === 0) {
      toast.error('Please enter at least one valid URL');
      return;
    }

    setIsGenerating(true);
    setTotalSteps(validUrls.length + 2); // URLs + AI generation + formatting
    setCurrentStep(0);
    setGenerationProgress('🚀 Starting enhanced profile generation...');

    try {
      // Simulate progress updates for each URL
      for (let i = 0; i < validUrls.length; i++) {
        setCurrentStep(i + 1);
        const url = validUrls[i];
        const platform = getPlatformName(url);
        
        setGenerationProgress(`🔍 Reading your ${platform} profile...`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Visual delay for UX
      }

      setCurrentStep(totalSteps - 1);
      setGenerationProgress('🎨 Crafting your professional artist profile...');

      const { data, error } = await supabase.functions.invoke('auto-generate-profile', {
        body: {
          urls: validUrls,
          artistId
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate profile');
      }

      setCurrentStep(totalSteps);
      setGenerationProgress('✨ Finalizing your profile...');

      const formattedData = formatProfileData(data.profileData);
      onProfileGenerated(formattedData);
      
      // Enhanced success message with detailed results
      const filledFields = Object.values(formattedData).filter(value => {
        if (!value) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      }).length;
      
      toast.success(`🎉 Profile generated successfully! Filled ${filledFields} fields from ${data.processedUrls} of ${data.totalUrls} URLs.`);
      
      // Show save modal if callback is provided
      if (onShowSaveModal) {
        onShowSaveModal();
      }
    } catch (error: any) {
      console.error('Error generating profile:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      });
      
      const errorMessage = getEnhancedErrorMessage(error, validUrls);
      
      toast.error(`Failed to generate profile: ${errorMessage}`, {
        duration: 8000,
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
      setCurrentStep(0);
      setTotalSteps(0);
    }
  };

  return {
    isGenerating,
    generationProgress,
    currentStep,
    totalSteps,
    generateProfile
  };
};