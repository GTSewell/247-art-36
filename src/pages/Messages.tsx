
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import AuthRequiredState from "@/components/messages/AuthRequiredState";
import MessagesContent from "@/components/messages/MessagesContent";
import { useMessages } from "@/components/messages/useMessages";

const Messages = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    activeTab,
    setActiveTab,
    sentMessages,
    sentLoading,
    receivedMessages,
    receivedLoading,
    handleReply
  } = useMessages(user?.id);

  // Display loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <AuthRequiredState />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Your Messages</h1>
        
        <MessagesContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sentMessages={sentMessages}
          sentLoading={sentLoading}
          receivedMessages={receivedMessages}
          receivedLoading={receivedLoading}
          handleReply={handleReply}
        />
      </main>
    </div>
  );
};

export default Messages;
