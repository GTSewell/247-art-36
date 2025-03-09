
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomLevel, zoomIn, zoomOut }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={zoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
      <Button variant="outline" size="sm" onClick={zoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
