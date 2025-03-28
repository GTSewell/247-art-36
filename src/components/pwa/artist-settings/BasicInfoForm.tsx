
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
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  formData, 
  handleChange,
  handleImageChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        <ImageUpload 
          currentImage={formData.image} 
          onImageChange={handleImageChange}
          artistName={formData.name}
        />
        
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Your artistic specialty (e.g., Painter, Sculptor, etc.)"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself and your art..."
          className="resize-none min-h-[120px]"
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
