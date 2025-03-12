
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";

interface ArtistTagsProps {
  label: string;
  tags: string[];
  onTagsChange: (label: string, tags: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}

const ArtistTags: React.FC<ArtistTagsProps> = ({ 
  label, 
  tags,
  onTagsChange,
  placeholder,
  disabled
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onTagsChange(label, newTags);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label} (comma separated)</Label>
      <Input
        id={label.toLowerCase()}
        name={label.toLowerCase()}
        value={tags.join(', ')}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default ArtistTags;
