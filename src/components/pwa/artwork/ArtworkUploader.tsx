
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArtworkUploaderProps {
  onUpload: (file: File) => Promise<boolean>;
  isUploading: boolean;
  artistName: string;
  artistId?: number;
}

const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({ 
  onUpload, 
  isUploading,
  artistName,
  artistId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Call the parent component's upload function
      const success = await onUpload(file);
      
      if (success && artistId) {
        // Sync images via edge function for extra reliability
        try {
          const { data, error } = await supabase.functions.invoke('sync-artist-images', {
            body: { artistId }
          });
          
          if (error) {
            console.error("Error syncing artwork images:", error);
          } else {
            console.log("Artwork sync response:", data);
          }
        } catch (syncError) {
          console.error("Failed to sync artwork images:", syncError);
        }
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error handling file upload:", error);
      toast.error(`Upload failed: ${error.message}`);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Upload Artwork</h3>
        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      <div className="w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center bg-muted/50">
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground font-medium">
          {artistName ? `Upload artwork for ${artistName}` : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports JPG, PNG, WEBP up to 5MB
        </p>
      </div>
    </div>
  );
};

export default ArtworkUploader;
