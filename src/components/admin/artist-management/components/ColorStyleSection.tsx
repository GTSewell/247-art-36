import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ColorStyleSectionProps {
  artistId: string | null;
}

interface ColorTheme {
  background: string;
  panel: string;
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonBorder: string;
  badgeBg: string;
}

const DEFAULT_THEME: ColorTheme = {
  background: '#e5d0b9',
  panel: '#FEF9F4',
  button: '#95B3D2',
  buttonText: '#ffffff',
  buttonHover: '#7A9CC2',
  buttonBorder: '#95B3D2',
  badgeBg: '#f7f4f0'
};

const ColorStyleSection: React.FC<ColorStyleSectionProps> = ({ artistId }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (artistId) {
      loadCustomColorTheme();
    }
  }, [artistId]);

  const loadCustomColorTheme = async () => {
    if (!artistId) return;

    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('artist_id', parseInt(artistId))
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading color theme:', error);
        return;
      }

      if (profile?.links && typeof profile.links === 'object' && profile.links !== null && 'colorTheme' in profile.links) {
        const savedTheme = (profile.links as any).colorTheme;
        if (savedTheme) {
          setColorTheme({ ...DEFAULT_THEME, ...savedTheme });
        }
      }
    } catch (error) {
      console.error('Error loading color theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveColorTheme = async () => {
    if (!artistId) {
      toast.error('No artist selected');
      return;
    }

    try {
      setSaving(true);

      // First, get the current profile to preserve existing links
      const { data: currentProfile, error: fetchError } = await supabase
        .from('artist_profiles')
        .select('links')
        .eq('artist_id', parseInt(artistId))
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const currentLinks = (currentProfile?.links as any) || {};
      const updatedLinks = {
        ...(typeof currentLinks === 'object' && currentLinks !== null ? currentLinks : {}),
        colorTheme: colorTheme
      };

      // Update or insert the profile
      const { error: upsertError } = await supabase
        .from('artist_profiles')
        .upsert({
          artist_id: parseInt(artistId),
          links: updatedLinks,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        throw upsertError;
      }

      toast.success('Color theme saved successfully');
    } catch (error) {
      console.error('Error saving color theme:', error);
      toast.error('Failed to save color theme');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setColorTheme(DEFAULT_THEME);
  };

  const handleColorChange = (field: keyof ColorTheme, value: string) => {
    setColorTheme(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        {/* Preview Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Preview</Label>
          <div 
            className="p-4 rounded-lg border" 
            style={{ backgroundColor: colorTheme.background }}
          >
            <div 
              className="p-4 rounded-md mb-4" 
              style={{ backgroundColor: colorTheme.panel }}
            >
              <p className="text-sm text-gray-700 mb-3">Sample panel content</p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: colorTheme.button,
                    color: colorTheme.buttonText,
                    border: `1px solid ${colorTheme.buttonBorder}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorTheme.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorTheme.button;
                  }}
                >
                  Sample Button
                </button>
                <span 
                  className="px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: colorTheme.badgeBg }}
                >
                  Badge
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="background">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="background"
                type="color"
                value={colorTheme.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colorTheme.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1"
                placeholder="#e5d0b9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="panel">Panel Color</Label>
            <div className="flex gap-2">
              <Input
                id="panel"
                type="color"
                value={colorTheme.panel}
                onChange={(e) => handleColorChange('panel', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colorTheme.panel}
                onChange={(e) => handleColorChange('panel', e.target.value)}
                className="flex-1"
                placeholder="#FEF9F4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="button">Button Color</Label>
            <div className="flex gap-2">
              <Input
                id="button"
                type="color"
                value={colorTheme.button}
                onChange={(e) => handleColorChange('button', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colorTheme.button}
                onChange={(e) => handleColorChange('button', e.target.value)}
                className="flex-1"
                placeholder="#95B3D2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="buttonText"
                type="color"
                value={colorTheme.buttonText}
                onChange={(e) => handleColorChange('buttonText', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colorTheme.buttonText}
                onChange={(e) => handleColorChange('buttonText', e.target.value)}
                className="flex-1"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonHover">Button Hover Color</Label>
            <div className="flex gap-2">
              <Input
                id="buttonHover"
                type="color"
                value={colorTheme.buttonHover}
                onChange={(e) => handleColorChange('buttonHover', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colorTheme.buttonHover}
                onChange={(e) => handleColorChange('buttonHover', e.target.value)}
                className="flex-1"
                placeholder="#7A9CC2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badgeBg">Badge Background</Label>
            <div className="flex gap-2">
              <Input
                id="badgeBg"
                type="color"
                value={colorTheme.badgeBg}
                onChange={(e) => handleColorChange('badgeBg', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colorTheme.badgeBg}
                onChange={(e) => handleColorChange('badgeBg', e.target.value)}
                className="flex-1"
                placeholder="#f7f4f0"
              />
            </div>
          </div>
        </div>

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