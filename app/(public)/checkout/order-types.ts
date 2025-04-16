// Types for order-related operations

import { z } from "zod";
import { orderValidationSchema } from "./order-validations";

/**
 * Order input data type based on the Zod schema
 */
export type OrderInput = z.infer<typeof orderValidationSchema>;

/**
 * Response type for placing an order
 */
export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  errors?: Record<string, string>;
}

/**
 * Response type for getting order details
 */
export interface GetOrderDetailsResponse {
  success: boolean;
  order?: any; // TODO: Replace 'any' with a specific Prisma generated type for Order with relations
  message?: string;
}

/**
 * Cart item with relation to variation data (example type, adjust if needed)
 */
export interface CartItemWithVariation {
  id: string;
  cartId: string;
  variationId: string;
  quantity: number;
  variation: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    productId: string;
    color: string;
    size: string;
    imageUrl: string;
    product: {
      id: string;
      productName: string;
      productImgUrl: string; // Assuming this exists based on OrderSummary usage
    };
  };
}