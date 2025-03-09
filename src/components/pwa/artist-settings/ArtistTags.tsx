
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";

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
        <div className="text-xs text-gray-500 flex items-start gap-1 mb-1">
          <Info className="h-3 w-3 mt-0.5" />
          <span>Enter full URLs (e.g., www.instagram.com/username) or just the platform name and username</span>
        </div>
        <Input
          id="social_platforms"
          name="social_platforms"
          value={formData.social_platforms}
          onChange={handleChange}
          placeholder="www.instagram.com/username, twitter.com/username, etc."
        />
      </div>
    </>
  );
};

export default ArtistTags;
