import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X, Sparkles, Globe, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "./types";

interface AutoProfileGeneratorProps {
  onProfileGenerated: (profileData: Partial<ArtistProfileFormData>) => void;
  artistId: string | null;
}

const AutoProfileGenerator: React.FC<AutoProfileGeneratorProps> = ({
  onProfileGenerated,
  artistId
}) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateProfile = async () => {
    const validUrls = urls.filter(url => url.trim() && isValidUrl(url.trim()));
    
    if (validUrls.length === 0) {
      toast.error('Please enter at least one valid URL');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('auto-generate-profile', {
        body: {
          urls: validUrls,
          artistId
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate profile');
      }

      const { profileData } = data;
      
      // Convert the AI response to our form data format
      const formattedData: Partial<ArtistProfileFormData> = {
        name: profileData.name || '',
        bio: profileData.bio || '',
        specialty: profileData.specialty || '',
        city: profileData.city || '',
        country: profileData.country || '',
        techniques: profileData.techniques || [],
        styles: profileData.styles || [],
        social_platforms: profileData.social_platforms || []
      };

      onProfileGenerated(formattedData);
      
      toast.success(`Profile generated successfully! Processed ${data.processedUrls} of ${data.totalUrls} URLs.`);
      setIsExpanded(false);
    } catch (error: any) {
      console.error('Error generating profile:', error);
      toast.error(`Failed to generate profile: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getUrlIcon = (url: string) => {
    if (url.includes('instagram.com')) return <Instagram className="h-4 w-4" />;
    if (url.includes('twitter.com') || url.includes('x.com')) return <Twitter className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  if (!isExpanded) {
    return (
      <Card className="mb-6 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Auto-Generate Profile</h3>
            <p className="text-muted-foreground mb-4">
              Save time by letting AI create your profile from your social media and website links
            </p>
            <Button onClick={() => setIsExpanded(true)} variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Auto-Generate Profile
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add your social media profiles, website, or portfolio links. AI will analyze them to create your artist profile.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Your Links</Label>
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {url && getUrlIcon(url)}
                </div>
                <Input
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder="https://instagram.com/yourprofile or https://yourwebsite.com"
                  className="pl-10"
                />
              </div>
              {urls.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeUrlField(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addUrlField}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Link
        </Button>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={generateProfile}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Profile
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• We'll analyze publicly available information from your links</p>
          <p>• You can review and edit all generated content before saving</p>
          <p>• Only accessible content will be used</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoProfileGenerator;