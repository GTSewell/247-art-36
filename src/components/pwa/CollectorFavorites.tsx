
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Artist } from "@/data/types/artist";
import { logger } from "@/utils/logger";

const CollectorFavorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Artist[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchFavoriteArtists();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchFavoriteArtists = async () => {
    try {
      setLoading(true);
      logger.info("Fetching favorite artists for user:", user?.id);
      
      // Get favorite artist IDs
      const { data: favoriteIds, error: favError } = await supabase
        .from('favorite_artists')
        .select('artist_id')
        .eq('user_id', user?.id);
      
      if (favError) throw favError;
      
      if (favoriteIds && favoriteIds.length > 0) {
        logger.info(`Found ${favoriteIds.length} favorite artists`);
        // Get artist details for each favorite
        const artistIds = favoriteIds.map(fav => fav.artist_id);
        
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('*')
          .in('id', artistIds);
        
        if (artistsError) throw artistsError;
        
        if (artistsData) {
          logger.info(`Retrieved ${artistsData.length} artist details`);
          // Transform the data to match the Artist type
          const transformedArtists: Artist[] = artistsData.map(data => ({
            id: data.id,
            name: data.name || "",
            specialty: data.specialty || "",
            image: data.image || "",
            bio: data.bio || "",
            location: data.location,
            city: data.city,
            country: data.country,
            techniques: Array.isArray(data.techniques) 
              ? data.techniques 
              : typeof data.techniques === 'string' 
                ? JSON.parse(data.techniques) 
                : [],
            styles: Array.isArray(data.styles) 
              ? data.styles 
              : typeof data.styles === 'string' 
                ? JSON.parse(data.styles) 
                : [],
            social_platforms: Array.isArray(data.social_platforms) 
              ? data.social_platforms 
              : typeof data.social_platforms === 'string' 
                ? JSON.parse(data.social_platforms) 
                : [],
            artworks: Array.isArray(data.artworks) 
              ? data.artworks 
              : typeof data.artworks === 'string' 
                ? JSON.parse(data.artworks) 
                : [],
            locked_artworks: data.locked_artworks
          }));
          
          setFavorites(transformedArtists);
        } else {
          setFavorites([]);
        }
      } else {
        logger.info("No favorite artists found");
        setFavorites([]);
      }
    } catch (error: any) {
      logger.error("Error fetching favorite artists:", error);
      toast.error(`Failed to load favorites: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToArtist = (artist: Artist) => {
    const formattedName = artist.name.replace(/\s+/g, '');
    logger.info(`Navigating to artist page: ${formattedName}`);
    navigate(`/artists/${formattedName}`);
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Your Favorite Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-4">Loading your favorites...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5" />
          Your Favorite Artists
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't favorited any artists yet</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/artists')}>
              Browse Artists
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {favorites.map((artist) => (
              <Card key={artist.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name || "Artist"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{artist.name}</h3>
                  <p className="text-sm text-gray-500">{artist.specialty}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigateToArtist(artist)}
                  >
                    View Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectorFavorites;
