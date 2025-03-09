
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Plus, Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ArtistArtworkManagerProps {
  artistId: string | null;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ artistId }) => {
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [newArtworkUrl, setNewArtworkUrl] = useState("");
  const [uploadTab, setUploadTab] = useState<"url" | "file">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
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
        .select('artworks')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (error) {
        console.log("No existing artworks found");
      }
      
      if (data && data.artworks) {
        // Parse artworks if needed
        const artworkArray = Array.isArray(data.artworks) 
          ? data.artworks 
          : typeof data.artworks === 'string' 
            ? JSON.parse(data.artworks) 
            : [];
            
        setArtworks(artworkArray);
      }
    } catch (error: any) {
      console.error("Error fetching artworks:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
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
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('artist-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('artist-images')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Add the new artwork URL to the artist's profile
      const updatedArtworks = [...artworks, publicUrl];
      
      const { error: updateError } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('user_id', artistId);
      
      if (updateError) throw updateError;
      
      setArtworks(updatedArtworks);
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
  
  const handleAddArtwork = async () => {
    if (!newArtworkUrl.trim()) {
      toast.error("Please enter an artwork URL");
      return;
    }
    
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setLoading(true);
      
      const updatedArtworks = [...artworks, newArtworkUrl];
      
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('user_id', artistId);
      
      if (error) throw error;
      
      setArtworks(updatedArtworks);
      setNewArtworkUrl("");
      toast.success("Artwork added successfully");
    } catch (error: any) {
      console.error("Error adding artwork:", error);
      toast.error(`Failed to add artwork: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveArtwork = async (index: number) => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setLoading(true);
      
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('user_id', artistId);
      
      if (error) throw error;
      
      setArtworks(updatedArtworks);
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
        <div className="space-y-4">
          <Tabs value={uploadTab} onValueChange={(value) => setUploadTab(value as "url" | "file")}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="url">Add by URL</TabsTrigger>
              <TabsTrigger value="file">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="pt-4">
              <div className="flex space-x-2">
                <div className="flex-grow">
                  <Input
                    value={newArtworkUrl}
                    onChange={(e) => setNewArtworkUrl(e.target.value)}
                    placeholder="Enter artwork URL"
                  />
                </div>
                <Button onClick={handleAddArtwork} disabled={loading || !newArtworkUrl.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="pt-4">
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
                      {uploading ? `Uploading (${uploadProgress}%)` : "Upload Artwork"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {artworks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't added any artworks yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {artworks.map((artwork, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={artwork} 
                    alt={`Artwork ${index + 1}`} 
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
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
