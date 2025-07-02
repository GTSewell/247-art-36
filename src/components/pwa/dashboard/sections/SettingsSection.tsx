import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import { Settings } from "lucide-react";

interface SettingsSectionProps {
  artistId: string | null;
  isDemo: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ artistId, isDemo }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          Profile Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your artist profile information and preferences
        </p>
      </div>

      {/* Profile Settings - reuse existing component but with cleaner styling */}
      <div className="max-w-2xl">
        <ArtistProfileSettings artistId={artistId} />
      </div>
    </div>
  );
};

export default SettingsSection;