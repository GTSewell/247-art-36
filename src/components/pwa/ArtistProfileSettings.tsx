
import React from "react";
import { useProfileForm } from "./artist-settings/hooks/useProfileForm";
import DemoProfileForm from "./artist-settings/DemoProfileForm";
import LiveProfileForm from "./artist-settings/LiveProfileForm";

interface ArtistProfileSettingsProps {
  artistId: string | null;
}

const ArtistProfileSettings: React.FC<ArtistProfileSettingsProps> = ({ artistId }) => {
  const {
    formData,
    isLoading,
    demoMode,
    handleChange,
    handleSubmit,
    handleSocialPlatformChange,
    handleAddSocialPlatform,
    handleRemoveSocialPlatform,
    handleTagsChange
  } = useProfileForm(artistId);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  // If this is the demo artist account, show demo data
  if (demoMode) {
    return <DemoProfileForm formData={formData} />;
  }

  return (
    <LiveProfileForm
      formData={formData}
      onChange={handleChange}
      onSocialPlatformChange={handleSocialPlatformChange}
      onAddSocialPlatform={handleAddSocialPlatform}
      onRemoveSocialPlatform={handleRemoveSocialPlatform}
      onTagsChange={handleTagsChange}
      onSubmit={handleSubmit}
    />
  );
};

export default ArtistProfileSettings;
