import React from 'react';
import { Label } from '@/components/ui/label';
import { ColorTheme } from './types';

interface ColorPreviewProps {
  colorTheme: ColorTheme;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({ colorTheme }) => {
  return (
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
  );
};

export default ColorPreview;