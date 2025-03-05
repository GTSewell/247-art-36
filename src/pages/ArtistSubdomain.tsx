import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';
import ArtistProfileLeftPanel from '@/components/artistSubdomain/ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from '@/components/artistSubdomain/ArtistProfileCenterPanel';
import ArtistProfileRightPanel from '@/components/artistSubdomain/ArtistProfileRightPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        
        const formattedName = artistName?.replace(/([A-Z])/g, ' $1').trim();
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .ilike('name', formattedName || '')
          .single();
        
        if (artistError) throw artistError;
        
        if (artistData) {
          const processedArtist: Artist = {
            ...artistData,
            techniques: typeof artistData.techniques === 'string' 
              ? JSON.parse(artistData.techniques) 
              : Array.isArray(artistData.techniques) ? artistData.techniques : [],
            styles: typeof artistData.styles === 'string' 
              ? JSON.parse(artistData.styles) 
              : Array.isArray(artistData.styles) ? artistData.styles : [],
            social_platforms: typeof artistData.social_platforms === 'string' 
              ? JSON.parse(artistData.social_platforms) 
              : Array.isArray(artistData.social_platforms) ? artistData.social_platforms : [],
            artworks: typeof artistData.artworks === 'string' 
              ? JSON.parse(artistData.artworks) 
              : Array.isArray(artistData.artworks) ? artistData.artworks : []
          };
          
          setArtist(processedArtist);
          
          const artworkBackground = processedArtist.artworks && 
            Array.isArray(processedArtist.artworks) && 
            processedArtist.artworks.length > 0 
              ? processedArtist.artworks[0] 
              : null;
          
          const defaultProfile: ArtistProfile = {
            id: '',
            artist_id: processedArtist.id,
            background_image: artworkBackground,
            background_color: '#f7cf1e',
            panel_color: '#ffffff',
            links: []
          };
          
          setProfile(defaultProfile);
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

  if (isMobile) {
    return (
      <div 
        className="flex items-center justify-center overflow-hidden"
        style={{ 
          backgroundColor: profile?.background_color || '#f7cf1e',
          backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%'
        }}
      >
        <div className="w-full h-[calc(100vh-2rem)] mx-4">
          <Tabs defaultValue="about" className="w-full h-full flex flex-col">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="artwork">Artwork</TabsTrigger>
            </TabsList>
            
            <div className="flex-grow overflow-hidden">
              <TabsContent value="about" className="mt-0 h-full">
                <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
                  <ArtistProfileLeftPanel 
                    artist={artist} 
                    techniques={techniques}
                    styles={styles}
                    panelColor={profile?.panel_color || '#ffffff'}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="links" className="mt-0 h-full">
                <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
                  <ArtistProfileCenterPanel 
                    artist={artist}
                    socialPlatforms={socialPlatforms}
                    links={profile?.links || []}
                    panelColor={profile?.panel_color || '#ffffff'}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="artwork" className="mt-0 h-full">
                <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
                  <ArtistProfileRightPanel 
                    artist={artist}
                    artworks={artworks}
                    panelColor={profile?.panel_color || '#ffffff'}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 px-8 overflow-hidden"
      style={{ 
        backgroundColor: profile?.background_color || '#f7cf1e',
        backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileLeftPanel 
              artist={artist} 
              techniques={techniques}
              styles={styles}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileCenterPanel 
              artist={artist}
              socialPlatforms={socialPlatforms}
              links={profile?.links || []}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
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
