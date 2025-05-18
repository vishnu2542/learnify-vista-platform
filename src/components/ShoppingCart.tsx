
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, CreditCard, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

const ShoppingCart = () => {
  const { user } = useAuth();
  const { cart, isLoading, totalItems, subtotal, removeFromCart, clearCart, checkout } = useCart();

  if (!user) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow py-8">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading your cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-12">
            <div className="rounded-full bg-muted p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
              Looks like you haven't added any courses to your cart yet.
            </p>
            <SheetClose asChild>
              <Button className="mt-6">
                Browse Courses
              </Button>
            </SheetClose>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="flex-grow overflow-y-auto">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 py-4 border-b"
                  >
                    <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.course.thumbnail_url}
                        alt={item.course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium line-clamp-1">{item.course.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.course.level?.charAt(0).toUpperCase() + item.course.level?.slice(1)}
                      </p>
                      <p className="font-medium text-sm mt-1">
                        {formatCurrency(item.course.price || 0)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => removeFromCart(item.course_id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex justify-between py-2">
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
              
              <Separator className="my-3" />
              
              <div className="space-y-1.5 py-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <SheetFooter className="pt-4">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={checkout}
                  disabled={isLoading || cart.length === 0}
                >
                  <CreditCard className="h-4 w-4" />
                  Checkout ({formatCurrency(subtotal)})
                </Button>
              </SheetFooter>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
