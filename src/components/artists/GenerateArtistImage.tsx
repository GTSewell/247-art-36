
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon, CheckCircle, Loader2, Save } from 'lucide-react';
import { useGenerateIndividualArtistImage } from '@/hooks/use-generate-individual-artist-image';
import { Artist } from '@/data/types/artist';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GenerateArtistImageProps {
  artist: Artist;
}

const GenerateArtistImage: React.FC<GenerateArtistImageProps> = ({ artist }) => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const { 
    generateImage, 
    saveGeneratedImage, 
    isGenerating, 
    generatedImage,
    createPromptFromArtist 
  } = useGenerateIndividualArtistImage();

  const handleGenerate = async () => {
    const imageUrl = await generateImage(artist);
    if (imageUrl) {
      setCurrentImage(imageUrl);
      setOpen(true);
    }
  };

  const handleSave = async () => {
    if (currentImage) {
      const success = await saveGeneratedImage(artist, currentImage);
      if (success) {
        setOpen(false);
        setCurrentImage(null);
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        className="w-full mb-4"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate Image
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Artist Image Preview</DialogTitle>
            <DialogDescription>
              Generated image for {artist.name}. You can save this image or generate a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Prompt used:</p>
              <p className="text-sm text-muted-foreground">{createPromptFromArtist(artist)}</p>
            </div>
            
            {currentImage && (
              <div className="relative aspect-square overflow-hidden rounded-md border">
                <img 
                  src={currentImage} 
                  alt={`Generated image for ${artist.name}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline"
              onClick={() => generateImage(artist)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate New
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!currentImage || isGenerating}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateArtistImage;
