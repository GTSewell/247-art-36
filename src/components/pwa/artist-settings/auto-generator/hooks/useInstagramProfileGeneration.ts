import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../../types";
import { formatProfileData } from "../profileGenerationUtils";

export const useInstagramProfileGeneration = (
  onProfileGenerated: (profileData: Partial<ArtistProfileFormData>) => void,
  onShowSaveModal?: () => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const generateFromInstagram = async () => {
    setIsGenerating(true);
    setTotalSteps(3); // Connect + Fetch + Generate
    setCurrentStep(0);
    setGenerationProgress('🔗 Connecting to your Instagram account...');

    try {
      setCurrentStep(1);
      setGenerationProgress('📸 Analyzing your Instagram content...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      setCurrentStep(2);
      setGenerationProgress('🎨 Generating your professional profile...');

      const { data, error } = await supabase.functions.invoke('instagram-profile-generator', {
        body: { userId: user.id }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate profile from Instagram');
      }

      setCurrentStep(3);
      setGenerationProgress('✨ Finalizing your Instagram-powered profile...');

      const formattedData = formatProfileData(data.profileData);
      onProfileGenerated(formattedData);
      
      toast.success(`🎉 Profile generated from Instagram! Analyzed ${data.posts_analyzed} posts to create your professional profile.`);
      
      // Show save modal if callback is provided
      if (onShowSaveModal) {
        onShowSaveModal();
      }
    } catch (error: any) {
      console.error('Error generating profile from Instagram:', error);
      
      let errorMessage = error.message;
      if (error.message.includes('No Instagram connection found')) {
        errorMessage = 'Please connect your Instagram account first to use this feature.';
      }
      
      toast.error(`Failed to generate profile from Instagram: ${errorMessage}`, {
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
    generateFromInstagram
  };
};