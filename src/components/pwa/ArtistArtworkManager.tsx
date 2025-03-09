
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface ArtistArtworkManagerProps {
  artist: string | null;
}

const ArtistArtworkManager: React.FC<ArtistArtworkManagerProps> = ({ artist }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="mr-2 h-5 w-5" />
          Artwork Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Artwork</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your artwork files, or click to browse
          </p>
          <Button>
            Select Files
          </Button>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Your Artworks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No artworks uploaded yet</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistArtworkManager;
