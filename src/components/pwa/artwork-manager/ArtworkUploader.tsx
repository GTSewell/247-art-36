
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArtworkUploaderProps {
  artistId: string | null;
  onArtworkAdded: (newArtworkUrl: string) => void;
}

const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({ artistId, onArtworkAdded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async () => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a unique filename using the artist ID and timestamp
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${artistId}_${Date.now()}.${fileExt}`;
      const filePath = `artworks/${fileName}`;
      
      // Upload the file to Supabase Storage with progress tracking
      const { data, error } = await supabase.storage
        .from('artist-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('artist-images')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Add the new artwork URL to the artist's profile via the callback
      onArtworkAdded(publicUrl);
      
      setSelectedFile(null);
      toast.success("Artwork uploaded successfully");
      
      // Reset the file input
      const fileInput = document.getElementById('artwork-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error("Error uploading artwork:", error);
      toast.error(`Failed to upload artwork: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <input
          id="artwork-file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label 
          htmlFor="artwork-file-upload" 
          className="cursor-pointer block"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            {selectedFile ? selectedFile.name : "Click to upload an image"}
          </p>
        </label>
      </div>
      
      {selectedFile && (
        <div className="flex flex-col space-y-2">
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <Button 
            onClick={handleFileUpload} 
            disabled={uploading || !selectedFile}
            className="w-full"
          >
            {uploading ? `Uploading...` : "Upload Artwork"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArtworkUploader;
