
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
