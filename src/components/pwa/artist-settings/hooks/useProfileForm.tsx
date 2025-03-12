
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData } from "../types";
import { fetchArtistProfile, saveArtistProfile } from "../api/artistProfileAPI";
import { useDebounce } from "@/hooks/use-debounce";

// Demo artist profile with generic information
const DEMO_ARTIST_PROFILE: ArtistProfileFormData = {
  name: 'Demo Artist',
  specialty: 'Digital Art, Mixed Media',
  bio: 'This is a demo artist profile showcasing the features of the 247.art platform. As a demonstration account, you can explore the interface and functionality without making permanent changes.',
  location: 'New York, NY',
  city: 'New York',
  country: 'United States',
  techniques: 'Digital, Mixed Media, Photography',
  styles: 'Contemporary, Abstract, Modern',
  social_platforms: [
    { platform: 'instagram', username: 'demoartist' },
    { platform: 'twitter', username: 'demoartistofficial' },
    { platform: 'facebook', username: 'DemoArtistPage' }
  ]
};

export const useProfileForm = (artistId: string | null) => {
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: '',
    specialty: '',
    bio: '',
    location: '',
    city: '',
    country: '',
    techniques: '',
    styles: '',
    social_platforms: []
  });
  const [existingArtist, setExistingArtist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const debouncedFormData = useDebounce(formData, 500);
  const [demoMode] = useState(localStorage.getItem('demoSession') === 'active');

  useEffect(() => {
    if (demoMode) {
      setFormData(DEMO_ARTIST_PROFILE);
      setIsLoading(false);
      setInitialLoadComplete(true);
      return;
    }
    
    if (artistId) {
      fetchData();
    }
  }, [artistId, demoMode]);

  const fetchData = useCallback(async () => {
    if (!artistId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await fetchArtistProfile(artistId);
      if (error) {
        toast.error(error.message);
      }
      if (data) {
        setExistingArtist(data);
        setFormData({
          name: data.name || '',
          specialty: data.specialty || '',
          bio: data.bio || '',
          location: data.location || '',
          city: data.city || '',
          country: data.country || '',
          techniques: data.techniques ? data.techniques.join(', ') : '',
          styles: data.styles ? data.styles.join(', ') : '',
          social_platforms: data.social_platforms || []
        });
      }
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  }, [artistId]);

  useEffect(() => {
    if (
      !demoMode && 
      initialLoadComplete && 
      !isLoading && 
      artistId
    ) {
      handleAutoSave();
    }
  }, [debouncedFormData, artistId, isLoading, initialLoadComplete, demoMode]);

  const handleAutoSave = async () => {
    if (!artistId) return;
    
    const { success, message } = await saveArtistProfile(debouncedFormData, artistId, existingArtist);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialPlatformChange = (platform: string, username: string) => {
    const updatedPlatforms = formData.social_platforms.map(item => {
      if (item.platform === platform) {
        return { ...item, username };
      }
      return item;
    });

    setFormData({
      ...formData,
      social_platforms: updatedPlatforms
    });
  };

  const handleAddSocialPlatform = (platform: string) => {
    if (formData.social_platforms.find(item => item.platform === platform)) {
      toast.error('This platform is already added');
      return;
    }

    setFormData({
      ...formData,
      social_platforms: [...formData.social_platforms, { platform, username: '' }]
    });
  };

  const handleRemoveSocialPlatform = (platform: string) => {
    const updatedPlatforms = formData.social_platforms.filter(item => item.platform !== platform);
    setFormData({
      ...formData,
      social_platforms: updatedPlatforms
    });
  };

  const handleTagsChange = (label: string, tags: string[]) => {
    const tagsString = tags.join(', ');
    if (label === 'Techniques') {
      setFormData({ ...formData, techniques: tagsString });
    } else if (label === 'Styles') {
      setFormData({ ...formData, styles: tagsString });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId) return;

    const { success, message } = await saveArtistProfile(formData, artistId, existingArtist);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return {
    formData,
    isLoading,
    demoMode,
    handleChange,
    handleSubmit,
    handleSocialPlatformChange,
    handleAddSocialPlatform,
    handleRemoveSocialPlatform,
    handleTagsChange
  };
};
