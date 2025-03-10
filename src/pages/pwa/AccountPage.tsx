
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brush, Heart, Package, Settings, UserRound, LogIn } from "lucide-react";

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { isPWA } = useAppMode();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const renderAuthenticatedContent = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/lovable-uploads/5277ffb4-1849-4a10-9964-bb459163cabc.png" alt="Profile" />
          <AvatarFallback><UserRound className="h-8 w-8" /></AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">
            {user?.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-4 h-auto" 
            onClick={() => navigateTo('/dashboard/collector')}
          >
            <Heart className="h-5 w-5 mr-3 text-zap-red" />
            <div className="text-left">
              <div className="font-medium">Collector Dashboard</div>
              <div className="text-sm text-gray-500">View your favorites and purchases</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-4 h-auto" 
            onClick={() => navigateTo('/dashboard/artist')}
          >
            <Brush className="h-5 w-5 mr-3 text-zap-yellow" />
            <div className="text-left">
              <div className="font-medium">Artist Dashboard</div>
              <div className="text-sm text-gray-500">Manage your artworks and profile</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-4 h-auto" 
            onClick={() => navigateTo('/dashboard/collector?tab=purchases')}
          >
            <Package className="h-5 w-5 mr-3 text-zap-blue" />
            <div className="text-left">
              <div className="font-medium">Orders & Purchases</div>
              <div className="text-sm text-gray-500">View your order history</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-4 h-auto" 
            onClick={() => navigateTo('/dashboard/collector?tab=settings')}
          >
            <Settings className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Account Settings</div>
              <div className="text-sm text-gray-500">Manage your profile and preferences</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderUnauthenticatedContent = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <Avatar className="h-24 w-24">
        <AvatarFallback><UserRound className="h-12 w-12" /></AvatarFallback>
      </Avatar>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome!</h2>
        <p className="text-gray-500">Sign in to access your account</p>
      </div>
      
      <div className="flex flex-col w-full space-y-4 max-w-xs mt-4">
        <Button 
          onClick={() => navigateTo('/auth')}
          size="lg"
          className="bg-zap-red hover:bg-zap-blue"
        >
          <LogIn className="mr-2 h-5 w-5" /> Sign In
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigateTo('/auth?tab=signup')}
          size="lg"
        >
          Create an Account
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <main className="container mx-auto px-4 pt-16 pb-24">
        <h1 className="text-2xl font-bold mb-6">Account</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        ) : (
          <>
            {user ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
          </>
        )}
      </main>
    </div>
  );
};

export default AccountPage;
