
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArtistManagementList from '@/components/admin/artist-management/ArtistManagementList';
import ArtistManagementDetail from '@/components/admin/artist-management/ArtistManagementDetail';

const ArtistManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedArtistId = searchParams.get('selectedArtistId');
  const isCreatingNew = searchParams.get('isCreatingNew') === 'true';
  
  const handleArtistSelect = (artistId: number) => {
    // Use URL parameters instead of component state
    navigate(`/admin/artists?selectedArtistId=${artistId}`);
  };
  
  const handleCreateNewArtist = () => {
    // Use URL parameters instead of component state
    navigate('/admin/artists?isCreatingNew=true');
  };
  
  const handleBackToList = () => {
    // Clear URL parameters and go back to list
    navigate('/admin/artists');
  };
  
  return (
    <div className="container mx-auto p-4">
      {selectedArtistId || isCreatingNew ? (
        <ArtistManagementDetail
          selectedArtistId={selectedArtistId}
          isCreatingNew={isCreatingNew}
          onBackToList={handleBackToList}
        />
      ) : (
        <ArtistManagementList
          onCreateNew={handleCreateNewArtist}
          onArtistSelect={handleArtistSelect}
        />
      )}
    </div>
  );
};

export default ArtistManagement;
