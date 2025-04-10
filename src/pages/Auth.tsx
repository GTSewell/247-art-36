
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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pattern247Background } from "@/components/password/Pattern247Background";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { isPWA } = useAppMode();
  const isMobile = useIsMobile();
  
  // Determine if we should use mobile-friendly UI
  const useMobileUI = isPWA || isMobile;

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
        // Redirect to home page or account page based on device type
        if (isPWA) {
          navigate("/account");
        } else {
          navigate("/");
        }
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Redirect to home page or account page based on device type
        if (isPWA) {
          navigate("/account");
        } else {
          navigate("/");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, isPWA]);

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-zap-yellow p-4 ${useMobileUI ? 'pt-16' : ''} relative`}>
      {/* Background layers */}
      <div className="absolute inset-0 bg-zap-yellow z-0"></div>
      <Pattern247Background />
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `url('/lovable-uploads/5275fee6-9936-449c-bb71-730600ae1475.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'normal',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />
      
      {isPWA && <PWANavigation />}
      
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl shadow-lg relative z-20">
        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-4 left-4" 
            onClick={handleReturn}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Return
          </Button>
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
