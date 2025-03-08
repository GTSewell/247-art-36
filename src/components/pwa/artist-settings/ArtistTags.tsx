
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ArtistTagsProps {
  formData: {
    techniques: string;
    styles: string;
    social_platforms: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ArtistTags: React.FC<ArtistTagsProps> = ({ formData, handleChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="techniques">Techniques (comma separated)</Label>
        <Input
          id="techniques"
          name="techniques"
          value={formData.techniques}
          onChange={handleChange}
          placeholder="Oil, Acrylic, Digital, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="styles">Styles (comma separated)</Label>
        <Input
          id="styles"
          name="styles"
          value={formData.styles}
          onChange={handleChange}
          placeholder="Abstract, Modern, Pop Art, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="social_platforms">Social Platforms (comma separated)</Label>
        <Input
          id="social_platforms"
          name="social_platforms"
          value={formData.social_platforms}
          onChange={handleChange}
          placeholder="Instagram, Twitter, Facebook, etc."
        />
      </div>
    </>
  );
};

export default ArtistTags;
