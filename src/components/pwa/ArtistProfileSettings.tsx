
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { toast } from "sonner";

interface ArtistProfileSettingsProps {
  artistId: number | null;
}

const ArtistProfileSettings: React.FC<ArtistProfileSettingsProps> = ({ artistId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artist, setArtist] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    bio: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: ""
  });
  
  useEffect(() => {
    if (artistId) {
      fetchArtistProfile();
    }
  }, [artistId]);
  
  const fetchArtistProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setArtist(data);
        setFormData({
          name: data.name || "",
          specialty: data.specialty || "",
          bio: data.bio || "",
          city: data.city || "",
          country: data.country || "",
          techniques: Array.isArray(data.techniques) 
            ? data.techniques.join(', ') 
            : typeof data.techniques === 'string' ? data.techniques : "",
          styles: Array.isArray(data.styles) 
            ? data.styles.join(', ') 
            : typeof data.styles === 'string' ? data.styles : "",
          social_platforms: Array.isArray(data.social_platforms) 
            ? data.social_platforms.join(', ') 
            : typeof data.social_platforms === 'string' ? data.social_platforms : ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching artist profile:", error);
      toast.error(`Failed to load artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artistId) {
      toast.error("Artist ID not found");
      return;
    }
    
    try {
      setSaving(true);
      
      // Process array values
      const processedData = {
        ...formData,
        techniques: formData.techniques.split(',').map(item => item.trim()),
        styles: formData.styles.split(',').map(item => item.trim()),
        social_platforms: formData.social_platforms.split(',').map(item => item.trim())
      };
      
      const { error } = await supabase
        .from('artists')
        .update(processedData)
        .eq('id', artistId);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating artist profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
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
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your artist name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Your specialty"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your country"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="techniques">Techniques (comma separated)</Label>
            <Input
              id="techniques"
              name="techniques"
              value={formData.techniques}
              onChange={handleChange}
              placeholder="Oil, Acrylic, Digital, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="styles">Styles (comma separated)</Label>
            <Input
              id="styles"
              name="styles"
              value={formData.styles}
              onChange={handleChange}
              placeholder="Abstract, Modern, Pop Art, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social_platforms">Social Platforms (comma separated)</Label>
            <Input
              id="social_platforms"
              name="social_platforms"
              value={formData.social_platforms}
              onChange={handleChange}
              placeholder="Instagram, Twitter, Facebook, etc."
            />
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
