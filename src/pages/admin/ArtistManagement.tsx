
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Artist } from '@/data/types/artist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit2, ArrowLeft, PlusCircle, Check, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ArtistProfileSettings from '@/components/pwa/ArtistProfileSettings';
import ArtistArtworkManager from '@/components/pwa/ArtistArtworkManager';
import { transformArtist } from '@/utils/artist-transformer';
import { Switch } from '@/components/ui/switch';

const ArtistManagement: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [publishingStatus, setPublishingStatus] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchArtists();
  }, []);
  
  useEffect(() => {
    if (artists.length > 0) {
      setFilteredArtists(
        artists.filter(artist => 
          artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (artist.user_id && artist.user_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          artist.id.toString().includes(searchTerm)
        )
      );
      
      // Set initial publishing status from the artists data
      const initialStatus: Record<number, boolean> = {};
      artists.forEach(artist => {
        initialStatus[artist.id] = artist.published || false;
      });
      setPublishingStatus(initialStatus);
    }
  }, [searchTerm, artists]);
  
  const fetchArtists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const transformedArtists = data.map(artist => {
          const transformed = transformArtist(artist);
          // Ensure published status is properly set
          transformed.published = artist.published === true;
          return transformed;
        });
        console.log("Transformed artists:", transformedArtists);
        setArtists(transformedArtists);
        setFilteredArtists(transformedArtists);
        
        // Set initial publishing status
        const initialStatus: Record<number, boolean> = {};
        transformedArtists.forEach(artist => {
          initialStatus[artist.id] = artist.published;
        });
        setPublishingStatus(initialStatus);
      }
    } catch (error: any) {
      console.error('Error fetching artists:', error);
      toast.error(`Failed to load artists: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublishToggle = async (artistId: number, currentStatus: boolean) => {
    try {
      // Optimistically update UI
      setPublishingStatus(prev => ({
        ...prev,
        [artistId]: !currentStatus
      }));
      
      console.log(`Toggling publish status for artist ${artistId}: ${currentStatus} -> ${!currentStatus}`);
      
      const { error } = await supabase
        .from('artists')
        .update({ published: !currentStatus })
        .eq('id', artistId);
      
      if (error) {
        throw error;
      }
      
      // Update the local state after successful DB update
      setArtists(prev => 
        prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, published: !currentStatus } 
            : artist
        )
      );
      
      toast.success(`Artist ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error: any) {
      // Revert optimistic update on error
      setPublishingStatus(prev => ({
        ...prev,
        [artistId]: currentStatus
      }));
      console.error('Error toggling artist publish status:', error);
      toast.error(`Failed to update artist: ${error.message}`);
    }
  };
  
  const handleArtistSelect = (artistId: number) => {
    // Convert to string because our components expect a string ID
    setSelectedArtistId(artistId.toString());
    setIsCreatingNew(false);
  };
  
  const handleCreateNewArtist = () => {
    setSelectedArtistId(null);
    setIsCreatingNew(true);
  };
  
  const handleBackToList = () => {
    setSelectedArtistId(null);
    setIsCreatingNew(false);
    // Refresh the artist list to show any updates
    fetchArtists();
  };
  
  if (selectedArtistId || isCreatingNew) {
    return (
      <div className="container mx-auto p-4">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={handleBackToList}
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
        
        {!isCreatingNew && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Artist Artworks</h2>
              <ArtistArtworkManager artistId={selectedArtistId} />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Artist Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button onClick={handleCreateNewArtist}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Artist
          </Button>
        </div>
      </div>
      
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading artists...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArtists.length > 0 ? (
                  filteredArtists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artist.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {artist.image ? (
                              <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">N/A</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{artist.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artist.specialty || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {artist.user_id ? (
                          <span className="max-w-[200px] inline-block overflow-hidden text-ellipsis">{artist.user_id}</span>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={publishingStatus[artist.id] || false}
                            onCheckedChange={() => handlePublishToggle(artist.id, publishingStatus[artist.id] || false)}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <span className="text-sm text-gray-500">
                            {publishingStatus[artist.id] ? (
                              <span className="flex items-center text-green-600">
                                <Check size={16} className="mr-1" />
                                Published
                              </span>
                            ) : (
                              <span className="flex items-center text-gray-500">
                                <X size={16} className="mr-1" />
                                Unpublished
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArtistSelect(artist.id)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No artists found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ArtistManagement;
