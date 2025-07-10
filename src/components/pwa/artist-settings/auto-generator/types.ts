export interface AutoProfileGeneratorProps {
  onProfileGenerated: (profileData: Partial<import('../types').ArtistProfileFormData>) => void;
  artistId: string | null;
}

export interface ProgressIndicatorProps {
  isGenerating: boolean;
  generationProgress: string;
  currentStep: number;
  totalSteps: number;
}

export interface UrlInputFieldsProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
}

export interface AutoProfileActionsProps {
  onGenerate: () => void;
  onCancel: () => void;
  isGenerating: boolean;
  generationProgress: string;
}