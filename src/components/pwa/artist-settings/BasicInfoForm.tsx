
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArtistProfileFormData } from "./types";
import ImageUpload from "./ImageUpload";

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
      <h2 className="text-lg font-semibold">Basic Information</h2>
      
      <div className="flex flex-col items-center mb-4">
        <ImageUpload 
          currentImage={formData.image} 
          onImageChange={handleImageChange} 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Artist Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your artist name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="specialty" className="text-sm font-medium">
            Specialty
          </label>
          <Input
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            placeholder="e.g., Contemporary Painter, Digital Artist"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Artist Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell your story as an artist..."
            rows={5}
            className="min-h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
