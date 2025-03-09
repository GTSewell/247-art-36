
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface ArtistArtworkManagerProps {
  artistId: string | null;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ artistId }) => {
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [newArtworkUrl, setNewArtworkUrl] = useState("");
  
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
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Input
                value={newArtworkUrl}
                onChange={(e) => setNewArtworkUrl(e.target.value)}
                placeholder="Enter artwork URL"
              />
            </div>
            <Button onClick={handleAddArtwork} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
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
