
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertCircle } from "lucide-react";
import { Artwork } from "./types/artwork-types";

interface ArtworkInputFormProps {
  artwork: Artwork;
  index: number;
  onDimensionChange: (id: number, dimension: 'width' | 'height', value: string) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

const ArtworkInputForm: React.FC<ArtworkInputFormProps> = ({ 
  artwork, 
  index, 
  onDimensionChange, 
  onRemove,
  canRemove
}) => {
  return (
    <div 
      className={`p-4 rounded-lg border ${artwork.fits ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Artwork {index + 1}</h4>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(artwork.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`width-${artwork.id}`}>Width (cm)</Label>
          <Input
            id={`width-${artwork.id}`}
            type="number"
            min="1"
            value={artwork.width}
            onChange={(e) => onDimensionChange(artwork.id, 'width', e.target.value)}
            className={artwork.fits ? 'border-green-500' : 'border-red-500'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`height-${artwork.id}`}>Height (cm)</Label>
          <Input
            id={`height-${artwork.id}`}
            type="number"
            min="1"
            value={artwork.height}
            onChange={(e) => onDimensionChange(artwork.id, 'height', e.target.value)}
            className={artwork.fits ? 'border-green-500' : 'border-red-500'}
          />
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm">
          Base Area: {artwork.width * artwork.height} sq cm
          {artwork.area > artwork.width * artwork.height && (
            <span className="block text-gray-500">
              With spacing: {artwork.area} sq cm
              <span className="block text-xs">(Includes 5cm spacing on all sides)</span>
            </span>
          )}
        </div>
        <div className={`text-sm font-semibold ${artwork.fits ? 'text-green-600' : 'text-red-600'}`}>
          {artwork.fits ? (
            <span>Fits ✓</span>
          ) : (
            <span className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Too large
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkInputForm;
