
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignInFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignInForm = ({ loading, setLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("demo@247.art");
  const [password, setPassword] = useState("1234");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      setLoading(true);
      console.log("Attempting to sign in with:", email, password);
      
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        if (error.message === "Invalid login credentials") {
          setErrorMessage("The email or password you entered is incorrect. Please try again.");
        } else {
          setErrorMessage(error.message);
        }
        toast.error(error.message);
        return;
      }
      
      console.log("Sign in successful", data);
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Sign in error detail:", error);
      setErrorMessage(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      <div>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <p className="text-xs text-gray-500 mt-1">Demo: demo@247.art</p>
      </div>
      <div>
        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <p className="text-xs text-gray-500 mt-1">Demo: 1234</p>
      </div>
      {errorMessage && (
        <div className="text-sm text-red-500 font-medium">
          {errorMessage}
        </div>
      )}
      <Button type="submit" className="w-full bg-zap-red hover:bg-zap-blue" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SignInForm;
