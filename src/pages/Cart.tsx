
import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingCart, Trash, ArrowLeft, CreditCard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

const Cart = () => {
  const { user } = useAuth();
  const { cart, isLoading, removeFromCart, clearCart, checkout, subtotal } = useCart();

  // Redirect to signin if not logged in
  if (!user) {
    return <Navigate to="/signin" state={{ from: '/cart' }} />;
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-3">
          <Link to="/explore">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
        </div>
      ) : cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 max-w-md mx-auto"
        >
          <div className="rounded-full bg-muted p-6 inline-block">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mt-6">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Looks like you haven't added any courses to your cart yet.
          </p>
          <Button asChild>
            <Link to="/explore">Browse Courses</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm border">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">{cart.length} {cart.length === 1 ? 'Course' : 'Courses'} in Cart</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground text-xs flex items-center"
                  onClick={clearCart}
                >
                  <Trash className="h-3 w-3 mr-1" />
                  Clear cart
                </Button>
              </div>
              
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b last:border-0"
                  >
                    <div className="p-4 flex gap-4">
                      <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden">
                        <img 
                          src={item.course.thumbnail_url} 
                          alt={item.course.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.course.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => removeFromCart(item.course_id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {item.course.level?.charAt(0).toUpperCase() + item.course.level?.slice(1)}
                          {item.course.duration && ` • ${item.course.duration}`}
                        </p>
                        
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                              className="h-7 text-xs"
                            >
                              <Link to={`/course/${item.course_id}`}>View details</Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 text-xs text-destructive"
                              onClick={() => removeFromCart(item.course_id)}
                            >
                              Remove
                            </Button>
                          </div>
                          <span className="font-medium">{formatCurrency(item.course.price || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm border p-5 sticky top-24">
              <h2 className="font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-medium mb-6">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={checkout}
                disabled={isLoading}
              >
                <CreditCard className="h-4 w-4" />
                Checkout
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By completing your purchase you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
