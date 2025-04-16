"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTierDiscount } from "../(group-products)/_components/(filterside)/tier-util";
import { Badge } from "@/components/ui/badge"; // Optional: Use Badge component

// Types (ensure CartItem type matches your actual data structure)
interface CartItem {
  id: string;
  quantity: number;
  variation: {
    id: string;
    name: string;
    price: number; // This should be the price *before* VAT
    imageUrl: string;
    product: {
      id: string;
      productName: string;
    };
  };
}

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number; // This should be the original total *before* discounts and *before* VAT
}

// --- Define South African VAT Rate ---
const VAT_RATE = 0.15; // 15%

export default function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  const { hasDiscount, discountPercentage, userTier, calculatePrice } =
    useTierDiscount();

  // Calculate discounted total (this is the price *before* VAT)
  const discountedTotalPriceBeforeVAT = hasDiscount
    ? totalPrice * (1 - discountPercentage)
    : totalPrice;

  // --- Calculate VAT Amount ---
  const vatAmount = discountedTotalPriceBeforeVAT * VAT_RATE;

  // --- Calculate Final Total Including VAT ---
  const finalTotalWithVAT = discountedTotalPriceBeforeVAT + vatAmount;

  const tierName = userTier.charAt(0) + userTier.slice(1).toLowerCase();

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6 border">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>

        {items.length === 0 ? (
          // ... (empty cart message remains the same)
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/products">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Membership Tier Badge */}
            {hasDiscount && (
              <div className="mb-4">
                <Badge variant="destructive" className="text-sm font-medium">
                  {tierName} Tier Discount: {Math.round(discountPercentage * 100)}% OFF
                </Badge>
              </div>
            )}

            <div className="divide-y max-h-[400px] overflow-y-auto pr-2 mb-4">
              {items.map((item) => {
                const originalItemPrice = item.variation.price; // Price before VAT & discount
                // Apply discount calculation directly here for display
                const displayItemPriceAfterDiscount = calculatePrice(originalItemPrice);
                // Optional: calculate item subtotal after discount but before VAT
                // const itemSubtotalBeforeVAT = displayItemPriceAfterDiscount * item.quantity;

                return (
                  <div key={item.id} className="py-4 flex gap-4">
                    {/* ... (Image div remains the same) ... */}
                    <div className="w-16 h-16 bg-gray-100 rounded relative flex-shrink-0">
                      <Image
                        src={item.variation.imageUrl || "/placeholder.png"} // Add a fallback image
                        alt={item.variation.product.productName}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0"> {/* Added min-w-0 for flex truncation */}
                       <h3 className="font-medium text-sm truncate"> {/* Added truncate */}
                         {item.variation.product.productName}
                       </h3>
                       <p className="text-gray-600 text-xs">
                         {item.variation.name}
                       </p>

                      <div className="flex items-center mt-1 justify-between">
                        <span className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </span>

                        {/* Price display (Show price *before* VAT, potentially with discount) */}
                        <div className="text-right">
                          {hasDiscount && originalItemPrice !== displayItemPriceAfterDiscount ? (
                            <>
                              <span className="font-medium text-sm text-red-600">
                                R{displayItemPriceAfterDiscount.toFixed(2)}
                              </span>
                              <span className="text-gray-500 text-xs line-through ml-1">
                                R{originalItemPrice.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-sm">
                              R{originalItemPrice.toFixed(2)}
                            </span>
                          )}
                           {/* Optional note that price excludes VAT */}
                           {/* <span className="block text-xs text-gray-400 mt-0.5">(excl. VAT)</span> */}
                        </div>
                      </div>
                      {/* Optional: Show item subtotal before VAT */}
                      {/* <p className="text-xs text-gray-500 mt-1 text-right">
                           Subtotal (excl. VAT): R{itemSubtotalBeforeVAT.toFixed(2)}
                         </p> */}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- Updated Totals Section --- */}
            <div className="border-t mt-4 pt-4 space-y-2">
              {/* Original Subtotal (Before Discount & VAT) - Optional to show */}
              {hasDiscount && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Original Subtotal:</span>
                    <span className="line-through">
                      R{totalPrice.toFixed(2)}
                    </span>
                  </div>
              )}

              {/* Discount Amount (If Applicable) */}
              {hasDiscount && (
                <div className="flex items-center justify-between text-sm text-red-600">
                  <span>
                    {tierName} Discount ({Math.round(discountPercentage * 100)}%):
                  </span>
                  <span>
                    -R{(totalPrice - discountedTotalPriceBeforeVAT).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Subtotal After Discount (Before VAT) */}
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal (excl. VAT):</span>
                <span className="font-medium">R{discountedTotalPriceBeforeVAT.toFixed(2)}</span>
              </div>

              {/* VAT Amount */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>VAT ({Math.round(VAT_RATE * 100)}%):</span>
                <span>R{vatAmount.toFixed(2)}</span>
              </div>

              {/* Grand Total (Including VAT) */}
              <div className="flex items-center justify-between font-bold text-lg mt-2 border-t pt-2">
                <span>Grand Total:</span>
                <span>R{finalTotalWithVAT.toFixed(2)}</span>
              </div>
            </div>
            {/* --- End of Updated Totals Section --- */}
          </>
        )}
      </div>
    </div>
  );
}