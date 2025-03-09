
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "lucide-react";
import ArtworkUrlAdder from "./artwork-manager/ArtworkUrlAdder";
import ArtworkUploader from "./artwork-manager/ArtworkUploader";
import ArtworkGrid from "./artwork-manager/ArtworkGrid";
import { useArtworkManager } from "./artwork-manager/useArtworkManager";

interface ArtistArtworkManagerProps {
  artistId: string | null;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ artistId }) => {
  const [uploadTab, setUploadTab] = useState<"url" | "file">("url");
  const { loading, artworks, addArtworkByUrl, removeArtwork } = useArtworkManager(artistId);
  
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
              <ArtworkUrlAdder 
                onAddArtwork={addArtworkByUrl} 
                isLoading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="file" className="pt-4">
              <ArtworkUploader 
                artistId={artistId}
                onArtworkAdded={addArtworkByUrl}
              />
            </TabsContent>
          </Tabs>
          
          <ArtworkGrid 
            artworks={artworks} 
            onRemoveArtwork={removeArtwork} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistArtworkManager;
