import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { ShoppingCart, LogOut, Settings, User, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation/Navigation";
import CurrencySelector from "@/components/navigation/CurrencySelector";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccountPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { items, itemCount } = useCart();

  // Get display name from user data
  let displayName = 'User';
  
  if (user) {
    // Extract name from user metadata or use email if no name is available
    displayName = user.user_metadata?.full_name || '';
    
    // If name is empty or contains @ (likely an email), use first part of email instead
    if (!displayName || displayName.includes('@')) {
      displayName = user.email ? user.email.split('@')[0] : 'User';
    }
  }

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

  if (!isLoading && !user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container max-w-2xl mx-auto px-4 pt-20 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Separator />
            
            {/* Currency Preference */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Currency Preference</h3>
              <CurrencySelector className="w-full" />
            </div>
            
            <Separator />

            {/* Cart Summary */}
            {items.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-3">Items in your cart:</h3>
                  <ul className="space-y-2 mb-3">
                    {items.slice(0, 3).map((item) => (
                      <li key={item.id} className="text-sm flex items-center">
                        <div className="w-8 h-8 bg-muted rounded mr-3 overflow-hidden">
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
                      <li className="text-xs text-center text-muted-foreground">
                        +{items.length - 3} more items
                      </li>
                    )}
                  </ul>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/cart')}
                  >
                    View Full Cart
                  </Button>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-4 w-4 mr-3" />
                <span>Cart</span>
                {itemCount > 0 && (
                  <Badge className="ml-auto bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="h-4 w-4 mr-3" />
                <span>Messages</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/artist')}
              >
                <Settings className="h-4 w-4 mr-3" />
                Artist Dashboard
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/collector')}
              >
                <Settings className="h-4 w-4 mr-3" />
                Collector Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive" 
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AccountPage;