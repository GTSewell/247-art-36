
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useShopifyCart } from '@/contexts/ShopifyCartContext';
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ShopifyCheckout = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal, checkout } = useShopifyCart();
  const { isPWA } = useAppMode();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  const totalItems = items.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    setCheckoutError(null);
    
    try {
      const result = await checkout();
      
      if (result.success && result.url) {
        // Redirect to Shopify checkout
        window.location.href = result.url;
      } else {
        setCheckoutError(result.error || 'An error occurred during checkout');
      }
    } catch (error) {
      setCheckoutError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <div className="container mx-auto px-4 pt-28 pb-24">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 text-white hover:text-white/80"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Cart</h1>
          {items.length > 0 && (
            <Button 
              variant="outline"
              onClick={clearCart}
              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {checkoutError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{checkoutError}</AlertDescription>
          </Alert>
        )}

        {items.length === 0 ? (
          <div className="bg-background rounded-lg p-6 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-4">Your cart is empty</p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-4 bg-background rounded-lg p-4"
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => e.currentTarget.src = '/placeholder.svg'}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-input rounded-l-md"
                      >
                        -
                      </button>
                      <div className="w-10 h-8 flex items-center justify-center border-y border-input">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-input rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 mt-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items ({totalItems})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-zap-yellow hover:bg-yellow-500 text-black"
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopifyCheckout;
