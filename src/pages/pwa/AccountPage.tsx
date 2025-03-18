
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { ShoppingCart, LogOut, Settings, User, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import PWANavigation from "@/components/pwa/PWANavigation"; // Import PWA navigation

const AccountPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { items, itemCount } = useCart();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  // If not authenticated, redirect to auth page
  if (!isLoading && !user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8 pt-20 pb-24"> {/* Added pb-24 for footer spacing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-4">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-500" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.user_metadata?.full_name || 'User'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Cart section */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="w-full justify-between mb-2" 
            onClick={() => navigate('/cart')}
          >
            <div className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span>Cart</span>
            </div>
            {itemCount > 0 && (
              <Badge className="bg-zap-red text-white">
                {itemCount}
              </Badge>
            )}
          </Button>
          
          {/* 247 Messages Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start mb-2" 
            onClick={() => navigate('/messages247')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>247 Messages</span>
          </Button>
          
          {items.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Items in your cart:</h3>
              <ul className="space-y-2">
                {items.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded mr-2 overflow-hidden">
                      <img 
                        src={item.image_url || '/placeholder.svg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 truncate">{item.name}</div>
                    <div className="text-xs font-medium">x{item.quantity}</div>
                  </li>
                ))}
                {items.length > 3 && (
                  <li className="text-xs text-center text-gray-500">
                    +{items.length - 3} more items
                  </li>
                )}
              </ul>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full mt-2 bg-zap-red hover:bg-zap-red/90"
                onClick={() => navigate('/cart')}
              >
                View Full Cart
              </Button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/dashboard/collector')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Collector Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/dashboard/artist')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Artist Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Add PWA Navigation */}
      <PWANavigation />
    </div>
  );
};

export default AccountPage;
