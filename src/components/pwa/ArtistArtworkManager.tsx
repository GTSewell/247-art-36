
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Upload, Trash } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/utils/uuid";
import { useIsMobile } from "@/hooks/use-mobile";

interface ArtistArtworkManagerProps {
  artistId: string | null;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ artistId }) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artworkFiles, setArtworkFiles] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (artistId) {
      fetchArtistArtworks();
    }
  }, [artistId]);
  
  const fetchArtistArtworks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('artworks, artwork_files')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (error) {
        console.log("No existing artworks found");
      }
      
      if (data) {
        // Process artworks from both sources
        let combinedArtworks: string[] = [];
        
        // Process legacy URL artworks if they exist
        if (data.artworks) {
          const artworkArray = Array.isArray(data.artworks) 
            ? data.artworks 
            : typeof data.artworks === 'string' 
              ? JSON.parse(data.artworks) 
              : [];
          combinedArtworks = [...combinedArtworks, ...artworkArray];
        }
        
        // Process new file-based artworks
        if (data.artwork_files) {
          const fileArray = Array.isArray(data.artwork_files) 
            ? data.artwork_files 
            : typeof data.artwork_files === 'string' 
              ? JSON.parse(data.artwork_files) 
              : [];
          setArtworkFiles(fileArray);
          
          // Get public URLs for each artwork file
          for (const filePath of fileArray) {
            const { data: { publicUrl } } = supabase
              .storage
              .from('artist_artworks')
              .getPublicUrl(filePath);
            
            combinedArtworks.push(publicUrl);
          }
        }
        
        setArtworks(combinedArtworks);
      }
    } catch (error: any) {
      console.error("Error fetching artworks:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadArtwork = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setUploading(true);
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${artistId}/${fileName}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('artist_artworks')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('artist_artworks')
        .getPublicUrl(filePath);
      
      // Update the artworks list in state
      const updatedArtworks = [...artworks, publicUrl];
      setArtworks(updatedArtworks);
      
      // Update the artwork files list in state and database
      const updatedArtworkFiles = [...artworkFiles, filePath];
      setArtworkFiles(updatedArtworkFiles);
      
      // Update the database
      const { error: dbError } = await supabase
        .from('artists')
        .update({ artwork_files: updatedArtworkFiles })
        .eq('user_id', artistId);
      
      if (dbError) throw dbError;
      
      toast.success("Artwork uploaded successfully");
      
      // Clear the file input
      e.target.value = '';
    } catch (error: any) {
      console.error("Error uploading artwork:", error);
      toast.error(`Failed to upload artwork: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveArtwork = async (index: number) => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setLoading(true);
      
      // Remove from artworks list
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      setArtworks(updatedArtworks);
      
      // If we have a file path for this artwork, remove it from storage
      if (index < artworkFiles.length) {
        const filePath = artworkFiles[index];
        
        // Remove file from storage
        const { error: storageError } = await supabase
          .storage
          .from('artist_artworks')
          .remove([filePath]);
        
        if (storageError) {
          console.error("Error removing file from storage:", storageError);
        }
        
        // Remove from artwork_files list
        const updatedArtworkFiles = [...artworkFiles];
        updatedArtworkFiles.splice(index, 1);
        setArtworkFiles(updatedArtworkFiles);
        
        // Update the database
        const { error: dbError } = await supabase
          .from('artists')
          .update({ artwork_files: updatedArtworkFiles })
          .eq('user_id', artistId);
        
        if (dbError) throw dbError;
      }
      
      toast.success("Artwork removed successfully");
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && artworks.length === 0) {
    return <div className="p-8 text-center">Loading artworks...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="mr-2 h-5 w-5" />
          Manage Artworks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="artwork-upload" className="mb-2">Upload new artwork</Label>
            <div className="flex items-center gap-2">
              <input
                id="artwork-upload"
                type="file"
                accept="image/*"
                onChange={handleUploadArtwork}
                className="hidden"
                disabled={uploading}
              />
              <Button 
                onClick={() => document.getElementById('artwork-upload')?.click()}
                disabled={uploading}
                className="w-full bg-zap-yellow hover:bg-zap-blue text-black hover:text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Artwork"}
              </Button>
            </div>
          </div>
          
          {artworks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't added any artworks yet
            </div>
          ) : (
            <div className={`grid gap-4 mt-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {artworks.map((artwork, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={artwork} 
                      alt={`Artwork ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveArtwork(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistArtworkManager;
