
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  const fitStatus = artwork.fits 
    ? "text-green-600 text-xs" 
    : "text-red-500 text-xs";

  return (
    <div className={`p-4 rounded-lg border-2 ${artwork.fits ? 'border-green-200' : 'border-red-200'} bg-gray-50`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Artwork {index + 1}</h4>
        <div className="flex items-center gap-2">
          <span className={fitStatus}>
            {artwork.fits ? "Fits ✓" : "Too large ✗"}
          </span>
          {canRemove && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(artwork.id)}
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (cm)
          </label>
          <Input
            type="number"
            value={artwork.width}
            onChange={(e) => onDimensionChange(artwork.id, 'width', e.target.value)}
            min="0"
            className="border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <Input
            type="number"
            value={artwork.height}
            onChange={(e) => onDimensionChange(artwork.id, 'height', e.target.value)}
            min="0"
            className="border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          />
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Base Area: {artwork.width * artwork.height} sq cm
        {artwork.area !== artwork.width * artwork.height && (
          <span className="block">
            With spacing: {artwork.area} sq cm
          </span>
        )}
      </div>
    </div>
  );
};

export default ArtworkInputForm;
