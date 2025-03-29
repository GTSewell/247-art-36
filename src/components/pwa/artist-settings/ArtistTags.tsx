
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ArtistProfileFormData } from "./types";

interface ArtistTagsProps {
  formData: ArtistProfileFormData;
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
    <div className="space-y-8">
      <div>
        <Label htmlFor="techniques">Techniques</Label>
        <Input
          id="techniques"
          name="techniques"
          value={formData.techniques}
          onChange={handleChange}
          placeholder="e.g. Oil Painting, Charcoal, Digital"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Separate with commas
        </p>
      </div>
      
      <div>
        <Label htmlFor="styles">Styles</Label>
        <Input
          id="styles"
          name="styles"
          value={formData.styles}
          onChange={handleChange}
          placeholder="e.g. Abstract, Impressionism, Modern"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Separate with commas
        </p>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Social Media</Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={addSocialPlatform}
            className="h-7 px-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another
          </Button>
        </div>
        
        {formData.social_platforms.map((platform, index) => (
          <div key={index} className="flex mb-2 gap-2">
            <Input
              value={platform}
              onChange={(e) => handleSocialPlatformChange(index, e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            {formData.social_platforms.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeSocialPlatform(index)}
                className="h-10 w-10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-1">
          Add full URLs to your social media profiles
        </p>
      </div>
    </div>
  );
};

export default ArtistTags;
