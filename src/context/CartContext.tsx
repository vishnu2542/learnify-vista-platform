
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { CartItem, Course } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  totalItems: number;
  subtotal: number;
  addToCart: (course: Course) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (courseId: string) => boolean;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Get cart items with course details
      const { data: cartItems, error } = await supabase
        .from('shopping_cart')
        .select(`
          id,
          user_id,
          course_id,
          added_at,
          courses:course_id(
            id,
            title,
            description,
            thumbnail_url,
            instructor_id,
            price,
            level,
            duration
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart items');
        return;
      }

      // Transform the data to match our CartItem type
      const transformedItems: CartItem[] = cartItems.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        course_id: item.course_id,
        course: {
          id: item.courses.id,
          title: item.courses.title,
          description: item.courses.description,
          thumbnail_url: item.courses.thumbnail_url,
          instructor_id: item.courses.instructor_id,
          instructor_name: '', // We'll need to fetch this separately if needed
          price: item.courses.price,
          level: item.courses.level,
          duration: item.courses.duration,
          created_at: '', // These fields are not critical for cart display
          updated_at: '',
        },
        added_at: item.added_at,
      }));

      setCart(transformedItems);
    } catch (error) {
      console.error('Unexpected error fetching cart:', error);
      toast.error('Something went wrong while loading your cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add a course to the cart
  const addToCart = async (course: Course) => {
    if (!user) {
      toast.error('Please sign in to add courses to cart');
      return;
    }

    if (isInCart(course.id)) {
      toast.info('This course is already in your cart');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('shopping_cart').insert({
        user_id: user.id,
        course_id: course.id,
      });

      if (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add course to cart');
        return;
      }

      // Create a new cart item manually (to avoid refetching the whole cart)
      const newItem: CartItem = {
        id: `temp-${Date.now()}`, // This will be replaced on next fetch
        user_id: user.id,
        course_id: course.id,
        course: course,
        added_at: new Date().toISOString(),
      };

      setCart((prevCart) => [...prevCart, newItem]);
      toast.success(`${course.title} added to cart`);
    } catch (error) {
      console.error('Unexpected error adding to cart:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a course from the cart
  const removeFromCart = async (courseId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error removing from cart:', error);
        toast.error('Failed to remove course from cart');
        return;
      }

      setCart((prevCart) => prevCart.filter((item) => item.course_id !== courseId));
      toast.success('Course removed from cart');
    } catch (error) {
      console.error('Unexpected error removing from cart:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    if (!user || cart.length === 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
        return;
      }

      setCart([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Unexpected error clearing cart:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a course is already in the cart
  const isInCart = (courseId: string) => {
    return cart.some((item) => item.course_id === courseId);
  };

  // Calculate total items in cart
  const totalItems = cart.length;

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + (item.course.price || 0);
  }, 0);

  // Process checkout (create order)
  const checkout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      // Create a new order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: subtotal,
          status: 'completed', // Simplified for demo
          payment_method: 'credit_card', // Simplified for demo
        })
        .select('id')
        .single();

      if (orderError || !orderData) {
        console.error('Error creating order:', orderError);
        toast.error('Failed to process checkout');
        return;
      }

      // Create order items for each course in cart
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        course_id: item.course_id,
        price: item.course.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast.error('Failed to complete your order');
        return;
      }

      // Create enrollments for the purchased courses
      const enrollments = cart.map((item) => ({
        course_id: item.course_id,
        user_id: user.id,
      }));

      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert(enrollments);

      if (enrollmentError) {
        console.error('Error creating enrollments:', enrollmentError);
        // Continue anyway since the order was successful
      }

      // Clear cart after successful checkout
      await clearCart();

      toast.success('Thank you for your purchase! You can now access your courses.');
    } catch (error) {
      console.error('Unexpected error during checkout:', error);
      toast.error('Something went wrong during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
