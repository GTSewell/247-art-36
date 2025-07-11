import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Instagram, User, Calendar, ExternalLink, Upload, AlertCircle } from 'lucide-react';
import { useInstagramAuth } from '@/hooks/useInstagramAuth';
import { useManualInstagram } from '@/hooks/useManualInstagram';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface InstagramIntegrationProps {
  onUseInstagramData?: () => void;
  onUseManualData?: (data: any) => void;
  className?: string;
}

const InstagramIntegration: React.FC<InstagramIntegrationProps> = ({
  onUseInstagramData,
  onUseManualData,
  className
}) => {
  const { connection, isLoading, connectInstagram, disconnectInstagram, isConnected } = useInstagramAuth();
  const { manualData, updateManualData, validateUsername, clearManualData, formatForProfileGeneration } = useManualInstagram();
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      updateManualData({ profileImageFile: file });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        updateManualData({ profileImageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualSubmit = () => {
    if (!manualData.username) {
      toast.error('Please enter an Instagram username');
      return;
    }
    
    if (!validateUsername(manualData.username)) {
      toast.error('Please enter a valid Instagram username (letters, numbers, dots, underscores only)');
      return;
    }
    
    if (onUseManualData) {
      onUseManualData(formatForProfileGeneration());
      toast.success('Manual Instagram data will be used for profile generation');
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 animate-pulse" />
            <span className="text-sm text-muted-foreground">Loading Instagram connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Instagram className="h-5 w-5 mr-2" />
          Instagram Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auto">Auto Connect</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto" className="space-y-4">
            {isConnected && connection ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={connection.profile_picture_url || undefined} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">@{connection.username}</h4>
                  <Badge variant="secondary" className="text-xs">
                    Connected
                  </Badge>
                </div>
                {connection.full_name && (
                  <p className="text-sm text-muted-foreground">{connection.full_name}</p>
                )}
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Connected on {new Date(connection.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {onUseInstagramData && (
                <Button onClick={onUseInstagramData} className="flex-1">
                  <Instagram className="h-4 w-4 mr-2" />
                  Use Instagram Data
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={disconnectInstagram}
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <p className="font-medium mb-1">✨ Instagram Integration Benefits:</p>
              <ul className="space-y-1">
                <li>• Auto-fill profile with Instagram bio and info</li>
                <li>• Import your latest Instagram posts as artwork samples</li>
                <li>• Keep profile synchronized with Instagram updates</li>
              </ul>
            </div>
          </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">Connect Your Instagram</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Instagram account to automatically import your profile data and artwork.
                  </p>
                </div>

                <Button onClick={connectInstagram} className="w-full" disabled>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Instagram OAuth Currently Unavailable
                </Button>

                <div className="text-xs text-muted-foreground bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="font-medium mb-1 text-orange-800 dark:text-orange-200">⚠️ Temporary Limitation:</p>
                  <p className="text-orange-700 dark:text-orange-300 mb-2">Instagram auto-connect is temporarily unavailable due to API restrictions.</p>
                  <p className="text-orange-700 dark:text-orange-300">Please use the "Manual Input" tab to enter your Instagram information manually.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center py-4">
                <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <h4 className="font-medium mb-2">Manual Instagram Input</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your Instagram details manually to use for profile generation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram-username">Instagram Username</Label>
                  <Input
                    id="instagram-username"
                    placeholder="your_username"
                    value={manualData.username}
                    onChange={(e) => updateManualData({ username: e.target.value })}
                    className={!validateUsername(manualData.username) && manualData.username ? 'border-destructive' : ''}
                  />
                  {manualData.username && !validateUsername(manualData.username) && (
                    <p className="text-xs text-destructive">Username can only contain letters, numbers, dots, and underscores</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram-fullname">Full Name (Optional)</Label>
                  <Input
                    id="instagram-fullname"
                    placeholder="Your Full Name"
                    value={manualData.fullName}
                    onChange={(e) => updateManualData({ fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram-bio">Bio (Optional)</Label>
                  <Textarea
                    id="instagram-bio"
                    placeholder="Tell us about your art, style, and creative journey..."
                    value={manualData.bio}
                    onChange={(e) => updateManualData({ bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-image">Profile Image (Optional)</Label>
                  <div className="flex items-center space-x-4">
                    {imagePreview && (
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={imagePreview} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a profile image (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleManualSubmit} 
                    className="flex-1"
                    disabled={!manualData.username || !validateUsername(manualData.username)}
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Use Manual Data
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearManualData}
                    disabled={!manualData.username && !manualData.bio && !manualData.fullName}
                  >
                    Clear
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p className="font-medium mb-1">💡 Manual Input Benefits:</p>
                  <ul className="space-y-1">
                    <li>• Works when Instagram OAuth is unavailable</li>
                    <li>• You control exactly what information is used</li>
                    <li>• No need for Instagram API permissions</li>
                    <li>• AI will still enhance your profile based on the bio you provide</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InstagramIntegration;