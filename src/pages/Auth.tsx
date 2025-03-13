
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAppMode } from "@/contexts/AppModeContext";
import PWANavigation from "@/components/pwa/PWANavigation";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import SocialLogin from "@/components/auth/SocialLogin";
import DemoAccountInfo from "@/components/auth/DemoAccountInfo";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { isPWA } = useAppMode();

  useEffect(() => {
    // Parse the query parameter to set the initial tab
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setActiveTab("signup");
    }
  }, [location.search]);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/account");
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/account");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-zap-yellow p-4 ${isPWA ? 'pt-16' : ''}`}>
      {isPWA && <PWANavigation />}
      
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <img alt="ZAP!" src="/lovable-uploads/a6580086-e06f-4c81-a4f2-f866f6726959.png" className="h-12 mx-auto mb-4 rounded-none" />
          <h2 className="text-2xl font-bold">Welcome!</h2>
          <p className="text-gray-600">Sign in or create an account</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
      </div>
    </div>
  );
};

export default Auth;
