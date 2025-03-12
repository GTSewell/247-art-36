
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

// Add a check at the beginning of the component to return mock data if it's a demo account
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
  const debouncedFormData = useDebounce(formData, 500);

  useEffect(() => {
    if (localStorage.getItem('demoSession') === 'active') {
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
    }
  }, [artistId]);

  useEffect(() => {
    if (localStorage.getItem('demoSession') === 'active') {
      return;
    }
    
    if (artistId && !isLoading) {
      handleAutoSave();
    }
  }, [debouncedFormData, artistId, isLoading]);

  const handleAutoSave = async () => {
    if (!artistId) return;
    
    const { success, message } = await saveArtistProfile(debouncedFormData, artistId, existingArtist);
    if (success) {
      toast.success(message);
      await fetchData();
    } else {
      toast.error(message);
    }
  };

  // If this is the demo artist account, show mock data
  if (localStorage.getItem('demoSession') === 'active') {
    return (
      <div className="space-y-6">
        <BasicInfoForm
          formData={{
            name: 'GT Sewell',
            specialty: 'Contemporary Abstract, Geometric Abstraction',
            bio: 'GT Sewell is a contemporary artist specializing in geometric abstraction. With over 15 years of experience, his work explores the intersection of color theory and structured compositions. His pieces have been exhibited in galleries across Europe and North America.',
            location: 'Los Angeles, CA',
            city: 'Los Angeles',
            country: 'United States',
            techniques: 'Acrylic, Digital, Oil',
            styles: 'Abstract, Contemporary, Minimalist',
            social_platforms: [
              { platform: 'instagram', username: 'gtsewell_art' },
              { platform: 'twitter', username: 'gtsewellart' },
              { platform: 'facebook', username: 'GTSewellArtist' }
            ]
          }}
          onChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          disabled={true}
        />
        
        <LocationForm
          formData={{
            location: 'Los Angeles, CA',
            city: 'Los Angeles',
            country: 'United States'
          }}
          onChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          disabled={true}
        />
        
        <ArtistTags
          label="Techniques"
          tags={['Acrylic', 'Digital', 'Oil']}
          onTagsChange={() => {
            toast.info('Changes are disabled in the demo account');
          }}
          placeholder="Add techniques"
          disabled={true}
        />
        
        <ArtistTags
          label="Styles"
          tags={['Abstract', 'Contemporary', 'Minimalist']}
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
      await fetchData();
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
