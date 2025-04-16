// src/hooks/useTierDiscount.ts
"use client"; // KEEP THIS

import { useUser } from "@/app/hook/use-user"; // Adjust path as needed
import { 
  getTierConfig, 
  TierConfig, 
  TierLevel, 
  TIER_ORDER 
} from "@/lib/config/tiers";

// Define the return type for the hook
interface UseTierDiscountReturn {
  userTier: TierLevel;
  tierConfig: Readonly<TierConfig>;
  discountPercentage: number;
  hasDiscount: boolean;
  calculatePrice: (originalPrice: number) => number;
  isLoading: boolean;
}

// Define a more complete user type that includes the tier property
// This extends whatever your auth system returns with our additional fields
interface UserWithTier {
  tier?: string | null;
  // Add other potential fields here if needed
}

export function useTierDiscount(): UseTierDiscountReturn {
  const { user, isLoading } = useUser();
  
  // Type assertion to handle the missing tier property in the User type
  const userWithTier = user as unknown as UserWithTier;
  
  // Determine tier safely, defaulting to BRONZE
  const userTier = (userWithTier?.tier?.toUpperCase() as TierLevel) ?? TIER_ORDER[0];

  // Get the full config and the discount percentage using helpers
  const tierConfig = getTierConfig(userTier);
  const discountPercentage = tierConfig.discount;

  const hasDiscount = !isLoading && discountPercentage > 0;

  // Calculation function to apply discount to a price
  const calculatePrice = (originalPrice: number): number => {
    if (typeof originalPrice !== 'number' || isNaN(originalPrice)) {
      console.warn(`Invalid price passed to calculatePrice: ${originalPrice}`);
      return 0;
    }
    // Apply discount based on the hook's state
    return originalPrice * (1 - discountPercentage);
  };

  return {
    userTier,
    tierConfig,
    discountPercentage,
    hasDiscount,
    calculatePrice,
    isLoading, // Pass loading state through
  };
}