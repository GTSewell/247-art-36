
import React from "react";
import { RefreshCw, Save, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArtistCardProps {
  id: number;
  name: string;
  specialty: string;
  image: string;
  onSelect: (id: number) => void;
  onRegenerateImage: () => void;
  onFavoriteToggle: (isFavorite: boolean) => void;
  isFavorite: boolean;
  isFeatured?: boolean;
}

const ArtistCard = ({ 
  id, 
  name, 
  specialty, 
  image, 
  onSelect, 
  onRegenerateImage,
  onFavoriteToggle,
  isFavorite,
  isFeatured = false 
}: ArtistCardProps) => {
  const [isImageFixed, setIsImageFixed] = React.useState(false);

  React.useEffect(() => {
    const checkFixedImage = async () => {
      const { data } = await supabase
        .from('artist_images')
        .select('image_url')
        .eq('artist_id', id)
        .maybeSingle();
      
      setIsImageFixed(!!data);
    };

    checkFixedImage();
  }, [id]);

  const handleSaveImage = async () => {
    try {
      const { error } = await supabase
        .from('artist_images')
        .upsert({ artist_id: id, image_url: image });

      if (error) throw error;

      setIsImageFixed(true);
      toast.success('Image saved successfully!');
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
  };

  const subdomain = `${name.toLowerCase().replace(/\s+/g, '')}.247.art`;

  const toggleFavorite = () => {
    onFavoriteToggle(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div className="relative">
      {/* Favorite Button - Always visible and interactive */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-4 right-4 z-[100] ${
          isFavorite 
            ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90' 
            : 'bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white'
        }`}
        onClick={toggleFavorite}
      >
        <Zap size={isFeatured ? 24 : 20} />
      </Button>

      <div className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        {/* Artist Information Container - Initial state visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className={`absolute bottom-0 left-0 right-0 p-${isFeatured ? '6' : '4'}`}>
            <div>
              <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold text-white mb-1`}>{name}</h3>
              <p className="text-white/80 text-sm mb-1">{specialty}</p>
              <p className="text-white/60 text-base mb-3 font-mono">{subdomain}</p>
              {!isImageFixed && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size={isFeatured ? "default" : "sm"}
                    onClick={onRegenerateImage}
                  >
                    <RefreshCw size={isFeatured ? 20 : 16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size={isFeatured ? "default" : "sm"}
                    onClick={handleSaveImage}
                  >
                    <Save size={isFeatured ? 20 : 16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
