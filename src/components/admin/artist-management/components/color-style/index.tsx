import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Palette } from 'lucide-react';
import ColorPreview from './ColorPreview';
import BackgroundToggle from './BackgroundToggle';
import ColorControls from './ColorControls';
import { useColorThemeData } from './useColorThemeData';

interface ColorStyleSectionProps {
  artistId: string | null;
}

const ColorStyleSection: React.FC<ColorStyleSectionProps> = ({ artistId }) => {
  const {
    colorTheme,
    loading,
    saving,
    backgroundImage,
    saveColorTheme,
    resetToDefault,
    handleColorChange
  } = useColorThemeData(artistId);

  if (!artistId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Styling
          </CardTitle>
          <CardDescription>
            Select an artist to customize their color theme
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Styling
        </CardTitle>
        <CardDescription>
          Customize the color theme for buttons, panels, and backgrounds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ColorPreview colorTheme={colorTheme} />

        <BackgroundToggle
          backgroundImage={backgroundImage}
          colorTheme={colorTheme}
          onToggleChange={(checked) => handleColorChange('useBackgroundImage', checked)}
        />

        <ColorControls
          colorTheme={colorTheme}
          onColorChange={handleColorChange}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={saveColorTheme} 
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Saving...' : 'Save Color Theme'}
          </Button>
          <Button 
            variant="outline" 
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Colors can be entered as hex values (#ffffff) or using the color picker</p>
          <p>• Changes will apply to the artist's profile buttons, panels, and backgrounds</p>
          <p>• Custom colors override automatic color extraction from background images</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorStyleSection;