// src/actions/orders/place-order.ts (or your file path)
"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth"; // Assuming auth setup returns { user: User | null }
import { revalidatePath } from "next/cache";
import { orderValidationSchema } from "./order-validations"; // Adjust path if needed
import { OrderInput, PlaceOrderResponse } from "./order-types"; // Adjust path if needed
import { Prisma, OrderStatus } from "@prisma/client"; // Import Prisma namespace & OrderStatus enum

const VAT_RATE = 0.15;

// Define discount percentages directly
const TIER_DISCOUNTS: Record<string, number> = {
  "BRONZE": 0,
  "SILVER": 0.05, // 5% discount
  "GOLD": 0.10,   // 10% discount
  "PLATINUM": 0.15 // 15% discount
};

// --- Helper Functions ---

function validateTier(tier: string | null | undefined): string {
  if (!tier) return "BRONZE";
  const upperTier = tier.toUpperCase();
  return TIER_DISCOUNTS.hasOwnProperty(upperTier) ? upperTier : "BRONZE";
}

function calculateDiscountedPrice(price: number, tier: string | null | undefined): number {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    console.error("Invalid or negative price received in calculateDiscountedPrice:", price);
    return typeof price === 'number' && !isNaN(price) ? Math.max(0, price) : 0;
  }
  const validTier = validateTier(tier);
  const discountPercentage = TIER_DISCOUNTS[validTier] || 0;
  return price * (1 - discountPercentage);
}

// --- Main Server Action ---

export async function placeOrder(
  formData: OrderInput,
): Promise<PlaceOrderResponse> {
  try {
    // 1. Authentication
    const authResult = await validateRequest();
    const user = authResult?.user;
    if (!user || !user.id) {
      return { success: false, message: "Unauthorized: User not found or missing ID." };
    }

    // 2. Validate Input Data
    const validationResult = orderValidationSchema.safeParse(formData);
    if (!validationResult.success) {
      console.error("Order validation failed:", validationResult.error.flatten());
      return { success: false, message: "Invalid form data submitted. Please check your input." };
    }
    const validatedData = validationResult.data; // Use validated data

    // 3. Fetch User Tier
    const userWithTier = await prisma.user.findUnique({
      where: { id: user.id },
      select: { tier: true }
    });
    const userTier = validateTier(userWithTier?.tier);

    // 4. Get Cart Data
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            variation: true // Only include variation, product isn't needed for order logic
          }
        }
      }
    });

    if (!cart || cart.cartItems.length === 0) {
      return { success: false, message: "Your shopping cart is empty." };
    }

    // 5. Calculate Totals & Prepare Order Items
    let originalSubtotal = 0;
    let discountedSubtotalBeforeVAT = 0;
    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of cart.cartItems) {
      if (!item?.variation?.price || typeof item.variation.price !== 'number' || isNaN(item.variation.price) || item.variation.price < 0) {
        throw new Error(`Invalid cart item data found (ID: ${item?.id}, Variation ID: ${item?.variationId}). Cannot proceed.`);
      }
      if (typeof item.quantity !== 'number' || isNaN(item.quantity) || item.quantity <= 0) {
         throw new Error(`Invalid quantity for cart item (ID: ${item?.id}, Variation ID: ${item?.variationId}). Cannot proceed.`);
      }

      const originalItemPrice = item.variation.price;
      const discountedItemPrice = calculateDiscountedPrice(originalItemPrice, userTier);
      originalSubtotal += originalItemPrice * item.quantity;
      discountedSubtotalBeforeVAT += discountedItemPrice * item.quantity;

      orderItemsData.push({
         variationId: item.variationId,
         quantity: item.quantity,
         price: discountedItemPrice, // Price per item after discount
      });
    }

     if (isNaN(originalSubtotal) || isNaN(discountedSubtotalBeforeVAT)) {
         throw new Error("Calculation error resulted in NaN for subtotals.");
     }

    const discountAmount = originalSubtotal - discountedSubtotalBeforeVAT;
    const vatAmount = discountedSubtotalBeforeVAT * VAT_RATE;
    // Ensure final total is a number, handle potential NaN from calculations
    const finalTotalWithVAT = isNaN(discountedSubtotalBeforeVAT + vatAmount) ? 0 : discountedSubtotalBeforeVAT + vatAmount;


    // 6. Database Transaction
    return await prisma.$transaction(async (tx) => {
      // Create the Order - ** Matching fields from your schema **
      const order = await tx.order.create({
        data: {
          userId: user.id, // Link to user

          // Fields directly from your Order schema, mapped from validatedData
          captivityBranch:    validatedData.captivityBranch,
          methodOfCollection: validatedData.methodOfCollection,
          salesRep:           validatedData.salesRep,         // Ensure this exists in validatedData if needed
          referenceNumber:    validatedData.referenceNumber,  // Ensure this exists in validatedData if needed
          firstName:          validatedData.firstName,
          lastName:           validatedData.lastName,
          companyName:        validatedData.companyName,      // Maps directly
          countryRegion:      validatedData.countryRegion,    // Maps directly
          streetAddress:      validatedData.streetAddress,    // Corrected: Maps directly
          apartmentSuite:     validatedData.apartmentSuite,   // Add this field if it's in your form/validatedData
          townCity:           validatedData.townCity,         // Corrected: Maps directly
          province:           validatedData.province,         // Corrected: Maps directly
          postcode:           validatedData.postcode,         // Corrected: Maps directly
          phone:              validatedData.phone,            // Maps directly
          email:              validatedData.email,            // Maps directly
          paymentMethod:      validatedData.paymentMethod,    // Maps directly (optional in schema)
          orderNotes:         validatedData.orderNotes,       // Add this field if it's in your form/validatedData
          agreeTerms:         validatedData.agreeTerms ?? false, // Use validated value or default
          receiveEmailReviews:validatedData.receiveEmailReviews, // Use validated value (optional)

          // Status and Calculated fields
          status:             OrderStatus.PENDING,            // Use imported Enum if available, otherwise "PENDING" string
          totalAmount:        finalTotalWithVAT,
          subtotal:           discountedSubtotalBeforeVAT,
          discountAmount:     discountAmount,
          vatAmount:          vatAmount,
          originalSubtotal:   originalSubtotal,
          tierApplied:        userTier,
        },
      });

      // Create Order Items
      await tx.orderItem.createMany({
          data: orderItemsData.map(item => ({ ...item, orderId: order.id })),
          skipDuplicates: false,
      });

      // Update Stock for each Variation
      for (const cartItem of cart.cartItems) {
           if (!cartItem.variationId || !cartItem.quantity) continue;

           // ** IMPORTANT: Verify stock field name in 'Variation' model **
           // Assuming the stock field is named 'quantity' in your Variation model
           await tx.variation.update({
               where: { id: cartItem.variationId },
               data: {
                   // Replace 'quantity' if your stock field has a different name (e.g., inventory, stockLevel)
                   quantity: {
                       decrement: cartItem.quantity
                   }
               },
           });
           // Optional: Add check for negative stock here if needed
      }

      // Clear the user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Revalidate relevant paths
      revalidatePath("/cart");
      revalidatePath("/orders");
      // Add any other paths that need revalidation (e.g., user account)
      // revalidatePath("/account/orders");

      // Return Success
      return {
        success: true,
        message: "Order placed successfully!",
        orderId: order.id
      };
    }); // End of $transaction

  } catch (error) {
    console.error("Error placing order:", error);
    // Check for Prisma specific errors for potentially better logging/handling
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred while placing your order. Please try again later."
    };
  }
}