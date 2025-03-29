
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { uploadImage } from '@/components/pwa/artist-settings/api/imageUploadAPI';
import { ensureArray } from '@/utils/ensureArray';

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artistName, setArtistName] = useState<string>('');
  const [artist, setArtist] = useState<any>(null);
  
  // Fetch artist data including artworks
  const fetchArtistData = useCallback(async () => {
    if (!artistId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert string ID to number for querying
      const numericId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', numericId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setArtist(data);
        setArtistName(data.name || '');
        
        // Handle artworks - ensure they're in array format
        const artworkArray = ensureArray(data.artworks || []);
        setArtworks(artworkArray);
        
        logger.info(`Loaded ${artworkArray.length} artworks for artist ${data.name} (ID: ${artistId})`);
      }
    } catch (error: any) {
      logger.error('Error loading artist artworks:', error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [artistId]);
  
  useEffect(() => {
    fetchArtistData();
  }, [fetchArtistData]);
  
  // Upload a new artwork
  const handleUploadArtwork = async (file: File, name: string): Promise<boolean> => {
    if (!artistId) {
      toast.error('Artist ID not found');
      return false;
    }
    
    try {
      setUploading(true);
      
      // Use artist name for upload or fallback to unnamed
      const uploadArtistName = name || artistName || 'Unnamed_Artist';
      
      // Upload the image (isProfileImage=false means it's an artwork)
      const imageUrl = await uploadImage(file, uploadArtistName, false);
      
      if (!imageUrl) {
        throw new Error('Failed to upload artwork');
      }
      
      logger.info(`Uploaded new artwork for ${uploadArtistName} (ID: ${artistId}): ${imageUrl}`);
      
      // Get the current artworks
      const currentArtworks = [...artworks];
      
      // Add the new artwork
      currentArtworks.push(imageUrl);
      
      // Convert ID to number for database update
      const numericId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      // Update the database
      const { error } = await supabase
        .from('artists')
        .update({ artworks: currentArtworks })
        .eq('id', numericId);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setArtworks(currentArtworks);
      
      toast.success('Artwork uploaded successfully');
      return true;
    } catch (error: any) {
      logger.error('Error uploading artwork:', error);
      toast.error(`Upload failed: ${error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };
  
  // Remove an artwork
  const handleRemoveArtwork = async (index: number) => {
    if (!artistId || index < 0 || index >= artworks.length) {
      return;
    }
    
    try {
      // Create a copy of the current artworks and remove the one at the specified index
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      
      // Convert ID to number for database update
      const numericId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      // Update the database
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('id', numericId);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setArtworks(updatedArtworks);
      
      toast.success('Artwork removed successfully');
      
      // Sync images via edge function for extra reliability
      try {
        await supabase.functions.invoke('sync-artist-images', {
          body: { artistId }
        });
      } catch (syncError) {
        logger.error("Failed to sync artwork images after removal:", syncError);
      }
    } catch (error: any) {
      logger.error('Error removing artwork:', error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    }
  };
  
  return {
    loading,
    uploading,
    artworks,
    artistName,
    artist,
    handleUploadArtwork,
    handleRemoveArtwork,
    refreshArtworks: fetchArtistData
  };
};
