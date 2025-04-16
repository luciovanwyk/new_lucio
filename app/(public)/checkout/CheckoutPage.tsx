"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react"; // Added Cart icon
import { Button } from "@/components/ui/button";

import OrderSummary from "./OrderSummary";
import CheckoutForm from "./CheckoutForm";

// Custom hooks & Store
import { useCart } from "../productId/cart/_store/use-cart-store-hooks";
import { useCartStore } from "../productId/cart/_store/cart-store";
import { useUser } from "@/app/hook/use-user";

// Types and validations
import { OrderInput } from "./order-types";
import { orderValidationSchema } from "./order-validations";

// Server actions
import { placeOrder } from "./checkout-order";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state



export default function Checkout() {
  const router = useRouter();
  const { items, totalPrice, isLoading: isCartLoading } = useCart(); // Use cart loading state
  const { user, isLoading: isUserLoading } = useUser(); // Get user data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false); // Hydration fix

  useEffect(() => {
    setIsClient(true); // Ensures code runs only after mounting on client
  }, []);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<OrderInput>({
    resolver: zodResolver(orderValidationSchema),
    defaultValues: {
      // Pre-fill some values if user is loaded
      captivityBranch: "",
      methodOfCollection: "",
      salesRep: "",
      referenceNumber: "",
      firstName: "",
      lastName: "",
      companyName: "",
      countryRegion: "South Africa", // Sensible default
      streetAddress: "",
      apartmentSuite: "",
      townCity: "",
      province: "",
      postcode: "",
      phone: "",
      email: "",
      paymentMethod: "", // --- ADDED: Default payment method ---
      orderNotes: "",
      agreeTerms: false,
      receiveEmailReviews: false,
    },
  });

   // Effect to pre-fill form with user data once loaded
   useEffect(() => {
    if (user && !isUserLoading) {
        form.reset({
            ...form.getValues(), // Keep existing values if any were manually entered
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "", // Assuming 'phone' exists on user model
            companyName: user.companyName || "", // Assuming 'companyName' exists
            // You could potentially pre-fill address fields if stored on the user profile
            // streetAddress: user.address?.street || "",
            // townCity: user.address?.city || "",
            // province: user.address?.province || "",
            // postcode: user.address?.postcode || "",
            // countryRegion: user.address?.country || "South Africa",
        });
    }
   }, [user, isUserLoading, form]);


  // Handle form submission
  const onSubmit = async (data: OrderInput) => {
    if (!isClient) return; // Prevent submission during SSR/hydration mismatch

    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Placing your order..."); // Use loading toast

    try {
      const result = await placeOrder(data);
      toast.dismiss(); // Dismiss loading toast

      if (result.success) {
        toast.success("Order placed successfully!");

        // Clear cart state
        const cartStore = useCartStore.getState();
        cartStore.setItems([]); // Immediate UI update
        cartStore.setItemCount(0);
        cartStore.setLastUpdated(Date.now());
        setTimeout(() => { cartStore.refreshCart(false); }, 300); // Background sync

        // Redirect to order confirmation
        router.push(result.orderId ? `/orders/confirmation/${result.orderId}` : "/orders");

      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            form.setError(field as keyof OrderInput, { type: "manual", message });
          });
          toast.error("Please correct the errors in the form.");
        } else {
          toast.error(`Order failed: ${result.message}`);
        }
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error placing order:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state for the whole page until cart and user data are ready
  if (!isClient || isCartLoading || isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-72 w-full sticky top-6" />
          </div>
        </div>
      </div>
    );
  }

  // Render when ready
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl"> {/* Added max-width */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
        <Link href="/cart" passHref legacyBehavior>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </Button>
        </Link>
      </div>

      {items.length === 0 && !isCartLoading ? (
           <div className="text-center py-16 bg-gray-50 rounded-lg border">
             <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
             <h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
             <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
             <Link href="/products" passHref legacyBehavior>
                 <Button>Browse Products</Button>
             </Link>
           </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"> {/* Added items-start */}
          {/* Checkout Form Section */}
          <CheckoutForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            hasItems={items.length > 0}
          />

          {/* Order Summary Section */}
          <OrderSummary items={items} totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}