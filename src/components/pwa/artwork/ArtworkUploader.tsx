
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ArtworkUploaderProps {
  onUpload: (file: File) => Promise<boolean>;
  isUploading: boolean;
}

const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({ onUpload, isUploading }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const success = await onUpload(file);
    
    // Clear the file input if upload was successful
    if (success) {
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="artwork-upload" className="mb-2">Upload new artwork</Label>
      <div className="flex items-center gap-2">
        <input
          id="artwork-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <Button 
          onClick={() => document.getElementById('artwork-upload')?.click()}
          disabled={isUploading}
          className="w-full bg-zap-yellow hover:bg-zap-blue text-black hover:text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Artwork"}
        </Button>
      </div>
    </div>
  );
};

export default ArtworkUploader;
