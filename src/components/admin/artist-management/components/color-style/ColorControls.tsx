import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorTheme } from './types';

interface ColorControlsProps {
  colorTheme: ColorTheme;
  onColorChange: (field: keyof ColorTheme, value: string) => void;
}

const ColorControls: React.FC<ColorControlsProps> = ({ colorTheme, onColorChange }) => {
  const colorFields = [
    { key: 'background', label: 'Background Color', placeholder: '#e5d0b9' },
    { key: 'panel', label: 'Panel Color', placeholder: '#FEF9F4' },
    { key: 'button', label: 'Button Color', placeholder: '#95B3D2' },
    { key: 'buttonText', label: 'Button Text Color', placeholder: '#ffffff' },
    { key: 'buttonHover', label: 'Button Hover Color', placeholder: '#7A9CC2' },
    { key: 'badgeBg', label: 'Badge Background', placeholder: '#f7f4f0' }
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {colorFields.map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <div className="flex gap-2">
            <Input
              id={key}
              type="color"
              value={colorTheme[key]}
              onChange={(e) => onColorChange(key, e.target.value)}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={colorTheme[key]}
              onChange={(e) => onColorChange(key, e.target.value)}
              className="flex-1"
              placeholder={placeholder}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorControls;