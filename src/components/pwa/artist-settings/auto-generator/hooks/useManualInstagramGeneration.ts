import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../../types";
import { formatManualInstagramData } from "../profileGenerationUtils";

export const useManualInstagramGeneration = (
  onProfileGenerated: (profileData: Partial<ArtistProfileFormData>) => void,
  artistId: string | null,
  onShowSaveModal?: () => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const generateFromManualInstagram = async (manualData: any) => {
    setIsGenerating(true);
    setTotalSteps(2); // Manual data processing + AI generation
    setCurrentStep(0);
    setGenerationProgress('📝 Processing your manual Instagram data...');

    try {
      setCurrentStep(1);
      setGenerationProgress('🎨 Creating your AI-enhanced profile...');

      // Use the manual Instagram data directly with AI enhancement
      const { data, error } = await supabase.functions.invoke('auto-generate-profile', {
        body: {
          manualInstagramData: manualData,
          artistId
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate profile from manual Instagram data');
      }

      setCurrentStep(2);
      setGenerationProgress('✨ Finalizing your Instagram-powered profile...');

      const formattedData = formatManualInstagramData(data.profileData, manualData);
      onProfileGenerated(formattedData);
      
      toast.success('🎉 Profile generated from your Instagram data! AI enhanced your manual input to create a professional profile.');
      
      // Show save modal if callback is provided
      if (onShowSaveModal) {
        onShowSaveModal();
      }
    } catch (error: any) {
      console.error('Error generating profile from manual Instagram data:', error);
      
      let errorMessage = error.message;
      
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
    generateFromManualInstagram
  };
};