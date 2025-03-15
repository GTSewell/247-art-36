
import React from "react";
import Navigation from "@/components/navigation/Navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  artist?: { name: string } | null;
}

// For now, we'll use localStorage to manage the cart
const useCart = () => {
  const getCartItems = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  };

  const { data: cartItems = [], refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartItems,
    initialData: getCartItems,
  });

  const removeFromCart = (id: string) => {
    const cart = getCartItems();
    const newCart = cart.filter((item: CartItem) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));
    refetch();
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    const cart = getCartItems();
    const newCart = cart.map((item: CartItem) => 
      item.id === id ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    refetch();
  };

  const clearCart = () => {
    localStorage.setItem('cart', JSON.stringify([]));
    refetch();
    toast.success("Cart cleared");
  };

  return { cartItems, removeFromCart, updateQuantity, clearCart };
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const calculateTotal = () => {
    return cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="mb-4 text-gray-600">Your cart is empty</p>
            <Button 
              onClick={() => window.location.href = '/store'}
              className="bg-zap-yellow text-black"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className="flex border-b border-gray-200 py-4">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                  <img 
                    src={item.image_url || '/placeholder.svg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="ml-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    {item.artist && (
                      <p className="text-xs text-gray-500">By {item.artist.name}</p>
                    )}
                  </div>
                  <div className="flex-1 flex items-end justify-between">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-2 py-1 border-r"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border-l"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4 bg-zap-yellow text-black">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
