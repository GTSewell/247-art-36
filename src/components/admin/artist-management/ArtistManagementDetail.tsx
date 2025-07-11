
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ArtistProfileSettings from '@/components/pwa/ArtistProfileSettings';
import ArtistArtworkManager from '@/components/pwa/ArtistArtworkManager';
import LinksManager from '@/components/pwa/dashboard/sections/LinksManager';
import ColorStyleSection from './components/ColorStyleSection';

interface ArtistManagementDetailProps {
  selectedArtistId: string | null;
  isCreatingNew: boolean;
  onBackToList: () => void;
}

const ArtistManagementDetail: React.FC<ArtistManagementDetailProps> = ({
  selectedArtistId,
  isCreatingNew,
  onBackToList,
}) => {
  return (
    <div>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={onBackToList}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Artists
      </Button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isCreatingNew ? "Create New Artist" : "Edit Artist Profile"}
          </h2>
          <ArtistProfileSettings artistId={selectedArtistId} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Artist Links</h2>
          <LinksManager artistId={selectedArtistId} isDemo={false} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <ColorStyleSection artistId={selectedArtistId} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Artist Artworks</h2>
          <ArtistArtworkManager artistId={selectedArtistId} />
        </div>
      </div>
    </div>
  );
};

export default ArtistManagementDetail;
