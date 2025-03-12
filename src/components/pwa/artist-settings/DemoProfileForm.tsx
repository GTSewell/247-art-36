
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "./BasicInfoForm";
import LocationForm from "./LocationForm";
import ArtistTags from "./ArtistTags";
import { ArtistProfileFormData } from "./types";

interface DemoProfileFormProps {
  formData: ArtistProfileFormData;
}

const DemoProfileForm: React.FC<DemoProfileFormProps> = ({ formData }) => {
  const handleDisabledAction = () => {
    toast.info('Changes are disabled in the demo account');
  };

  return (
    <div className="space-y-6">
      <BasicInfoForm
        formData={formData}
        onChange={handleDisabledAction}
        disabled={true}
      />
      
      <LocationForm
        formData={{
          location: formData.location,
          city: formData.city,
          country: formData.country
        }}
        onChange={handleDisabledAction}
        disabled={true}
      />
      
      <ArtistTags
        label="Techniques"
        tags={formData.techniques.split(',').map(tag => tag.trim())}
        onTagsChange={handleDisabledAction}
        placeholder="Add techniques"
        disabled={true}
      />
      
      <ArtistTags
        label="Styles"
        tags={formData.styles.split(',').map(tag => tag.trim())}
        onTagsChange={handleDisabledAction}
        placeholder="Add styles"
        disabled={true}
      />
      
      <div className="flex justify-end">
        <Button 
          disabled={true}
          onClick={handleDisabledAction}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default DemoProfileForm;
