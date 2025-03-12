
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
  // Helper function to handle social platform input
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Clean up formats to prevent duplications like instagram.com/instagram.com/username
    const cleanedValue = value
      .split(',')
      .map(platform => platform.trim())
      .map(platform => {
        // Remove duplicate domain prefixes
        if (platform.includes('instagram.com/instagram.com/')) {
          return platform.replace('instagram.com/instagram.com/', 'instagram.com/');
        }
        if (platform.includes('twitter.com/twitter.com/') || platform.includes('x.com/x.com/')) {
          return platform.replace(/(?:twitter\.com\/twitter\.com\/|x\.com\/x\.com\/)/, 'twitter.com/');
        }
        return platform;
      })
      .join(', ');

    // Create a synthetic event with the cleaned value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: cleanedValue
      }
    };

    handleChange(syntheticEvent);
  };

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
          <span>Add just usernames or full URLs. Examples:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs text-gray-500">
          <div>• instagram.com/username</div>
          <div>• twitter.com/username</div>
          <div>• @username (for Instagram)</div>
          <div>• facebook.com/username</div>
        </div>
        <Input
          id="social_platforms"
          name="social_platforms"
          value={formData.social_platforms}
          onChange={handleSocialChange}
          placeholder="instagram.com/username, twitter.com/username, etc."
        />
      </div>
    </>
  );
};

export default ArtistTags;
