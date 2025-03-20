
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
  const [recipientName, setRecipientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isCorrect = await validateSitePassword(password);
      
      if (isCorrect) {
        // If recipient name is provided, update it in the database
        if (recipientName.trim()) {
          try {
            const { error } = await supabase
              .from('site_settings')
              .update({ 
                recipient_name: recipientName.trim() 
              })
              .eq('site_password', password);
            
            if (error) {
              console.error("Failed to update recipient name:", error);
            } else {
              console.log("Recipient name updated successfully");
            }
          } catch (updateError) {
            console.error("Failed to update recipient name:", updateError);
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
        toast.success('Welcome to 247.art!');
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
              placeholder="Optional: Your name or organization"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              We use this to track who has access to the site
            </p>
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
