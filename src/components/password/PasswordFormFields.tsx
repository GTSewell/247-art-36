
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface PasswordFormFieldsProps {
  password: string;
  setPassword: (password: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  nameError: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordFormFields: React.FC<PasswordFormFieldsProps> = ({
  password,
  setPassword,
  userName,
  setUserName,
  nameError,
  isLoading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={`w-full ${nameError ? 'border-red-500' : ''}`}
          required
        />
        {nameError ? (
          <p className="text-xs text-red-500 mt-1">{nameError}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-zap-red text-white hover:bg-zap-red/80"
        disabled={isLoading}
      >
        {isLoading ? 'Checking...' : 'Enter'}
      </Button>
    </form>
  );
};
