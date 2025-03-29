
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Refresh, DownloadCloud, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useBulkSyncArtistImages } from '@/hooks/use-bulk-sync-artist-images';

const BulkSyncArtistImages = () => {
  const [startId, setStartId] = useState('26');
  const { syncArtistImages, syncArtistImagesFromId, isSyncing, result, errorDetails } = useBulkSyncArtistImages();
  
  const handleSyncAll = async () => {
    await syncArtistImages();
  };
  
  const handleSyncFromId = async () => {
    const id = parseInt(startId, 10);
    
    if (isNaN(id)) {
      return;
    }
    
    await syncArtistImagesFromId(id);
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Bulk Sync Artist Images</CardTitle>
        <CardDescription>
          Fix missing image links for artists by syncing storage files with database records
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="startId">Starting Artist ID</Label>
              <Input
                id="startId"
                type="text"
                value={startId}
                onChange={(e) => setStartId(e.target.value)}
                placeholder="Enter artist ID (e.g., 26)"
                disabled={isSyncing}
              />
            </div>
            
            <Button 
              variant="secondary" 
              onClick={handleSyncFromId}
              disabled={isSyncing || !startId}
              className="mb-[1px]"
            >
              {isSyncing ? <Refresh className="h-4 w-4 mr-2 animate-spin" /> : <DownloadCloud className="h-4 w-4 mr-2" />}
              Sync from ID {startId}
            </Button>
          </div>
        </div>
        
        {result && (
          <div className="space-y-2 border rounded-md p-3 bg-muted/30">
            <h4 className="text-sm font-medium">Sync Results:</h4>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Success: {result.success} artists</span>
              </div>
              
              <div className="flex items-center text-sm">
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                <span>Failed: {result.failed} artists</span>
              </div>
              
              <div className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                <span>Skipped: {result.skipped} artists</span>
              </div>
            </div>
          </div>
        )}
        
        {errorDetails && (
          <div className="text-red-500 text-sm border border-red-200 rounded-md p-3 bg-red-50 dark:bg-red-950/30">
            <p className="font-medium">Error:</p>
            <p>{errorDetails}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="default" 
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="w-full"
        >
          {isSyncing ? <Refresh className="h-4 w-4 mr-2 animate-spin" /> : <DownloadCloud className="h-4 w-4 mr-2" />}
          Sync All Artists' Images
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkSyncArtistImages;
