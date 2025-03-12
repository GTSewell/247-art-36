
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationFormProps {
  formData: {
    location?: string;
    city: string;
    country: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ formData, onChange, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="Your city"
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={onChange}
          placeholder="Your country"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default LocationForm;
