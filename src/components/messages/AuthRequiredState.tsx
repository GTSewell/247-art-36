
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthRequiredState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <MessageSquare className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Sign in to access messages</h1>
      <p className="text-center mb-4">You need to be signed in to view your messages.</p>
      <Button onClick={() => navigate("/auth")}>Sign In</Button>
    </div>
  );
};

export default AuthRequiredState;
