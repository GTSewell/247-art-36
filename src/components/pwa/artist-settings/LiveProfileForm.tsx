
import React from "react";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "./BasicInfoForm";
import LocationForm from "./LocationForm";
import ArtistTags from "./ArtistTags";
import { ArtistProfileFormData } from "./types";

interface LiveProfileFormProps {
  formData: ArtistProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSocialPlatformChange: (platform: string, username: string) => void;
  onAddSocialPlatform: (platform: string) => void;
  onRemoveSocialPlatform: (platform: string) => void;
  onTagsChange: (label: string, tags: string[]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const LiveProfileForm: React.FC<LiveProfileFormProps> = ({
  formData,
  onChange,
  onSocialPlatformChange,
  onAddSocialPlatform,
  onRemoveSocialPlatform,
  onTagsChange,
  onSubmit
}) => {
  return (
    <div className="space-y-6">
      <BasicInfoForm
        formData={formData}
        onChange={onChange}
        onSocialPlatformChange={onSocialPlatformChange}
        onAddSocialPlatform={onAddSocialPlatform}
        onRemoveSocialPlatform={onRemoveSocialPlatform}
      />
      
      <LocationForm
        formData={formData}
        onChange={onChange}
      />
      
      <ArtistTags
        label="Techniques"
        tags={formData.techniques ? formData.techniques.split(',').map(tag => tag.trim()) : []}
        onTagsChange={onTagsChange}
        placeholder="Add techniques"
      />
      
      <ArtistTags
        label="Styles"
        tags={formData.styles ? formData.styles.split(',').map(tag => tag.trim()) : []}
        onTagsChange={onTagsChange}
        placeholder="Add styles"
      />
      
      <div className="flex justify-end">
        <Button onClick={onSubmit}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default LiveProfileForm;
