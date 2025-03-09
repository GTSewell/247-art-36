
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PublishToggleProps {
  published: boolean;
  onChange: (name: string, checked: boolean) => void;
  disabled?: boolean;
}

const PublishToggle: React.FC<PublishToggleProps> = ({ 
  published, 
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-4 py-4 border-t">
      <Switch
        id="publish-profile"
        name="published"
        checked={published}
        onCheckedChange={(checked) => onChange("published", checked)}
        disabled={disabled}
      />
      <div className="space-y-1">
        <Label htmlFor="publish-profile">Publish Profile</Label>
        <p className="text-sm text-muted-foreground">
          {published 
            ? "Your profile is published and visible on the platform." 
            : "Your profile is currently hidden from public view."}
        </p>
      </div>
    </div>
  );
};

export default PublishToggle;
