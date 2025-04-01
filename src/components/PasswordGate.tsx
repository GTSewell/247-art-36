
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/utils/logger";
import { PasswordGateForm } from "./password/PasswordGateForm";
import { PasswordGateDisclaimer } from "./password/PasswordGateDisclaimer";
import { PasswordGateBackground } from "./password/PasswordGateBackground";
import { PasswordGateLogo } from "./password/PasswordGateLogo";
import { useClientIp } from "@/hooks/use-client-ip";
import { validatePassword, signInWithDemo } from "@/services/password-gate-service";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { clientIp } = useClientIp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password
      const { isValid } = await validatePassword({
        password,
        recipientName,
        clientIp
      });

      if (isValid) {
        // Try to sign in with demo account
        await signInWithDemo();
        
        // Store authentication state
        localStorage.setItem("isPasswordCorrect", "true");
        
        // Complete authentication
        onAuthenticated();
      } else {
        toast({
          variant: "destructive",
          title: "Incorrect password",
          description: "Please try again",
        });
      }
    } catch (error) {
      logger.error('Password submission error:', { error });
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
      <PasswordGateBackground />
      
      {/* Content */}
      <div className="max-w-md w-full p-6 space-y-8 relative z-20">
        <PasswordGateLogo />
        
        <PasswordGateForm
          password={password}
          setPassword={setPassword}
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />

        <PasswordGateDisclaimer />
      </div>
    </div>
  );
};

export default PasswordGate;
