
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { uploadImage } from "./api/imageUploadAPI";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImage: string | null;
  onImageChange: (imageUrl: string | null) => void;
  artistName: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage,
  onImageChange,
  artistName
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      
      // Use artist name for folder organization, fallback to "Unnamed Artist" if not provided
      const safeArtistName = artistName?.trim() || "Unnamed_Artist";
      
      console.log("Uploading image for artist:", safeArtistName);
      
      const imageUrl = await uploadImage(files[0], safeArtistName, true);
      if (imageUrl) {
        onImageChange(imageUrl);
        toast.success("Profile image uploaded successfully");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer flex items-center justify-center mb-4 border border-gray-200"
        onClick={handleImageClick}
      >
        {currentImage ? (
          <img 
            src={currentImage} 
            alt="Artist profile" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              console.error("Error loading image:", currentImage);
            }}
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center">
            <Upload size={24} />
            <span className="text-xs mt-1">No image</span>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
      
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="flex items-center"
        onClick={handleImageClick}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageUpload;
