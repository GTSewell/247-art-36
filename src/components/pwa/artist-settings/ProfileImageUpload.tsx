
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  currentImage: string;
  onImageUpload: (file: File) => Promise<string | null>;
  saving: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImage,
  onImageUpload,
  saving
}) => {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Create a preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      setUploading(true);
      
      try {
        await onImageUpload(file);
        toast.success("Profile image uploaded successfully");
      } catch (error) {
        console.error("Error in handleFileChange:", error);
      } finally {
        setUploading(false);
      }
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div 
          className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative mb-4 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          onClick={triggerFileInput}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-400" />
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Upload className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || saving}
        />
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
          disabled={uploading || saving}
        >
          {uploading ? "Uploading..." : "Change Profile Image"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
