import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ColorTheme } from './types';

interface BackgroundToggleProps {
  backgroundImage: string | null;
  colorTheme: ColorTheme;
  onToggleChange: (checked: boolean) => void;
}

const BackgroundToggle: React.FC<BackgroundToggleProps> = ({
  backgroundImage,
  colorTheme,
  onToggleChange
}) => {
  if (!backgroundImage) return null;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Background Source</Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="use-background-image"
          checked={colorTheme.useBackgroundImage}
          onCheckedChange={onToggleChange}
        />
        <Label htmlFor="use-background-image" className="text-sm">
          Use uploaded background image (when unchecked, uses background color)
        </Label>
      </div>
    </div>
  );
};

export default BackgroundToggle;