
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, PlusCircle, Trash2, SquareAlertIcon } from "lucide-react";
import ArtworkVisualizer from "./ArtworkVisualizer";

// Define constants
const STUDIO_ARTIST_SQCM = 5625; // 5,625 sq cm
const FEATURE_ARTIST_SQCM = 10000; // 10,000 sq cm
const SPACING_CM = 5; // 5 cm spacing on all sides when multiple artworks

interface Artwork {
  id: number;
  width: number; // in cm
  height: number; // in cm
  fits: boolean;
  area: number; // in sq cm
}

const ArtworkSizeCalculator: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<'studio' | 'feature'>('studio');
  const [artworks, setArtworks] = useState<Artwork[]>([
    { id: 1, width: 50, height: 50, fits: true, area: 2500 }
  ]);
  const [totalArea, setTotalArea] = useState<number>(2500);
  const [maxAllowedArea, setMaxAllowedArea] = useState<number>(STUDIO_ARTIST_SQCM);
  const [maxArtworks, setMaxArtworks] = useState<number>(2);

  // Update max allowed area and max artworks when package type changes
  useEffect(() => {
    if (selectedPackage === 'studio') {
      setMaxAllowedArea(STUDIO_ARTIST_SQCM);
      setMaxArtworks(2);
    } else {
      setMaxAllowedArea(FEATURE_ARTIST_SQCM);
      setMaxArtworks(4);
    }
    
    // Recalculate to check if existing artworks still fit
    calculateTotalArea(artworks);
  }, [selectedPackage]);

  // Generate a new unique ID for artworks
  const generateId = (): number => {
    return Date.now();
  };

  // Calculate artwork area including spacing
  const calculateArtworkArea = (artwork: Artwork, artworksCount: number): number => {
    // Only add spacing if there is more than one artwork
    if (artworksCount > 1) {
      // Add spacing to all sides of each artwork
      const adjustedWidth = artwork.width + (SPACING_CM * 2);
      const adjustedHeight = artwork.height + (SPACING_CM * 2);
      return adjustedWidth * adjustedHeight;
    }
    return artwork.width * artwork.height;
  };

  // Calculate total area and update fits status for all artworks
  const calculateTotalArea = (updatedArtworks: Artwork[]) => {
    const artworksCount = updatedArtworks.length;
    
    let calculatedTotalArea = 0;
    const updatedWithFits = updatedArtworks.map(artwork => {
      const area = calculateArtworkArea(artwork, artworksCount);
      calculatedTotalArea += area;
      return { ...artwork, area };
    });

    // Update fits status after calculating the total area
    const finalArtworks = updatedWithFits.map(artwork => ({
      ...artwork,
      fits: calculatedTotalArea <= maxAllowedArea
    }));

    setTotalArea(calculatedTotalArea);
    setArtworks(finalArtworks);
  };

  // Add a new artwork
  const addArtwork = () => {
    if (artworks.length < maxArtworks) {
      const newArtworks = [
        ...artworks,
        { id: generateId(), width: 50, height: 50, fits: true, area: 2500 }
      ];
      setArtworks(newArtworks);
      calculateTotalArea(newArtworks);
    }
  };

  // Remove an artwork
  const removeArtwork = (id: number) => {
    const filteredArtworks = artworks.filter(artwork => artwork.id !== id);
    setArtworks(filteredArtworks);
    calculateTotalArea(filteredArtworks);
  };

  // Handle artwork dimension changes
  const handleDimensionChange = (id: number, dimension: 'width' | 'height', value: string) => {
    // Convert to number and ensure it's not negative
    const numValue = Math.max(0, Number(value) || 0);
    
    const updatedArtworks = artworks.map(artwork => 
      artwork.id === id ? { ...artwork, [dimension]: numValue } : artwork
    );
    
    setArtworks(updatedArtworks);
    calculateTotalArea(updatedArtworks);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Artwork Size Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Package Selection */}
            <div className="space-y-2">
              <Label htmlFor="package-select">Select Package Type</Label>
              <Select 
                value={selectedPackage} 
                onValueChange={(value: 'studio' | 'feature') => setSelectedPackage(value)}
              >
                <SelectTrigger id="package-select">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio Artist (5,625 sq cm)</SelectItem>
                  <SelectItem value="feature">Feature Artist (10,000 sq cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Artwork Inputs */}
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
                <div 
                  key={artwork.id} 
                  className={`p-4 rounded-lg border ${artwork.fits ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Artwork {index + 1}</h4>
                    {artworks.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArtwork(artwork.id)}
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
                        onChange={(e) => handleDimensionChange(artwork.id, 'width', e.target.value)}
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
                        onChange={(e) => handleDimensionChange(artwork.id, 'height', e.target.value)}
                        className={artwork.fits ? 'border-green-500' : 'border-red-500'}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm">
                      Base Area: {artwork.width * artwork.height} sq cm
                      {artworks.length > 1 && (
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
                          <SquareAlertIcon className="h-4 w-4 mr-1" />
                          Too large
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Artwork Button */}
              {artworks.length < maxArtworks && (
                <Button
                  onClick={addArtwork}
                  variant="outline"
                  className="w-full mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Artwork ({artworks.length}/{maxArtworks})
                </Button>
              )}
            </div>

            {/* Visual Representation */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Visual Representation</h3>
              <ArtworkVisualizer 
                artworks={artworks} 
                maxArea={maxAllowedArea}
                totalArea={totalArea}
                spacing={SPACING_CM}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtworkSizeCalculator;
