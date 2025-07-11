import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { AutoProfileGeneratorProps } from "./auto-generator/types";
import { useAutoProfileGeneration } from "./auto-generator/useAutoProfileGeneration";
import { useInstagramAuth } from "@/hooks/useInstagramAuth";
import CollapsedView from "./auto-generator/CollapsedView";
import UrlInputFields from "./auto-generator/UrlInputFields";
import ProgressIndicator from "./auto-generator/ProgressIndicator";
import AutoProfileActions from "./auto-generator/AutoProfileActions";
import SaveAutoGenModal from "./auto-generator/SaveAutoGenModal";
import InstagramIntegration from "./auto-generator/InstagramIntegration";

const AutoProfileGenerator: React.FC<AutoProfileGeneratorProps> = ({
  onProfileGenerated,
  artistId,
  onSaveProfile,
  isSaving
}) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { isConnected } = useInstagramAuth();
  
  const {
    isGenerating,
    generationProgress,
    currentStep,
    totalSteps,
    generateProfile,
    generateFromInstagram
  } = useAutoProfileGeneration(onProfileGenerated, artistId, () => setShowSaveModal(true));

  const handleGenerate = () => {
    generateProfile(urls);
    setIsExpanded(false);
  };

  const handleSaveAutoGen = () => {
    if (onSaveProfile) {
      onSaveProfile();
    }
    setShowSaveModal(false);
  };

  const handleUseInstagramData = () => {
    generateFromInstagram();
    setIsExpanded(false);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  if (!isExpanded) {
    return <CollapsedView onExpand={() => setIsExpanded(true)} />;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Auto-Generate Profile
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add your social media profiles, website, or portfolio links. AI will analyze them to create your artist profile.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <InstagramIntegration 
          onUseInstagramData={handleUseInstagramData}
          className="mb-4"
        />

        <UrlInputFields urls={urls} onUrlsChange={setUrls} />

        <ProgressIndicator
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <AutoProfileActions
          onGenerate={handleGenerate}
          onCancel={() => setIsExpanded(false)}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
        />

        <div className="text-xs text-muted-foreground">
          <p>• We'll analyze publicly available information from your links</p>
          <p>• You can review and edit all generated content before saving</p>
          <p>• Only accessible content will be used</p>
        </div>
      </CardContent>

      <SaveAutoGenModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveAutoGen}
        onCancel={handleCancelSave}
        isSaving={isSaving || false}
      />
    </Card>
  );
};

export default AutoProfileGenerator;