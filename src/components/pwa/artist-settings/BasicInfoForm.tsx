
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./ImageUpload";
import { ArtistProfileFormData } from "./types";

interface BasicInfoFormProps {
  formData: ArtistProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageChange: (imageUrl: string | null) => void;
  artistId?: number;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData,
  handleChange,
  handleImageChange,
  artistId
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <ImageUpload 
          currentImage={formData.image} 
          onImageChange={handleImageChange} 
          artistName={formData.name}
          artistId={artistId}
        />
        
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter artist name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="e.g. Oil Painter, Digital Artist, Sculptor"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="highlight_bio">Highlight Bio</Label>
        <Textarea
          id="highlight_bio"
          name="highlight_bio"
          value={formData.highlight_bio || ""}
          onChange={handleChange}
          placeholder="Short, engaging 1-2 sentence artist introduction for previews and modals"
          rows={2}
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          Used in artist cards, modals, and quick previews (max 200 characters)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Full Biography</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          placeholder="Detailed 1-3 paragraph artist biography including background, artistic journey, achievements, and style"
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Used on full artist profile pages and detailed information sections
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;
