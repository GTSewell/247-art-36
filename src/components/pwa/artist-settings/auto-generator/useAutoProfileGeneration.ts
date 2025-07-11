import { useUrlProfileGeneration } from "./hooks/useUrlProfileGeneration";
import { useInstagramProfileGeneration } from "./hooks/useInstagramProfileGeneration";
import { useManualInstagramGeneration } from "./hooks/useManualInstagramGeneration";
import { ArtistProfileFormData } from "../types";

export const useAutoProfileGeneration = (
  onProfileGenerated: (profileData: Partial<ArtistProfileFormData>) => void,
  artistId: string | null,
  onShowSaveModal?: () => void
) => {
  // Use specialized hooks for each generation type
  const urlGeneration = useUrlProfileGeneration(onProfileGenerated, artistId, onShowSaveModal);
  const instagramGeneration = useInstagramProfileGeneration(onProfileGenerated, onShowSaveModal);
  const manualInstagramGeneration = useManualInstagramGeneration(onProfileGenerated, artistId, onShowSaveModal);

  // Combine state from all hooks to determine overall generation status
  const isGenerating = urlGeneration.isGenerating || instagramGeneration.isGenerating || manualInstagramGeneration.isGenerating;
  const generationProgress = urlGeneration.generationProgress || instagramGeneration.generationProgress || manualInstagramGeneration.generationProgress;
  const currentStep = urlGeneration.currentStep || instagramGeneration.currentStep || manualInstagramGeneration.currentStep;
  const totalSteps = urlGeneration.totalSteps || instagramGeneration.totalSteps || manualInstagramGeneration.totalSteps;

  return {
    isGenerating,
    generationProgress,
    currentStep,
    totalSteps,
    generateProfile: urlGeneration.generateProfile,
    generateFromInstagram: instagramGeneration.generateFromInstagram,
    generateFromManualInstagram: manualInstagramGeneration.generateFromManualInstagram
  };
};