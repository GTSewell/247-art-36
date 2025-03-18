
import React from 'react';
import { MessageSquare } from "lucide-react";

interface EmptyMessageStateProps {
  type: 'sent' | 'received';
}

const EmptyMessageState = ({ type }: EmptyMessageStateProps) => {
  return (
    <div className="text-center py-10 border rounded-lg">
      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">No messages {type}</h3>
      <p className="text-muted-foreground">
        {type === 'sent' 
          ? "You haven't sent any messages to artists yet."
          : "You haven't received any messages from collectors yet."
        }
      </p>
    </div>
  );
};

export default EmptyMessageState;
