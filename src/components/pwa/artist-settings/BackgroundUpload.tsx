import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, X } from "lucide-react";
import { uploadImage } from "./api/imageUploadAPI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BackgroundUploadProps {
  currentBackground: string | null;
  onBackgroundChange: (backgroundUrl: string | null) => void;
  artistName: string;
  artistId?: string | number;
}

const BackgroundUpload: React.FC<BackgroundUploadProps> = ({ 
  currentBackground,
  onBackgroundChange,
  artistName,
  artistId
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      
      // Use artist name for folder organization, fallback to "Unnamed Artist" if not provided
      const safeArtistName = artistName?.trim() || "Unnamed_Artist";
      
      console.log("Uploading background image for artist:", safeArtistName, "ID:", artistId);
      
      const imageUrl = await uploadImage(files[0], safeArtistName, false, "Background_Image");
      if (imageUrl) {
        // Update the local state
        onBackgroundChange(imageUrl);
        
        // If artist ID is provided, update the artist_profiles record in the database
        if (artistId) {
          try {
            // Convert artistId to number for database query
            const numericId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
            
            if (isNaN(numericId)) {
              throw new Error(`Invalid artist ID: ${artistId}`);
            }

            // Check if artist profile exists, if not create one
            const { data: existingProfile } = await supabase
              .from('artist_profiles')
              .select('id')
              .eq('artist_id', numericId)
              .maybeSingle();

            let result;
            
            if (existingProfile) {
              // Update existing profile
              result = await supabase
                .from('artist_profiles')
                .update({ 
                  background_image: imageUrl,
                  updated_at: new Date().toISOString()
                })
                .eq('artist_id', numericId);
            } else {
              // Create new profile
              result = await supabase
                .from('artist_profiles')
                .insert({
                  artist_id: numericId,
                  background_image: imageUrl
                });
            }

            if (result.error) {
              console.error("Database error:", result.error);
              toast.error("Failed to save background image to profile");
            } else {
              console.log("Database updated with new background image");
            }
          } catch (dbError: any) {
            console.error("Error updating database:", dbError);
            toast.error("Failed to save background image to profile");
          }
        }
        
        toast.success("Background image uploaded successfully");
      } else {
        throw new Error("Failed to upload background image");
      }
    } catch (error: any) {
      console.error("Error uploading background image:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveBackground = async () => {
    try {
      // Update local state
      onBackgroundChange(null);
      
      // Update database if artist ID is provided
      if (artistId) {
        const numericId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
        
        if (!isNaN(numericId)) {
          const { error } = await supabase
            .from('artist_profiles')
            .update({ 
              background_image: null,
              updated_at: new Date().toISOString()
            })
            .eq('artist_id', numericId);

          if (error) {
            console.error("Database error:", error);
            toast.error("Failed to remove background image from profile");
          } else {
            console.log("Background image removed from database");
          }
        }
      }
      
      toast.success("Background image removed");
    } catch (error: any) {
      console.error("Error removing background image:", error);
      toast.error(`Failed to remove background: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Background Image</h3>
        {currentBackground && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleRemoveBackground}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      <div 
        className="w-full h-32 rounded-lg overflow-hidden bg-muted cursor-pointer flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors"
        onClick={handleImageClick}
      >
        {currentBackground ? (
          <img 
            src={currentBackground} 
            alt="Background preview" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              console.error("Error loading background image:", currentBackground);
            }}
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center">
            <ImageIcon size={32} />
            <span className="text-sm mt-2">Click to upload background</span>
            <span className="text-xs text-muted-foreground/70">Recommended: 1920x1080 or larger</span>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleBackgroundUpload}
        className="hidden"
        accept="image/*"
      />
      
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="w-full flex items-center justify-center"
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
            {currentBackground ? 'Change Background' : 'Upload Background'}
          </>
        )}
      </Button>
    </div>
  );
};

export default BackgroundUpload;