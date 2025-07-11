import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ColorTheme, DEFAULT_THEME } from './types';

export const useColorThemeData = (artistId: string | null) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    if (artistId) {
      loadCustomColorTheme();
    }
  }, [artistId]);

  const loadCustomColorTheme = async () => {
    if (!artistId) return;

    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('artist_id', parseInt(artistId))
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading color theme:', error);
        return;
      }

      if (profile) {
        setBackgroundImage(profile.background_image);
        
        if (profile.links && typeof profile.links === 'object' && profile.links !== null && 'colorTheme' in profile.links) {
          const savedTheme = (profile.links as any).colorTheme;
          if (savedTheme) {
            setColorTheme({ ...DEFAULT_THEME, ...savedTheme });
          }
        }
      }
    } catch (error) {
      console.error('Error loading color theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveColorTheme = async () => {
    if (!artistId) {
      toast.error('No artist selected');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving color theme for artist:', artistId, colorTheme);

      // First, get the current profile to preserve existing links
      const { data: currentProfile, error: fetchError } = await supabase
        .from('artist_profiles')
        .select('links')
        .eq('artist_id', parseInt(artistId))
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const currentLinks = (currentProfile?.links as any) || {};
      const updatedLinks = {
        ...(typeof currentLinks === 'object' && currentLinks !== null ? currentLinks : {}),
        colorTheme: colorTheme
      };

      // Update or insert the profile
      const { error: upsertError } = await supabase
        .from('artist_profiles')
        .upsert({
          artist_id: parseInt(artistId),
          links: updatedLinks,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        throw upsertError;
      }

      toast.success('Color theme saved successfully');
    } catch (error) {
      console.error('Error saving color theme:', error);
      toast.error('Failed to save color theme');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setColorTheme(DEFAULT_THEME);
  };

  const handleColorChange = (field: keyof ColorTheme, value: string | boolean) => {
    setColorTheme(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    colorTheme,
    loading,
    saving,
    backgroundImage,
    saveColorTheme,
    resetToDefault,
    handleColorChange
  };
};