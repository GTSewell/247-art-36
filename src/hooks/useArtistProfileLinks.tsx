import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { ArtistLink } from '@/data/types/artistProfile';
import { fetchArtistProfileLinks } from '@/components/pwa/artist-settings/api/fetch/fetchArtistProfileLinks';
import { saveArtistProfileLinks } from '@/components/pwa/artist-settings/api/save/saveArtistProfileLinks';

interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  type?: string;
  clicks?: number;
}

export const useArtistProfileLinks = (artistId: string | null) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (artistId && artistId !== 'demo') {
      loadLinks();
    } else {
      setLoading(false);
    }
  }, [artistId]);

  const loadLinks = async () => {
    if (!artistId) return;
    
    try {
      setLoading(true);
      const { data, error } = await fetchArtistProfileLinks(artistId);
      
      if (error) {
        logger.error("Error loading artist profile links:", error);
        toast.error("Failed to load links");
        return;
      }

      // Convert ArtistLink[] to Link[] format
      const convertedLinks = (data || []).map((link: ArtistLink, index: number) => ({
        id: `${index}`,
        title: link.title,
        url: link.url,
        type: link.type,
        active: true,
        clicks: Math.floor(Math.random() * 300) // Mock clicks for now
      }));

      setLinks(convertedLinks);
    } catch (error: any) {
      logger.error("Error loading links:", error);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  const saveLinks = async (linksToSave: Link[]) => {
    if (!artistId || artistId === 'demo') {
      toast.success("Demo changes saved (not persisted)");
      return;
    }

    try {
      setSaving(true);
      
      // Convert Link[] to ArtistLink[] format
      const artistLinks: ArtistLink[] = linksToSave
        .filter(link => link.active) // Only save active links
        .map(link => ({
          type: link.type || 'website',
          title: link.title,
          url: link.url
        }));

      const { success, error } = await saveArtistProfileLinks(artistId, artistLinks);
      
      if (!success) {
        logger.error("Error saving artist profile links:", error);
        toast.error("Failed to save links");
        return;
      }

      toast.success("Links saved successfully");
    } catch (error: any) {
      logger.error("Error saving links:", error);
      toast.error("Failed to save links");
    } finally {
      setSaving(false);
    }
  };

  const addLink = (newLink: Omit<Link, 'id'>) => {
    const link: Link = {
      id: Date.now().toString(),
      ...newLink,
      clicks: 0
    };
    const updatedLinks = [...links, link];
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  const updateLink = (id: string, updates: Partial<Link>) => {
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  const toggleLinkActive = (id: string) => {
    updateLink(id, { active: !links.find(l => l.id === id)?.active });
  };

  const reorderLinks = (reorderedLinks: Link[]) => {
    setLinks(reorderedLinks);
    saveLinks(reorderedLinks);
  };

  return {
    links,
    loading,
    saving,
    addLink,
    updateLink,
    deleteLink,
    toggleLinkActive,
    reorderLinks,
    saveLinks
  };
};