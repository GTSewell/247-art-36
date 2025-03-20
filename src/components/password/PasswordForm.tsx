
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { validateSitePassword, signInWithDemoAccount } from '@/utils/auth-utils';
import { supabase } from '@/integrations/supabase/client';

interface PasswordFormProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ setIsPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the user name field - more strict validation now
    if (!userName.trim()) {
      setNameError('Please enter your name');
      return;
    } else {
      setNameError('');
    }
    
    setIsLoading(true);
    
    try {
      const isCorrect = await validateSitePassword(password);
      
      if (isCorrect) {
        // Fetch recipient name from the database
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('recipient_name, usage_count')
          .eq('site_password', password.toLowerCase().trim())
          .single();
        
        if (settingsError) {
          console.error("Failed to fetch recipient data:", settingsError);
        } else {
          // Increment usage count manually
          const updatedCount = (settingsData?.usage_count || 0) + 1;
          
          await supabase
            .from('site_settings')
            .update({ usage_count: updatedCount })
            .eq('site_password', password.toLowerCase().trim());
          
          // Log access with both the original recipient name and user-provided name
          try {
            // Use a more reliable approach instead of relying on request.headers
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const clientIp = ipData.ip || 'unknown';
            
            console.log("Logging password access with the following data:");
            console.log({
              site_password: password.toLowerCase().trim(),
              ip_address: clientIp,
              original_recipient_name: settingsData?.recipient_name || null,
              user_provided_name: userName.trim() || null
            });
            
            const { data: logData, error: logError } = await supabase
              .from('password_access_logs')
              .insert({ 
                site_password: password.toLowerCase().trim(),
                ip_address: clientIp, 
                original_recipient_name: settingsData?.recipient_name || null,
                user_provided_name: userName.trim() || null
              })
              .select();
            
            if (logError) {
              console.error("Error inserting log:", logError);
            } else {
              console.log("Password access logged successfully:", logData);
            }
          } catch (logError) {
            console.error("Error logging password access:", logError);
            
            // Fallback: Log without IP if the service fails
            const { data: fallbackLogData, error: fallbackLogError } = await supabase
              .from('password_access_logs')
              .insert({ 
                site_password: password.toLowerCase().trim(),
                ip_address: 'client-side-fallback', 
                original_recipient_name: settingsData?.recipient_name || null,
                user_provided_name: userName.trim() || null
              })
              .select();
              
            if (fallbackLogError) {
              console.error("Error with fallback logging:", fallbackLogError);
            } else {
              console.log("Fallback password access logged successfully:", fallbackLogData);
            }
          }
          
          // Personalized welcome message
          if (userName.trim()) {
            toast.success(`Welcome ${userName}!`);
          } else if (settingsData?.recipient_name) {
            toast.success(`Welcome ${settingsData.recipient_name}!`);
          } else {
            toast.success('Welcome to 247.art!');
          }
        }
        
        // Try to sign in with demo account automatically
        const signedIn = await signInWithDemoAccount();
        
        if (signedIn) {
          console.log("Demo account sign-in successful after password entry");
        } else {
          console.warn("Demo account sign-in failed after password entry");
        }
        
        setIsPasswordCorrect(true);
        localStorage.setItem("isPasswordCorrect", "true");
      } else {
        toast.error('Incorrect password');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Error checking password:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
            We use this to track who has access to the site
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
