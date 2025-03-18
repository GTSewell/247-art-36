
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useAppMode } from "@/contexts/AppModeContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { isPWA } = useAppMode();
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <div className="container mx-auto px-4 pt-28 pb-24"> {/* Increased top padding to avoid navbar overlap */}
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

        {items.length === 0 ? (
          <div className="bg-background rounded-lg p-6 text-center">
            <p className="text-lg mb-4">Your cart is empty</p>
            <Link to="/store">
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
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.artist && <p className="text-sm text-muted-foreground">By {item.artist.name}</p>}
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
                <Button 
                  className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
