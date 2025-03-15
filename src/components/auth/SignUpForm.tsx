
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignUpFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignUpForm = ({ loading, setLoading }: SignUpFormProps) => {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("1234");
  const [username, setUsername] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 2) {
      toast.error("Username must be at least 2 characters long");
      return;
    }
    try {
      setLoading(true);
      const {
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      toast.success("Check your email for the confirmation link!");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignUp} className="space-y-4">
      <Input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
      />
      <Input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />
      <Input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        required 
        minLength={2} 
      />
      <Button type="submit" className="w-full bg-zap-yellow text-black hover:bg-zap-yellow/90" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        For demo, use email: demo@example.com and password: 1234
      </p>
    </form>
  );
};

export default SignUpForm;
