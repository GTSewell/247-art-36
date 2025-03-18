
import React, { useState, useRef } from 'react';
import { Upload, XCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadImage } from './api/imageUploadAPI';
import { logger } from '@/utils/logger';

interface ImageUploadProps {
  currentImage: string | null;
  onImageChange: (imageUrl: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageChange }) => {
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large (max 5MB)");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
        setImageError(false);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      
      if (imageUrl) {
        onImageChange(imageUrl);
        setPreview(imageUrl);
        logger.info(`Image uploaded successfully: ${imageUrl}`);
        toast.success("Profile image uploaded successfully");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      logger.error("Error uploading image:", error);
      toast.error(`Upload failed: ${error.message}`);
      // Reset preview to previous state if there was a previous image
      if (currentImage) {
        setPreview(currentImage);
      }
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    logger.error(`Failed to load image: ${preview}`);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Remove current image
  const handleRemoveImage = () => {
    setPreview(null);
    setImageError(false);
    onImageChange(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        {preview && !imageError ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              onError={handleImageError}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={handleUploadClick}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {preview && !imageError ? 'Change Image' : 'Upload Image'}
      </Button>
    </div>
  );
};

export default ImageUpload;
