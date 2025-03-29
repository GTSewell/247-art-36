
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useSyncSpecificArtist } from '@/hooks/use-sync-specific-artist';

interface SyncSpecificArtistProps {
  defaultArtistId?: string;
}

const SyncSpecificArtist: React.FC<SyncSpecificArtistProps> = ({ defaultArtistId = '26' }) => {
  const [artistId, setArtistId] = useState(defaultArtistId);
  const { syncArtistById, isSyncing, result } = useSyncSpecificArtist();
  
  const handleSync = async () => {
    const id = parseInt(artistId, 10);
    
    if (isNaN(id)) {
      return;
    }
    
    await syncArtistById(id);
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sync Specific Artist</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="artistId">Artist ID</Label>
            <Input
              id="artistId"
              type="text"
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              placeholder="Enter artist ID (e.g., 26)"
              disabled={isSyncing}
            />
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleSync}
            disabled={isSyncing || !artistId}
            className="mb-[1px]"
          >
            {isSyncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Sync Artist ID {artistId}
          </Button>
        </div>
        
        {result && (
          <div className={`space-y-2 border rounded-md p-3 ${result.success ? 'bg-green-50/30 dark:bg-green-950/30' : 'bg-red-50/30 dark:bg-red-950/30'}`}>
            <div className="flex items-center text-sm">
              {result.success ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              )}
              <span>{result.message}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Use this tool to synchronize images for a specific artist
      </CardFooter>
    </Card>
  );
};

export default SyncSpecificArtist;
