
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { useArtistArtworks } from "@/hooks/use-artist-artworks";
import ArtworkGrid from "./artwork/ArtworkGrid";
import ArtworkUploader from "./artwork/ArtworkUploader";

interface ArtistArtworkManagerProps {
  artistId: string | null;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ artistId }) => {
  const { 
    loading, 
    uploading, 
    artworks, 
    artistName,
    artist,
    handleUploadArtwork, 
    handleRemoveArtwork,
    handleSetAsBackgroundImage,
    handleReorderArtworks,
    syncArtistImages
  } = useArtistArtworks(artistId);
  
  if (!artistId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="mr-2 h-5 w-5" />
            Manage Artworks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            Please save the artist profile first to enable artwork management.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (loading && artworks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="mr-2 h-5 w-5" />
            Manage Artworks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">Loading artworks...</div>
        </CardContent>
      </Card>
    );
  }
  
  const onUpload = async (file: File): Promise<boolean> => {
    const result = await handleUploadArtwork(file, artistName);
    return result;
  };
  
  // Fix the function to return a boolean instead of void
  const handleAfterUpload = async (): Promise<boolean> => {
    try {
      await syncArtistImages();
      return true;
    } catch (error) {
      return false;
    }
  };
  
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
          <ArtworkUploader 
            onUpload={onUpload}
            isUploading={uploading}
            artistName={artistName}
            artistId={artist?.id}
            onAfterUpload={handleAfterUpload}
          />
          
          <ArtworkGrid 
            artworks={artworks}
            onRemove={handleRemoveArtwork}
            onSetAsBackground={handleSetAsBackgroundImage}
            onReorder={handleReorderArtworks}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistArtworkManager;
