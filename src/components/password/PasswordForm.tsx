
import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { PasswordFormFields } from './PasswordFormFields';
import { useIpAddress } from '@/hooks/use-ip-address';
import { submitPassword } from '@/services/password-service';
import { toast } from 'sonner';

interface PasswordFormProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ setIsPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const { ipAddress } = useIpAddress();
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      setNameError('Please enter your name');
      return;
    } else {
      setNameError('');
    }
    
    setIsLoading(true);
    logger.info("Attempting to validate password:", { 
      password: password.substring(0, 2) + '***', 
      userName 
    });
    
    try {
      const result = await submitPassword({
        password,
        userName,
        ipAddress
      });
      
      if (result.isCorrect) {
        setIsPasswordCorrect(true);
      } else {
        toast.error('Incorrect password. Please try again.', {
          duration: 3000
        });
      }
    } catch (error: any) {
      logger.error('Error in password submission:', { error });
      toast.error(`Error: ${error.message || 'Failed to process your request'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PasswordFormFields
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      nameError={nameError}
      isLoading={isLoading}
      onSubmit={handlePasswordSubmit}
    />
  );
};
