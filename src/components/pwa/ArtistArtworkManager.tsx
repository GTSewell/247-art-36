
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
    handleUploadArtwork, 
    handleRemoveArtwork 
  } = useArtistArtworks(artistId);
  
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
          <ArtworkUploader 
            onUpload={(file) => handleUploadArtwork(file, artistName)}
            isUploading={uploading}
            artistName={artistName}
          />
          
          <ArtworkGrid 
            artworks={artworks}
            onRemove={handleRemoveArtwork}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistArtworkManager;
