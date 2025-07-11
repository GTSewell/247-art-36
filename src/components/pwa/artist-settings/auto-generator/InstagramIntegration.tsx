import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, User, Calendar, ExternalLink } from 'lucide-react';
import { useInstagramAuth } from '@/hooks/useInstagramAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface InstagramIntegrationProps {
  onUseInstagramData?: () => void;
  className?: string;
}

const InstagramIntegration: React.FC<InstagramIntegrationProps> = ({
  onUseInstagramData,
  className
}) => {
  const { connection, isLoading, connectInstagram, disconnectInstagram, isConnected } = useInstagramAuth();

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

            <Button onClick={connectInstagram} className="w-full">
              <Instagram className="h-4 w-4 mr-2" />
              Connect Instagram Account
            </Button>

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <p className="font-medium mb-1">🔒 Privacy & Security:</p>
              <ul className="space-y-1">
                <li>• We only access basic profile information</li>
                <li>• Your Instagram credentials are never stored</li>
                <li>• You can disconnect at any time</li>
                <li>• We follow Instagram's data usage policies</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramIntegration;