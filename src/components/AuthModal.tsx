
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import SocialLogin from "@/components/auth/SocialLogin";
import DemoAccountInfo from "@/components/auth/DemoAccountInfo";

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
          <p className="text-gray-600">Log in or create an account</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Log In</TabsTrigger>
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
