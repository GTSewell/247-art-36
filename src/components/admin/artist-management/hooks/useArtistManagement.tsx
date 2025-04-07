
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';
import { transformArtist } from '@/utils/artist-transformer';

export const useArtistManagement = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [publishingStatus, setPublishingStatus] = useState<Record<number, boolean>>({});

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

  return {
    artists: filteredArtists,
    loading,
    searchTerm,
    publishingStatus,
    setSearchTerm,
    handlePublishToggle
  };
};
