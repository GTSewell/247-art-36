
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Palette, Store, User, UserCircle } from "lucide-react";
import { toast } from "sonner";

const PWAHome = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  const handleLogin = () => {
    navigate('/auth');
  };
  
  return (
    <div className="min-h-screen bg-zap-yellow">
      <PWANavigation />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png" 
            alt="247.ART Logo" 
            className="h-24 w-auto"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-8">Welcome to 247.ART</h1>
        
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          <Button 
            variant="outline" 
            className="h-32 bg-white flex flex-col gap-2 p-4 items-center justify-center"
            onClick={() => navigateTo('/artists')}
          >
            <Palette size={32} />
            <span>Artists</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-32 bg-white flex flex-col gap-2 p-4 items-center justify-center"
            onClick={() => navigateTo('/store')}
          >
            <Store size={32} />
            <span>Store</span>
          </Button>
          
          {user ? (
            <>
              <Button 
                variant="outline" 
                className="h-32 bg-white flex flex-col gap-2 p-4 items-center justify-center"
                onClick={() => navigateTo('/dashboard/artist')}
              >
                <User size={32} />
                <span>Artist Dashboard</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-32 bg-white flex flex-col gap-2 p-4 items-center justify-center"
                onClick={() => navigateTo('/dashboard/collector')}
              >
                <UserCircle size={32} />
                <span>Collector Dashboard</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              className="h-32 col-span-2 bg-zap-red hover:bg-zap-blue flex flex-col gap-2 p-4 items-center justify-center"
              onClick={handleLogin}
            >
              <UserCircle size={32} />
              <span>Sign In / Sign Up</span>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default PWAHome;
