
import React from 'react';
import { useDownloadArtistImages } from '@/hooks/use-download-artist-images';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DownloadArtistImages: React.FC = () => {
  const { downloadImages, isDownloading, result, errorDetails } = useDownloadArtistImages();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          <span>Fix Image URLs</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download & Fix Artist Images</DialogTitle>
          <DialogDescription>
            This will download all artist images to Supabase storage to ensure they remain available.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {isDownloading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Downloading and processing images...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take several minutes depending on the number of images.
              </p>
            </div>
          ) : errorDetails ? (
            <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <p className="font-medium text-red-600">Error Occurred</p>
              <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm overflow-auto max-h-[200px] w-full">
                {errorDetails}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Please check the console logs for more details or try again later.
              </p>
            </div>
          ) : result ? (
            <div className="max-h-[400px] overflow-y-auto space-y-4">
              <div>
                <h3 className="font-medium text-green-600">
                  Successful ({result.success.length})
                </h3>
                <ul className="mt-2 text-sm space-y-1">
                  {result.success.map((item) => (
                    <li key={item.id}>
                      {item.name} - Updated to new URL
                    </li>
                  ))}
                </ul>
              </div>
              
              {result.failed.length > 0 && (
                <div>
                  <h3 className="font-medium text-red-600">
                    Failed ({result.failed.length})
                  </h3>
                  <ul className="mt-2 text-sm space-y-1">
                    {result.failed.map((item, index) => (
                      <li key={`${item.id}-${index}`}>
                        Artist ID {item.id} - {item.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.skipped.length > 0 && (
                <div>
                  <h3 className="font-medium text-amber-600">
                    Skipped ({result.skipped.length})
                  </h3>
                  <ul className="mt-2 text-sm space-y-1">
                    {result.skipped.map((item, index) => (
                      <li key={`${item.id}-${index}`}>
                        Artist ID {item.id} - {item.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm">
                This process will:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Download all artist profile images and artworks</li>
                <li>Store them in your Supabase storage bucket</li>
                <li>Update database records with the new URLs</li>
              </ul>
              <p className="text-sm text-amber-600">
                Note: This process may take several minutes depending on the number of images.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={isDownloading}
          >
            {result || errorDetails ? 'Refresh Page' : 'Cancel'}
          </Button>
          <Button 
            onClick={downloadImages} 
            disabled={isDownloading || !!result}
            className={errorDetails ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : result ? (
              'Complete'
            ) : errorDetails ? (
              'Try Again'
            ) : (
              'Start Download'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadArtistImages;
