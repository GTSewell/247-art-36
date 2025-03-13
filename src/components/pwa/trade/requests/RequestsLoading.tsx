
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const RequestsLoading: React.FC = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4 h-24"></CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RequestsLoading;
