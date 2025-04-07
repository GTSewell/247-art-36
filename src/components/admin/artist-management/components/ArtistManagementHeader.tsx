
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArtistManagementHeaderProps {
  onCreateNew: () => void;
}

const ArtistManagementHeader: React.FC<ArtistManagementHeaderProps> = ({ 
  onCreateNew 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Artist Management</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Button onClick={onCreateNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Artist
        </Button>
      </div>
    </div>
  );
};

export default ArtistManagementHeader;
