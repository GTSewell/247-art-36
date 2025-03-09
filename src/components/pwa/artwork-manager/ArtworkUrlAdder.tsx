
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ArtworkUrlAdderProps {
  onAddArtwork: (url: string) => void;
  isLoading: boolean;
}

const ArtworkUrlAdder: React.FC<ArtworkUrlAdderProps> = ({ onAddArtwork, isLoading }) => {
  const [newArtworkUrl, setNewArtworkUrl] = useState("");
  
  const handleAddClick = () => {
    if (newArtworkUrl.trim()) {
      onAddArtwork(newArtworkUrl);
      setNewArtworkUrl("");
    }
  };
  
  return (
    <div className="flex space-x-2">
      <div className="flex-grow">
        <Input
          value={newArtworkUrl}
          onChange={(e) => setNewArtworkUrl(e.target.value)}
          placeholder="Enter artwork URL"
        />
      </div>
      <Button onClick={handleAddClick} disabled={isLoading || !newArtworkUrl.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  );
};

export default ArtworkUrlAdder;
