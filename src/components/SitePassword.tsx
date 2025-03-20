
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { validateSitePassword, signInWithDemoAccount } from '@/utils/auth-utils';
import { supabase } from '@/integrations/supabase/client';

interface SitePasswordProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const SitePassword: React.FC<SitePasswordProps> = ({ setIsPasswordCorrect }) => {
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
        const { data, error } = await supabase
          .from('site_settings')
          .select('recipient_name, usage_count')
          .eq('site_password', password)
          .single();
        
        if (error) {
          console.error("Failed to fetch recipient data:", error);
        } else {
          // Increment usage count manually
          const updatedCount = (data?.usage_count || 0) + 1;
          
          await supabase
            .from('site_settings')
            .update({ usage_count: updatedCount })
            .eq('site_password', password);
          
          // Log access with both the original recipient name and user-provided name
          try {
            // Use a more reliable approach instead of relying on request.headers
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const clientIp = ipData.ip || 'unknown';
            
            console.log("Logging password access with the following data:");
            console.log({
              site_password: password,
              ip_address: clientIp,
              original_recipient_name: data?.recipient_name || null,
              user_provided_name: userName.trim() || null
            });
            
            const { data: logData, error: logError } = await supabase
              .from('password_access_logs')
              .insert({ 
                site_password: password,
                ip_address: clientIp, 
                original_recipient_name: data?.recipient_name || null,
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
                site_password: password,
                ip_address: 'client-side-fallback', 
                original_recipient_name: data?.recipient_name || null,
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
          } else if (data?.recipient_name) {
            toast.success(`Welcome ${data.recipient_name}!`);
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
    <div className="h-screen flex flex-col items-center justify-center bg-zap-yellow relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-80" 
        style={{ 
          backgroundImage: "url('/lovable-uploads/6b4832cd-f117-41c5-a008-1ba2948714bc.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/e3632eac-612c-482e-aad1-8d4fd3b2947c.png" 
            alt="247.art" 
            className="h-12"
          />
        </div>
        
        <p className="mb-6 text-center text-gray-600">
          This site is password protected. Please enter the password to continue.
        </p>
        
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
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-center text-[#ea384c] font-bold italic">
            Note: This site is purely in prototype mode solely for reference purposes only.
          </p>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-center text-gray-700 font-medium">
              After entering the password, you'll be automatically logged in to our artist demo account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
