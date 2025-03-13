
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/utils/logger";
import { validateSitePassword, signInWithDemoAccount } from "@/utils/auth-utils";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lowerPassword = password.toLowerCase().trim();
      logger.info('Attempting login with password:', lowerPassword);

      const isValid = await validateSitePassword(lowerPassword);
      logger.info('Password validation result:', isValid);

      if (isValid) {
        logger.info('Valid password found, proceeding with authentication');
        
        // Try to sign in with demo account
        const signedIn = await signInWithDemoAccount();
        
        if (signedIn) {
          logger.info('Auto-signed in with demo account');
        } else {
          logger.warn('Could not auto-sign in with demo account');
        }
        
        // If password matches, authenticate user
        onAuthenticated();
      } else {
        logger.info('Invalid password attempt');
        toast({
          variant: "destructive",
          title: "Incorrect password",
          description: "Please try again",
        });
      }
    } catch (error) {
      logger.error('Password check error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Base yellow background */}
      <div className="absolute inset-0 bg-zap-yellow z-0" />
      
      {/* Halftone overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `url('/lovable-uploads/e16074dd-11b0-4f2e-bcc8-06b5fa6c282a.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'normal',
          pointerEvents: 'none',
        }}
      />
      
      {/* Content */}
      <div className="max-w-md w-full p-6 space-y-8 relative z-20">
        <div className="text-center">
          <img 
            src="/lovable-uploads/a6580086-e06f-4c81-a4f2-f866f6726959.png" 
            alt="247.art" 
            className="w-48 mx-auto mb-4"
          />
          <p className="text-gray-600">Enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full bg-zap-red hover:bg-zap-blue active:bg-zap-blue transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Enter"}
          </Button>
          <p className="text-xs text-center text-gray-600">Try password: zap2024</p>
        </form>

        {/* Site info in white box with red text */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4 text-[#ea384c]">
            <h3 className="font-bold text-center mb-6">READ ME</h3>
            <p className="font-bold">
              This site is currently under development.
            </p>
            <p className="font-bold">
              We are seeking input from professional artists, designers, & businesses within the local arts industry to get the best possible outcome for us all.
            </p>
            <p className="font-bold">
              Please consider anything and everything you see and read as confidential and purely placeholder information as we beta test, and refine our offering.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">Demo Account</h3>
            <p className="text-sm text-gray-600">After entering the site password, you'll be automatically logged in as:</p>
            <p className="text-sm text-gray-600 font-semibold mt-2">Email: demo@247.art</p>
            <p className="text-sm text-gray-600 font-semibold">Password: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
