
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import AuthRequiredState from "@/components/messages/AuthRequiredState";
import MessageThread from "@/components/messages/MessageThread";
import { useMessageThread } from "@/components/messages/useMessageThread";

const MessageDetails = () => {
  const { messageId } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    message,
    replies,
    isLoading,
    handleReply,
    handleDelete
  } = useMessageThread(messageId, user?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredState />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <MessageThread 
          message={message}
          replies={replies}
          isLoading={isLoading}
          onReply={handleReply}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default MessageDetails;
