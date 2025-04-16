import { z } from "zod";

export const paymentMethodSchema = z.object({
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string()
    .min(13, "Card number must be between 13-19 digits")
    .max(19, "Card number must be between 13-19 digits")
    .refine(cardNumber => {
      // Remove non-digit characters
      const cleaned = cardNumber.replace(/\D/g, '');
      // Validate using Luhn algorithm
      return validateLuhn(cleaned);
    }, "Invalid card number"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Month must be between 01-12"),
  expiryYear: z.string().regex(/^20\d{2}$/, "Year must be in format YYYY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
  isDefault: z.boolean().default(false)
});

// Luhn algorithm for card validation
function validateLuhn(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

export function validatePaymentMethod(data: unknown) {
  return paymentMethodSchema.parse(data);
}