
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCheck, AlertTriangle } from "lucide-react";

// Types for messages
export type MessageStatus = 'pending' | 'replied' | 'expired';

// Message status badge component
const MessageStatusBadge = ({ status }: { status: MessageStatus }) => {
  switch (status) {
    case 'replied':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
          <CheckCheck className="h-3 w-3" />
          Replied
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-200 bg-red-50">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

export default MessageStatusBadge;
