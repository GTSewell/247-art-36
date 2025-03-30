
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import BasicInfoForm from "./artist-settings/BasicInfoForm";
import LocationForm from "./artist-settings/LocationForm";
import ArtistTags from "./artist-settings/ArtistTags";
import { useArtistProfile } from "./artist-settings/hooks/useArtistProfile";

interface ArtistProfileSettingsProps {
  artistId: string | null;
}

const ArtistProfileSettings: React.FC<ArtistProfileSettingsProps> = ({ artistId }) => {
  const {
    loading,
    saving,
    artist,
    formData,
    handleChange,
    handleSocialPlatformChange,
    addSocialPlatform,
    removeSocialPlatform,
    handleImageChange,
    handleSubmit
  } = useArtistProfile(artistId);
  
  if (loading) {
    return <div className="p-8 text-center">Loading artist profile...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : artistId ? "Save Changes" : "Create Artist"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArtistProfileSettings;
