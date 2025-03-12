
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArtistProfileFormData } from "./types";

interface BasicInfoFormProps {
  formData: ArtistProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSocialPlatformChange?: (platform: string, username: string) => void;
  onAddSocialPlatform?: (platform: string) => void;
  onRemoveSocialPlatform?: (platform: string) => void;
  disabled?: boolean;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  formData, 
  onChange,
  onSocialPlatformChange,
  onAddSocialPlatform,
  onRemoveSocialPlatform,
  disabled
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Artist Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Your artist name"
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialty">Specialty</Label>
        <Input
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={onChange}
          placeholder="Your specialty"
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onChange}
          placeholder="Tell us about yourself"
          rows={5}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default BasicInfoForm;
