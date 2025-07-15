import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette, Image, Type, Circle } from "lucide-react";

interface AppearanceSectionProps {
  artistId: string | null;
  isDemo: boolean;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({ artistId, isDemo }) => {
  const [selectedTheme, setSelectedTheme] = useState("gradient");
  const [selectedButtonStyle, setSelectedButtonStyle] = useState("rounded");

  const themes = [
    { id: "solid", name: "Solid Color", preview: "bg-blue-500" },
    { id: "gradient", name: "Gradient", preview: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "image", name: "Background Image", preview: "bg-gray-200" }
  ];

  const buttonStyles = [
    { id: "rounded", name: "Rounded", class: "rounded-lg" },
    { id: "pill", name: "Pill", class: "rounded-full" },
    { id: "square", name: "Square", class: "rounded-none" }
  ];

  const colors = [
    "#000000", "#374151", "#dc2626", "#ea580c", 
    "#ca8a04", "#16a34a", "#0891b2", "#4f46e5",
    "#9333ea", "#c2410c", "#be123c", "#7c3aed"
  ];

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-3xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Appearance</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Customize how your profile looks to visitors
        </p>
      </div>

      {/* Profile Image */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="h-5 w-5 mr-2" />
            Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Image className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-3">
                Upload a profile picture to personalize your page
              </p>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Upload Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Theme */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                  selectedTheme === theme.id 
                    ? "border-primary" 
                    : "border-muted hover:border-muted-foreground"
                }`}
              >
                <div className={`w-full h-12 sm:h-16 ${theme.preview} rounded mb-2`}></div>
                <p className="text-xs sm:text-sm font-medium">{theme.name}</p>
              </button>
            ))}
          </div>
          
          {selectedTheme === "solid" && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Choose Color</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Button Style */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Circle className="h-5 w-5 mr-2" />
            Button Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {buttonStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedButtonStyle(style.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                  selectedButtonStyle === style.id 
                    ? "border-primary" 
                    : "border-muted hover:border-muted-foreground"
                }`}
              >
                <div className={`w-full h-8 sm:h-10 bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm ${style.class} mb-2`}>
                  Sample Button
                </div>
                <p className="text-xs sm:text-sm font-medium">{style.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Type className="h-5 w-5 mr-2" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Font Style</Label>
              <select className="w-full p-2 border border-border rounded-lg bg-background">
                <option>Default</option>
                <option>Modern</option>
                <option>Elegant</option>
                <option>Playful</option>
              </select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Text Color</Label>
              <div className="flex gap-3">
                <button className="w-8 h-8 bg-black rounded-full border-2 border-white shadow-sm" />
                <button className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white shadow-sm" />
                <button className="w-8 h-8 bg-white rounded-full border-2 border-gray-300 shadow-sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex gap-3">
        <Button className="flex-1">
          Save Changes
        </Button>
        <Button variant="outline">
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSection;