
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyRequestStateProps {
  message: string;
}

const EmptyRequestState: React.FC<EmptyRequestStateProps> = ({ message }) => {
  return (
    <Card>
      <CardContent className="p-4 text-center text-muted-foreground">
        {message}
      </CardContent>
    </Card>
  );
};

export default EmptyRequestState;
