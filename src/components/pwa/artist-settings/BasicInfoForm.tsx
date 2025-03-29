
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
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          placeholder="A brief description of the artist's background, experience, and artistic philosophy"
          rows={5}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
