import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import BasicInfoForm from "./artist-settings/BasicInfoForm";
import LocationForm from "./artist-settings/LocationForm";
import ArtistTags from "./artist-settings/ArtistTags";
import { Button } from "@/components/ui/button";
import { ArtistProfileFormData } from "./artist-settings/types";
import { fetchArtistProfile, saveArtistProfile } from "./artist-settings/api/artistProfileAPI";
import { useDebounce } from "@/hooks/use-debounce";

interface ArtistProfileSettingsProps {
  artistId: string | null;
}

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

const ArtistProfileSettings = ({ artistId }: ArtistProfileSettingsProps) => {
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

  useEffect(() => {
    if (localStorage.getItem('demoSession') === 'active') {
      setFormData(DEMO_ARTIST_PROFILE);
      setIsLoading(false);
      setInitialLoadComplete(true);
      return;
    }
    
    if (artistId) {
      fetchData();
    }
  }, [artistId]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await fetchArtistProfile(artistId!);
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
      localStorage.getItem('demoSession') !== 'active' && 
      initialLoadComplete && 
      !isLoading && 
      artistId
    ) {
      handleAutoSave();
    }
  }, [debouncedFormData, artistId, isLoading, initialLoadComplete]);

  const handleAutoSave = async () => {
    if (!artistId) return;
    
    const { success, message } = await saveArtistProfile(debouncedFormData, artistId, existingArtist);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // If this is the demo artist account, show demo data
  if (localStorage.getItem('demoSession') === 'active') {
    return (
      <div className="space-y-6">
        <BasicInfoForm
          formData={DEMO_ARTIST_PROFILE}
          onChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          disabled={true}
        />
        
        <LocationForm
          formData={{
            location: DEMO_ARTIST_PROFILE.location,
            city: DEMO_ARTIST_PROFILE.city,
            country: DEMO_ARTIST_PROFILE.country
          }}
          onChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          disabled={true}
        />
        
        <ArtistTags
          label="Techniques"
          tags={DEMO_ARTIST_PROFILE.techniques.split(',').map(tag => tag.trim())}
          onTagsChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          placeholder="Add techniques"
          disabled={true}
        />
        
        <ArtistTags
          label="Styles"
          tags={DEMO_ARTIST_PROFILE.styles.split(',').map(tag => tag.trim())}
          onTagsChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          placeholder="Add styles"
          disabled={true}
        />
        
        <div className="flex justify-end">
          <Button 
            disabled={true}
            onClick={() => {
              toast.info('Changes are disabled in the demo account');
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>Loading profile...</p>
      ) : (
        <>
          <BasicInfoForm
            formData={formData}
            onChange={handleChange}
            onSocialPlatformChange={handleSocialPlatformChange}
            onAddSocialPlatform={handleAddSocialPlatform}
            onRemoveSocialPlatform={handleRemoveSocialPlatform}
          />
          
          <LocationForm
            formData={formData}
            onChange={handleChange}
          />
          
          <ArtistTags
            label="Techniques"
            tags={formData.techniques ? formData.techniques.split(',').map(tag => tag.trim()) : []}
            onTagsChange={handleTagsChange}
            placeholder="Add techniques"
          />
          
          <ArtistTags
            label="Styles"
            tags={formData.styles ? formData.styles.split(',').map(tag => tag.trim()) : []}
            onTagsChange={handleTagsChange}
            placeholder="Add styles"
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ArtistProfileSettings;
