
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
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
              placeholder="Artist name"
            />
          </div>
          
          <div>
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="e.g. Painting, Sculpture, Digital Art"
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
          placeholder="Artist biography"
          rows={5}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
