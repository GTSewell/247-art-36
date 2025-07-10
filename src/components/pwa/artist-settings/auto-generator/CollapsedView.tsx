import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface CollapsedViewProps {
  onExpand: () => void;
}

const CollapsedView: React.FC<CollapsedViewProps> = ({ onExpand }) => {
  return (
    <Card className="mb-6 border-dashed">
      <CardContent className="pt-6">
        <div className="text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Auto-Generate Profile</h3>
          <p className="text-muted-foreground mb-4">
            Save time by letting AI create your profile from your social media and website links
          </p>
          <Button onClick={onExpand} variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollapsedView;