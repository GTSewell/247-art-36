
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface SitePasswordProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const SitePassword: React.FC<SitePasswordProps> = ({ setIsPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get all site passwords
      const { data, error } = await supabase
        .from('site_settings')
        .select('site_password');
      
      if (error) throw error;
      
      // Check if entered password matches any of the passwords in the database
      const isCorrect = data && data.some(row => password === row.site_password);
      
      if (isCorrect) {
        // Set password correct first
        setIsPasswordCorrect(true);
        localStorage.setItem("isPasswordCorrect", "true");
        
        // Password is correct, now sign in as demo user
        const success = await signInAsDemoUser();
        
        if (success) {
          toast.success('Welcome to 247.art!');
        } else {
          // Still show the site even if auto-login fails
          toast.error('Auto-login failed, but you can still browse the site');
          console.error('Failed to auto-login as demo user');
        }
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
  
  const signInAsDemoUser = async (): Promise<boolean> => {
    try {
      console.log('Attempting to sign in as demo user...');
      
      // Check if we're already signed in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Already signed in as:', session.user.email);
        return true;
      }
      
      // Try to sign in with demo account credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@247.art',
        password: 'demo247account'
      });
      
      if (error) {
        console.log('Demo account not found, creating one...');
        // If demo account doesn't exist yet, create it
        return await createDemoAccountIfNeeded();
      } else {
        console.log('Successfully signed in as demo user:', data.user?.email);
        return true;
      }
    } catch (error) {
      console.error('Error signing in as demo user:', error);
      return false; // Continue anyway - we still want to show the site even if auto-login fails
    }
  };
  
  const createDemoAccountIfNeeded = async (): Promise<boolean> => {
    try {
      console.log('Creating demo account...');
      // First try to sign up the demo user
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'demo@247.art',
        password: 'demo247account',
        options: {
          data: {
            username: 'DemoUser'
          }
        }
      });
      
      if (signUpError) {
        console.error('Could not create demo account:', signUpError);
        return false;
      }
      
      console.log('Demo account created successfully, signing in...');
      // Try to sign in immediately after creating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@247.art',
        password: 'demo247account'
      });
      
      if (signInError) {
        console.error('Could not sign in to newly created demo account:', signInError);
        return false;
      } else {
        console.log('Successfully signed in to newly created demo account');
        return true;
      }
    } catch (error) {
      console.error('Error in createDemoAccountIfNeeded:', error);
      return false;
    }
  };
  
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zap-yellow relative overflow-hidden">
      {/* Blue halftone background overlay */}
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
          
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </Button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-center text-gray-500 italic">
            Note: This site is purely in prototype mode solely for reference purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};
