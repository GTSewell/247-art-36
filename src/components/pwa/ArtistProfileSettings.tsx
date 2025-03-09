
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import BasicInfoForm from "./artist-settings/BasicInfoForm";
import LocationForm from "./artist-settings/LocationForm";
import ArtistTags from "./artist-settings/ArtistTags";
import { useArtistProfile } from "./artist-settings/useArtistProfile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import ImageUpload from "./artist-settings/ImageUpload";

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
    handleSubmit,
    isAdmin,
    handleImageUpload
  } = useArtistProfile(artistId);
  
  if (loading) {
    return <div className="p-8 text-center">Loading artist profile...</div>;
  }
  
  // Handle publish toggle change
  const handlePublishToggle = (checked: boolean) => {
    const event = {
      target: {
        name: "is_published",
        value: checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
  };
  
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
          <ImageUpload 
            artistImage={artist?.image || ""} 
            onImageUpload={handleImageUpload} 
          />
          
          <BasicInfoForm 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <LocationForm 
            formData={formData}
            handleChange={handleChange}
          />
          
          <ArtistTags 
            formData={formData}
            handleChange={handleChange}
          />
          
          {/* Publish Profile Toggle - Only editable by admins */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_published"
                checked={!!formData.is_published}
                onCheckedChange={handlePublishToggle}
                disabled={!isAdmin}
              />
              <Label htmlFor="is_published">Publish Profile</Label>
            </div>
            
            {!isAdmin && (
              <Alert variant="default" className="bg-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Only administrators can publish profiles. Your profile will be reviewed and published by an admin.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArtistProfileSettings;
