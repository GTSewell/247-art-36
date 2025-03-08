
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Settings, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const CollectorSettings: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    newReleases: true,
    artistUpdates: true,
    orderUpdates: true
  });
  
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // This is a placeholder - in a real implementation you would:
      // 1. Update the user's profile in the database
      // 2. Update notification preferences in the database
      
      toast.success("Settings saved successfully");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(`Error signing out: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="newReleases">New Releases</Label>
            <Switch
              id="newReleases"
              checked={notifications.newReleases}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, newReleases: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="artistUpdates">Artist Updates</Label>
            <Switch
              id="artistUpdates"
              checked={notifications.artistUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, artistUpdates: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="orderUpdates">Order Updates</Label>
            <Switch
              id="orderUpdates"
              checked={notifications.orderUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, orderUpdates: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col space-y-2">
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default CollectorSettings;
