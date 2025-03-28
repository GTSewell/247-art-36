
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtistTagsProps {
  formData: {
    techniques: string;
    styles: string;
    social_platforms: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSocialPlatformChange: (index: number, value: string) => void;
  addSocialPlatform: () => void;
  removeSocialPlatform: (index: number) => void;
}

const ArtistTags: React.FC<ArtistTagsProps> = ({ 
  formData, 
  handleChange, 
  handleSocialPlatformChange,
  addSocialPlatform,
  removeSocialPlatform
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="techniques">Techniques (comma separated)</Label>
        <Input
          id="techniques"
          name="techniques"
          value={formData.techniques || ''}
          onChange={handleChange}
          placeholder="Oil, Acrylic, Digital, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="styles">Styles (comma separated)</Label>
        <Input
          id="styles"
          name="styles"
          value={formData.styles || ''}
          onChange={handleChange}
          placeholder="Abstract, Modern, Pop Art, etc."
        />
      </div>
      
      <div className="space-y-3">
        <Label>Social Platforms</Label>
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
        
        {formData.social_platforms.map((platform, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={platform}
              onChange={(e) => handleSocialPlatformChange(index, e.target.value)}
              placeholder="instagram.com/username"
              className="flex-1"
            />
            {formData.social_platforms.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeSocialPlatform(index)}
                className="h-9 w-9 text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSocialPlatform}
          className="mt-2 flex items-center"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Another
        </Button>
      </div>
    </>
  );
};

export default ArtistTags;
