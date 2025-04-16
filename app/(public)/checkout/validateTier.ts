import { TierLevel } from "@/lib/config/tiers"; // Keep importing the TYPE

// --- Define the runtime representation of the tiers ---
// Use 'as const' for better type inference (string literals) and immutability
export const VALID_TIER_LEVELS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;

// You could even derive the type from this, though importing it is also fine:
// type TierLevel = typeof VALID_TIER_LEVELS[number];


/**
 * Type guard to check if a string is a valid TierLevel based on our runtime values
 * @param value - The string to check
 * @returns Boolean indicating if the value is a valid TierLevel
 */
export function isTierLevel(value: string): value is TierLevel {
  // Check against the actual runtime values (cast needed because includes expects string)
  return (VALID_TIER_LEVELS as readonly string[]).includes(value);
}

/**
 * Validates and normalizes a tier value to ensure it's a valid TierLevel string.
 * Returns a default tier (BRONZE) if the provided value is invalid.
 *
 * @param tier - The tier value to validate (string, null or undefined)
 * @param defaultTier - Optional default tier string to use (defaults to "BRONZE")
 * @returns A valid TierLevel string value
 */
export function validateTier(
  tier: string | null | undefined,
  // Default parameter must be a VALUE, not a type
  defaultTier: TierLevel = "BRONZE"
): TierLevel {
  // Return default if no tier provided
  if (!tier) return defaultTier;

  // Normalize to uppercase for comparison
  const normalizedTier = tier.toUpperCase();

  // Check if the normalized tier is a valid TierLevel string value
  if (isTierLevel(normalizedTier)) {
    // We know normalizedTier is now a valid TierLevel string
    return normalizedTier;
  }

  // Return default tier string if validation fails
  return defaultTier;
}


/**
 * Validates if a tier exists and is a valid upgrade from the current tier
 *
 * @param currentTier - The user's current tier
 * @param targetTier - The tier they want to upgrade to
 * @returns Boolean indicating if this is a valid upgrade
 */
export function isValidTierUpgrade(
  currentTier: TierLevel | string | null | undefined,
  targetTier: TierLevel | string | null | undefined
): boolean {
  // Use validateTier which returns the TierLevel string value
  const validCurrentTier = validateTier(currentTier as string);
  const validTargetTier = validateTier(targetTier as string);

  // Use string literals as keys for the value map
  const tierValues: Record<TierLevel, number> = {
    "BRONZE": 0,
    "SILVER": 1,
    "GOLD": 2,
    "PLATINUM": 3
  };

  // Ensure both tiers exist in the map (should be guaranteed by validateTier)
  if (!(validCurrentTier in tierValues) || !(validTargetTier in tierValues)) {
      console.warn("isValidTierUpgrade: Invalid tier detected after validation.");
      return false;
  }

  // Upgrade is valid if target tier value is higher than current tier value
  return tierValues[validTargetTier] > tierValues[validCurrentTier];
}

/**
 * Get the next tier level string above the current one
 *
 * @param currentTier - The current tier string
 * @returns The next TierLevel string, or null if already at highest tier
 */
export function getNextTier(currentTier: TierLevel | string | null | undefined): TierLevel | null {
  // Use validateTier which returns the TierLevel string value
  const validTier = validateTier(currentTier as string);

  // Compare against string literal values
  switch (validTier) {
    case "BRONZE":
      return "SILVER"; // Return string literal
    case "SILVER":
      return "GOLD";   // Return string literal
    case "GOLD":
      return "PLATINUM"; // Return string literal
    case "PLATINUM":
      return null;      // Already at highest tier
    default:
      // This case should ideally not be reached if validateTier works correctly
      console.warn("getNextTier: Reached default case with tier:", validTier);
      return "SILVER"; // Default next step, or maybe null?
  }
}

/**
 * Get all tier strings that are higher than the provided tier
 *
 * @param currentTier - The current tier string
 * @returns Array of TierLevel strings higher than the current one
 */
export function getUpgradeTiers(currentTier: TierLevel | string | null | undefined): TierLevel[] {
  // Use validateTier which returns the TierLevel string value
  const validTier = validateTier(currentTier as string);

  // Use the runtime array VALID_TIER_LEVELS
  const allTiers = VALID_TIER_LEVELS;
  const currentTierIndex = allTiers.indexOf(validTier);

  // Handle case where tier isn't found (shouldn't happen due to validateTier)
  if (currentTierIndex === -1) {
      console.warn("getUpgradeTiers: Current tier not found in VALID_TIER_LEVELS:", validTier);
      return [];
  }

  // Return slice of the runtime array (which contains string literals of type TierLevel)
  // Need to cast because slice returns (string | number | symbol)[] without 'as const' on original
  // Or just cast the result:
   return allTiers.slice(currentTierIndex + 1) as TierLevel[];
   // Alternatively, ensure allTiers is typed correctly:
   // const allTiers: readonly TierLevel[] = VALID_TIER_LEVELS;
   // return allTiers.slice(currentTierIndex + 1);
}