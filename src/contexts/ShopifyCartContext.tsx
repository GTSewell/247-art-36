
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { ShopifyProduct } from '@/hooks/useShopifyProducts';

export interface ShopifyCartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  quantity: number;
  variant_id?: string;
  artist_id?: number;
}

interface ShopifyCartContextType {
  items: ShopifyCartItem[];
  addItem: (item: Omit<ShopifyCartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  checkout: () => Promise<{ success: boolean; url?: string; error?: string }>;
}

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(undefined);

export const ShopifyCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShopifyCartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopify-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        logger.error('Failed to parse Shopify cart from localStorage:', error);
      }
    }
  }, []);

  // Update derived state and save to localStorage when items change
  useEffect(() => {
    // Calculate derived values
    const count = items.reduce((count, item) => count + item.quantity, 0);
    setItemCount(count);
    
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
    
    // Save to localStorage
    localStorage.setItem('shopify-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<ShopifyCartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        toast.success("Item quantity updated in cart");
        return updatedItems;
      } else {
        // Add new item with quantity 1
        toast.success("Item added to cart");
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const checkout = async () => {
    try {
      if (items.length === 0) {
        return { success: false, error: 'Cart is empty' };
      }
      
      // Format cart items for checkout
      const checkoutItems = items.map(item => ({
        id: item.variant_id || item.id,
        quantity: item.quantity
      }));
      
      // Call the Shopify checkout endpoint
      const { data, error } = await supabase.functions.invoke('shopify', {
        body: { endpoint: 'checkout', items: checkoutItems }
      });
      
      if (error) {
        logger.error('Error creating checkout:', error);
        return { success: false, error: 'Failed to create checkout' };
      }
      
      // Get the checkout URL from the response
      const checkoutUrl = data.data.checkoutCreate.checkout.webUrl;
      
      if (data.data.checkoutCreate.checkoutUserErrors.length > 0) {
        const errorMessage = data.data.checkoutCreate.checkoutUserErrors[0].message;
        return { success: false, error: errorMessage };
      }
      
      // Clear the cart after successful checkout
      clearCart();
      
      return { success: true, url: checkoutUrl };
    } catch (error) {
      logger.error('Error during checkout:', error);
      return { success: false, error: 'An error occurred during checkout' };
    }
  };

  return (
    <ShopifyCartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      itemCount,
      subtotal,
      checkout
    }}>
      {children}
    </ShopifyCartContext.Provider>
  );
};

export const useShopifyCart = () => {
  const context = useContext(ShopifyCartContext);
  if (context === undefined) {
    throw new Error('useShopifyCart must be used within a ShopifyCartProvider');
  }
  return context;
};
