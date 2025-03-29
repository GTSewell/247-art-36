
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ArtworkUploaderProps {
  onUpload: (file: File) => Promise<boolean>;
  isUploading: boolean;
  artistName: string;
}

const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({ 
  onUpload, 
  isUploading,
  artistName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }
    
    try {
      const success = await onUpload(file);
      
      if (success) {
        // Reset the input field to allow uploading the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error("Error in ArtworkUploader:", error);
    }
  };
  
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="flex flex-col items-center justify-center">
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium mb-1">Upload Artwork</h3>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Drag and drop or click to select images
        </p>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        
        <Button 
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full sm:w-auto"
        >
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> 
              Select Image
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-400 mt-2">
          Supported formats: JPG, PNG, GIF (max 10MB)
        </p>
      </div>
    </div>
  );
};

export default ArtworkUploader;
