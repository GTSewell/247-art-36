
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import ArtworkVisualizer from "./ArtworkVisualizer";
import ArtworkInputForm from "./ArtworkInputForm";
import PackageSelector from "./PackageSelector";
import { Artwork, STUDIO_ARTIST_SQCM, FEATURE_ARTIST_SQCM } from "./types/artwork-types";
import { generateId, calculateTotalAreaWithFits } from "./utils/artwork-calculations";

const ArtworkSizeCalculator: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<'studio' | 'feature'>('studio');
  const [artworks, setArtworks] = useState<Artwork[]>([
    { id: 1, width: '', height: '', fits: true, area: 0 }
  ]);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [maxAllowedArea, setMaxAllowedArea] = useState<number>(STUDIO_ARTIST_SQCM);
  const [maxArtworks, setMaxArtworks] = useState<number>(2);

  useEffect(() => {
    if (selectedPackage === 'studio') {
      setMaxAllowedArea(STUDIO_ARTIST_SQCM);
      setMaxArtworks(2);
    } else {
      setMaxAllowedArea(FEATURE_ARTIST_SQCM);
      setMaxArtworks(4);
    }
    
    updateCalculations(artworks);
  }, [selectedPackage]);

  const updateCalculations = (updatedArtworks: Artwork[]) => {
    const { artworks: calculatedArtworks, totalArea: calculatedTotalArea } = 
      calculateTotalAreaWithFits(updatedArtworks, maxAllowedArea);
    
    setTotalArea(calculatedTotalArea);
    setArtworks(calculatedArtworks);
  };

  const addArtwork = () => {
    if (artworks.length < maxArtworks) {
      const newArtworks = [
        ...artworks,
        { id: generateId(), width: '', height: '', fits: true, area: 0 }
      ];
      updateCalculations(newArtworks);
    }
  };

  const removeArtwork = (id: number) => {
    const filteredArtworks = artworks.filter(artwork => artwork.id !== id);
    updateCalculations(filteredArtworks);
  };

  const handleDimensionChange = (id: number, dimension: 'width' | 'height', value: string) => {
    const numValue = value === '' ? '' : Math.max(0, Number(value) || 0);
    
    const updatedArtworks = artworks.map(artwork => 
      artwork.id === id ? { ...artwork, [dimension]: numValue } : artwork
    );
    
    updateCalculations(updatedArtworks);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Calculate You Artwork Space</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <PackageSelector 
              value={selectedPackage} 
              onChange={setSelectedPackage} 
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Artworks</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${totalArea > maxAllowedArea ? 'text-red-500' : 'text-green-600'}`}>
                    {totalArea} / {maxAllowedArea} sq cm used
                  </span>
                </div>
              </div>
              
              {artworks.map((artwork, index) => (
                <ArtworkInputForm 
                  key={artwork.id}
                  artwork={artwork}
                  index={index}
                  onDimensionChange={handleDimensionChange}
                  onRemove={removeArtwork}
                  canRemove={artworks.length > 1}
                />
              ))}

              {artworks.length < maxArtworks && (
                <Button
                  onClick={addArtwork}
                  variant="outline"
                  className="w-full mt-2 border-2 border-gray-300 hover:border-gray-500 shadow-sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Artwork ({artworks.length}/{maxArtworks})
                </Button>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Visual Representation</h3>
              <ArtworkVisualizer 
                artworks={artworks} 
                maxArea={maxAllowedArea}
                totalArea={totalArea}
                spacing={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtworkSizeCalculator;
