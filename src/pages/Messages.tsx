
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import AuthRequiredState from "@/components/messages/AuthRequiredState";
import MessagesContent from "@/components/messages/MessagesContent";
import { useMessages } from "@/components/messages/hooks/useMessages";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/navigation/Navigation";

const Messages = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    activeTab,
    setActiveTab,
    messageFilter,
    setMessageFilter,
    sentMessages,
    sentLoading,
    receivedMessages,
    receivedLoading,
    sentPagination,
    receivedPagination,
    handleReply,
    handleDelete,
    handlePageChange
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
          messageFilter={messageFilter}
          setMessageFilter={setMessageFilter}
          sentMessages={sentMessages}
          sentLoading={sentLoading}
          receivedMessages={receivedMessages}
          receivedLoading={receivedLoading}
          sentPagination={sentPagination}
          receivedPagination={receivedPagination}
          handleReply={handleReply}
          handleDelete={handleDelete}
          handlePageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default Messages;
