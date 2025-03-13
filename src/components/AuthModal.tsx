
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import SocialLogin from "@/components/auth/SocialLogin";
import DemoAccountInfo from "@/components/auth/DemoAccountInfo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <img alt="247/ART" src="/lovable-uploads/d8aafbad-7e01-4cec-9fba-67f66a7e7952.png" className="h-8 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Welcome!</h2>
          <p className="text-gray-600">Sign in or create an account</p>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200 mt-2">
          <Info className="h-4 w-4 text-blue-500 mr-2" />
          <AlertDescription className="text-xs">
            <strong>Important:</strong> The demo account must be confirmed in Supabase before it will work.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm loading={loading} setLoading={setLoading} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm loading={loading} setLoading={setLoading} />
          </TabsContent>
        </Tabs>

        <SocialLogin loading={loading} setLoading={setLoading} />
        
        <DemoAccountInfo />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
