
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ArtistArtworkManagerProps {
  userId: string | null;
  artist: any;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ userId, artist }) => {
  const [artworks, setArtworks] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newArtworkUrl, setNewArtworkUrl] = useState("");

  useEffect(() => {
    if (artist && artist.artworks) {
      setArtworks(Array.isArray(artist.artworks) ? artist.artworks : []);
    }
  }, [artist]);

  const handleAddArtwork = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    if (!newArtworkUrl.trim()) {
      toast.error("Please enter a valid artwork URL");
      return;
    }

    try {
      setUploading(true);

      // Update the artist's artworks array in the database
      if (artist) {
        const currentArtworks = Array.isArray(artist.artworks) ? artist.artworks : [];
        const updatedArtworks = [...currentArtworks, newArtworkUrl];

        const { error: updateError } = await supabase
          .from('artists')
          .update({ artworks: updatedArtworks })
          .eq('user_id', userId);

        if (updateError) throw updateError;

        setArtworks(updatedArtworks);
        toast.success("Artwork added successfully");
      }
    } catch (error: any) {
      console.error("Error adding artwork:", error);
      toast.error(`Failed to add artwork: ${error.message}`);
    } finally {
      setUploading(false);
      setNewArtworkUrl("");
    }
  };

  const handleRemoveArtwork = async (index: number) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      setUploading(true);

      // Remove the artwork from the array
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);

      // Update the artist's artworks array in the database
      const { error: updateError } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setArtworks(updatedArtworks);
      toast.success("Artwork removed successfully");
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const uploadArtwork = async (file: File) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('artist-artworks')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('artist-artworks')
        .getPublicUrl(data.path);
      
      // Update the artist's artworks array in the database
      if (artist) {
        const currentArtworks = Array.isArray(artist.artworks) ? artist.artworks : [];
        const updatedArtworks = [...currentArtworks, publicUrl];
        
        const { error: updateError } = await supabase
          .from('artists')
          .update({ artworks: updatedArtworks })
          .eq('user_id', userId);
      
        if (updateError) throw updateError;
      
        setArtworks(updatedArtworks);
        toast.success("Artwork uploaded successfully");
      }
    } catch (error: any) {
      console.error("Error uploading artwork:", error);
      toast.error(`Failed to upload artwork: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    await uploadArtwork(file);
    // Reset the file input
    e.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artwork Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Artwork from URL */}
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="Enter artwork URL"
            value={newArtworkUrl}
            onChange={(e) => setNewArtworkUrl(e.target.value)}
          />
          <Button onClick={handleAddArtwork} disabled={uploading}>
            {uploading ? "Adding..." : <Plus className="h-4 w-4 mr-2" />}
            Add URL
          </Button>
        </div>

        {/* Upload Artwork from File */}
        <div>
          <Label htmlFor="artwork-upload" className="font-medium">
            Upload Artwork
          </Label>
          <Input
            type="file"
            id="artwork-upload"
            accept="image/*"
            onChange={handleFileInputChange}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground">
            Upload an image file (JPG, PNG, max 5MB)
          </p>
        </div>

        {/* Display Artworks */}
        {artworks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Artworks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artworks.map((artwork, index) => (
                <div key={index} className="relative">
                  <img
                    src={artwork}
                    alt={`Artwork ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveArtwork(index)}
                    disabled={uploading}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtistArtworkManager;
