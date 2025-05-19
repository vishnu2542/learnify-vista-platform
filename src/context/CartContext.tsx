
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

type CartItem = {
  id: string;
  user_id: string;
  course_id: string;
  course: {
    id: string;
    title: string;
    price: number;
    thumbnail_url: string;
    level?: string;
  };
  created_at: string;
};

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  totalItems: number;
  subtotal: number;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = cart.length;
  const subtotal = cart.reduce((total, item) => total + (item.course.price || 0), 0);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, course:courses(*)')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setCart(data || []);
    } catch (error: any) {
      console.error('Error fetching cart items:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load cart items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (courseId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Check if already in cart
      const exists = cart.some(item => item.course_id === courseId);
      if (exists) {
        toast({
          title: 'Already in cart',
          description: 'This course is already in your cart',
        });
        return;
      }

      // Add to cart
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        course_id: courseId
      });

      if (error) throw error;

      // Refresh cart
      await fetchCartItems();
      
      toast({
        title: 'Added to cart',
        description: 'Course has been added to your cart',
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to add course to cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (courseId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      // Update local cart state
      setCart(cart.filter(item => item.course_id !== courseId));
      
      toast({
        title: 'Removed from cart',
        description: 'Course has been removed from your cart',
      });
    } catch (error: any) {
      console.error('Error removing from cart:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to remove course from cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCart([]);
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: subtotal,
          status: 'completed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        course_id: item.course_id,
        price: item.course.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast({
        title: 'Order successful!',
        description: 'Your courses are now available in your dashboard',
      });
    } catch (error: any) {
      console.error('Checkout error:', error.message);
      toast({
        title: 'Checkout failed',
        description: 'There was a problem processing your order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cart,
    isLoading,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    clearCart,
    checkout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
