
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';
import ArtistProfileLeftPanel from '@/components/artistSubdomain/ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from '@/components/artistSubdomain/ArtistProfileCenterPanel';
import ArtistProfileRightPanel from '@/components/artistSubdomain/ArtistProfileRightPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ArtistProfile {
  id: string;
  artist_id: number;
  background_image: string | null;
  background_color: string;
  panel_color: string;
  links: any[];
}

const ArtistSubdomain = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        
        // First find the artist by name
        const formattedName = artistName?.replace(/([A-Z])/g, ' $1').trim();
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .ilike('name', formattedName || '')
          .single();
        
        if (artistError) throw artistError;
        
        if (artistData) {
          setArtist(artistData);
          
          // Then fetch the artist profile
          const { data: profileData, error: profileError } = await supabase
            .from('artist_profiles')
            .select('*')
            .eq('artist_id', artistData.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          if (profileData) {
            setProfile(profileData);
          } else {
            // Use default profile if none exists
            setProfile({
              id: '',
              artist_id: artistData.id,
              background_image: null,
              background_color: '#f7cf1e',
              panel_color: '#ffffff',
              links: []
            });
          }
        }
      } catch (error: any) {
        console.error('Error fetching artist data:', error);
        toast.error(`Failed to load artist: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (artistName) {
      fetchArtistData();
    }
  }, [artistName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: profile?.background_color || '#f7cf1e' }}>
        <p className="text-lg">Loading artist profile...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#f7cf1e' }}>
        <p className="text-lg">Artist not found</p>
      </div>
    );
  }

  // Parse JSON data if needed
  const techniques = Array.isArray(artist.techniques) 
    ? artist.techniques 
    : typeof artist.techniques === 'string' && artist.techniques
      ? JSON.parse(artist.techniques)
      : [];
  
  const styles = Array.isArray(artist.styles) 
    ? artist.styles 
    : typeof artist.styles === 'string' && artist.styles
      ? JSON.parse(artist.styles)
      : [];
  
  const socialPlatforms = Array.isArray(artist.social_platforms) 
    ? artist.social_platforms 
    : typeof artist.social_platforms === 'string' && artist.social_platforms
      ? JSON.parse(artist.social_platforms)
      : [];
  
  const artworks = Array.isArray(artist.artworks) 
    ? artist.artworks 
    : typeof artist.artworks === 'string' && artist.artworks
      ? JSON.parse(artist.artworks)
      : [];

  // Render different layouts based on device
  if (isMobile) {
    return (
      <div 
        className="min-h-screen p-4 pb-16"
        style={{ 
          backgroundColor: profile?.background_color || '#f7cf1e',
          backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="artwork">Artwork</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-0">
            <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
              <ArtistProfileLeftPanel 
                artist={artist} 
                techniques={techniques}
                styles={styles}
                panelColor={profile?.panel_color || '#ffffff'}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="links" className="mt-0">
            <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
              <ArtistProfileCenterPanel 
                artist={artist}
                socialPlatforms={socialPlatforms}
                links={profile?.links || []}
                panelColor={profile?.panel_color || '#ffffff'}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="artwork" className="mt-0">
            <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
              <ArtistProfileRightPanel 
                artist={artist}
                artworks={artworks}
                panelColor={profile?.panel_color || '#ffffff'}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop layout
  return (
    <div 
      className="min-h-screen p-8"
      style={{ 
        backgroundColor: profile?.background_color || '#f7cf1e',
        backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileLeftPanel 
              artist={artist} 
              techniques={techniques}
              styles={styles}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileCenterPanel 
              artist={artist}
              socialPlatforms={socialPlatforms}
              links={profile?.links || []}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileRightPanel 
              artist={artist}
              artworks={artworks}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistSubdomain;
