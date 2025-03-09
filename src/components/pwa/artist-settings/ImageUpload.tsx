import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, User } from "lucide-react";

interface ImageUploadProps {
  artistImage: string;
  onImageUpload: (file: File) => Promise<void>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ artistImage, onImageUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(artistImage || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload the image
      await onImageUpload(file);
      toast.success('Profile image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-100">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="profile-image" className="font-medium">
            Profile Image
          </Label>
          
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center border">
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Artist profile"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-100 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <User className="h-12 w-12 text-gray-300" />
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                id="profile-image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={uploading}
                className="w-full mb-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Upload a profile image (JPG, PNG, max 5MB)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
