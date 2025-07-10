
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import BasicInfoForm from "./artist-settings/BasicInfoForm";
import LocationForm from "./artist-settings/LocationForm";
import ArtistTags from "./artist-settings/ArtistTags";
import BackgroundUpload from "./artist-settings/BackgroundUpload";
import AutoProfileGenerator from "./artist-settings/AutoProfileGenerator";
import { useArtistProfile } from "./artist-settings/hooks/useArtistProfile";
import { toast } from "sonner";
import { ArtistProfileFormData } from "./artist-settings/types";

interface ArtistProfileSettingsProps {
  artistId: string | null;
}

const ArtistProfileSettings: React.FC<ArtistProfileSettingsProps> = ({ artistId }) => {
  const {
    loading,
    saving,
    artist,
    formData,
    backgroundImage,
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange,
    handleBackgroundChange,
    handleSubmit,
    setFormData
  } = useArtistProfile(artistId);

  const handleAutoProfileGenerated = (profileData: Partial<ArtistProfileFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...profileData
    }));
    toast.success('Profile auto-generated! Review the information below and make any changes.');
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading artist profile...</div>;
  }
  
  const isDemo = artistId === "demo";
  const displayText = isDemo ? "Demo Artist Profile" : (artistId ? "Artist Profile" : "Create New Artist Profile");
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await handleSubmit(e);
      
      if (!result?.success) {
        toast.error(`Failed to save: ${result?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(`Form submission error: ${error.message}`);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          {displayText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AutoProfileGenerator 
          onProfileGenerated={handleAutoProfileGenerated}
          artistId={artistId}
        />
        
        <form onSubmit={onSubmit} className="space-y-4">
          <BasicInfoForm 
            formData={formData} 
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            artistId={artist?.id}
          />
          
          <LocationForm 
            formData={formData}
            handleChange={handleChange}
          />
          
          <ArtistTags 
            formData={formData}
            handleChange={handleChange}
            handleSocialPlatformChange={handleSocialPlatformChange}
            addSocialPlatform={addSocialPlatform}
            removeSocialPlatform={removeSocialPlatform}
          />

          <BackgroundUpload
            currentBackground={backgroundImage}
            onBackgroundChange={handleBackgroundChange}
            artistName={formData.name || "Artist"}
            artistId={artistId}
          />
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : isDemo ? "Save Demo Changes" : (artistId ? "Save Changes" : "Create Artist")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArtistProfileSettings;
