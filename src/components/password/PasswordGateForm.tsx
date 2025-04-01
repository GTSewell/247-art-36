
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/logger";

interface PasswordGateFormProps {
  password: string;
  setPassword: (value: string) => void;
  recipientName: string;
  setRecipientName: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordGateForm: React.FC<PasswordGateFormProps> = ({
  password,
  setPassword,
  recipientName,
  setRecipientName,
  isLoading,
  onSubmit
}) => {
  logger.info('Rendering PasswordGateForm component', { success: true });
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full"
        autoFocus
      />
      
      <Input
        type="text"
        placeholder="Optional: Your name or organization"
        value={recipientName}
        onChange={(e) => setRecipientName(e.target.value)}
        className="w-full"
      />
      <p className="text-xs text-gray-500 -mt-2">
        We use this to track who has access to the site
      </p>
      
      <Button 
        type="submit" 
        className="w-full bg-zap-red text-white hover:bg-zap-red/80 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Checking..." : "Enter"}
      </Button>
      <p className="text-xs text-center text-gray-600">Try password: zap2024</p>
    </form>
  );
};
