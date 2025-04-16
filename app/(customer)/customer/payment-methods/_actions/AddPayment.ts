"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { z } from "zod";

// Define types for payment method
export type PaymentMethodFormData = {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string; // Not stored, only used for validation
  isDefault: boolean;
};

export type PaymentMethodResponse = {
  success: boolean;
  paymentMethod?: {
    id: string;
    cardholderName: string;
    lastFourDigits: string;
    cardType: string | null;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
  };
  message: string;
};

// Add payment method
export async function addPaymentMethod(
  formData: PaymentMethodFormData
): Promise<PaymentMethodResponse> {
  const { user, session } = await validateRequest();

  if (!session || !user) {
    throw new Error("Unauthorized: You must be logged in to add a payment method");
  }

  try {
    // Validate form data
    // Implement validation here
    
    // Extract last 4 digits
    const lastFourDigits = formData.cardNumber.slice(-4);
    
    // Determine card type based on first digit/pattern
    const cardType = determineCardType(formData.cardNumber);
    
    // If this is set as default, unset any existing default
    if (formData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }
    
    // Create new payment method
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        cardholderName: formData.cardholderName,
        cardNumber: encryptCardNumber(formData.cardNumber), // Implement encryption
        lastFourDigits,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cardType,
        isDefault: formData.isDefault
      }
    });
    
    return {
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        cardholderName: paymentMethod.cardholderName,
        lastFourDigits: paymentMethod.lastFourDigits,
        cardType: paymentMethod.cardType,
        expiryMonth: paymentMethod.expiryMonth,
        expiryYear: paymentMethod.expiryYear,
        isDefault: paymentMethod.isDefault
      },
      message: "Payment method added successfully"
    };
  } catch (error) {
    console.error("Error adding payment method:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add payment method"
    };
  }
}

// Get user's payment methods
export async function getUserPaymentMethods() {
  const { user, session } = await validateRequest();

  if (!session || !user) {
    throw new Error("Unauthorized: You must be logged in to view payment methods");
  }

  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        cardholderName: true,
        lastFourDigits: true,
        cardType: true,
        expiryMonth: true,
        expiryYear: true,
        isDefault: true
      },
      orderBy: { isDefault: 'desc' }
    });

    return {
      success: true,
      paymentMethods
    };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return {
      success: false,
      paymentMethods: [],
      error: "Failed to fetch payment methods"
    };
  }
}

// Helper function to determine card type
function determineCardType(cardNumber: string): string | null {
  // Clean the input
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Simple detection based on card patterns
  if (cleaned.startsWith('4')) return 'VISA';
  if (/^5[1-5]/.test(cleaned)) return 'MASTERCARD';
  if (/^3[47]/.test(cleaned)) return 'AMEX';
  if (/^6(?:011|5)/.test(cleaned)) return 'DISCOVER';
  
  return null;
}

// This is a placeholder - in production use proper encryption
function encryptCardNumber(cardNumber: string): string {
  // In a real app, use a secure encryption library
  // This is just a placeholder for illustration
  return `ENCRYPTED-${cardNumber}`;
}