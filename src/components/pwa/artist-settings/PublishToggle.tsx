
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface PublishToggleProps {
  published: boolean;
  onChange: (name: string, checked: boolean) => void;
  disabled?: boolean;
  isAdmin: boolean;
}

const PublishToggle: React.FC<PublishToggleProps> = ({ 
  published, 
  onChange,
  disabled = false,
  isAdmin = false
}) => {
  return (
    <div className="flex items-center space-x-4 py-4 border-t">
      {isAdmin ? (
        <>
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
                ? "This profile is published and visible on the platform." 
                : "This profile is currently hidden from public view."}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2 text-amber-600">
            <AlertCircle size={18} />
            <Label>Publication Status</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            {published 
              ? "Your profile is currently published. Contact an admin if you want to unpublish it." 
              : "Your profile is awaiting approval from an administrator."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PublishToggle;
