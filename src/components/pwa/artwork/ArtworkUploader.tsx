
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface ArtworkUploaderProps {
  onUpload: (file: File) => Promise<boolean>;
  isUploading: boolean;
}

const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({ onUpload, isUploading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("File must be an image (JPEG, PNG, WebP, or GIF)");
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5MB");
      return false;
    }
    
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate the file
    if (!validateFile(file)) {
      e.target.value = '';
      return;
    }
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Upload the file
    const success = await onUpload(file);
    
    // Clean up
    if (success) {
      e.target.value = '';
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Label htmlFor="artwork-upload" className="mb-2">Upload new artwork</Label>
      
      {previewUrl && (
        <div className="relative w-32 h-32 mx-auto mb-2">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-md"
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
        </div>
      )}
      
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
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Image className="h-4 w-4 mr-2" />
              Upload Artwork
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500 text-center">
        Accepted formats: JPEG, PNG, WebP, GIF (max 5MB)
      </p>
    </div>
  );
};

export default ArtworkUploader;
