
import React from 'react';
import { useArtistManagement } from './hooks/useArtistManagement';
import ArtistManagementHeader from './components/ArtistManagementHeader';
import ArtistSearch from './components/ArtistSearch';
import ArtistListLoading from './components/ArtistListLoading';
import ArtistTable from './components/ArtistTable';

interface ArtistManagementListProps {
  onCreateNew: () => void;
  onArtistSelect: (artistId: number) => void;
}

const ArtistManagementList: React.FC<ArtistManagementListProps> = ({ 
  onCreateNew, 
  onArtistSelect 
}) => {
  const {
    artists,
    loading,
    searchTerm,
    publishingStatus,
    setSearchTerm,
    handlePublishToggle
  } = useArtistManagement();
  
  return (
    <div>
      <ArtistManagementHeader onCreateNew={onCreateNew} />
      
      <ArtistSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      {loading ? (
        <ArtistListLoading />
      ) : (
        <ArtistTable 
          artists={artists}
          publishingStatus={publishingStatus}
          onPublishToggle={handlePublishToggle}
          onSelect={onArtistSelect}
        />
      )}
    </div>
  );
};

export default ArtistManagementList;
