// src/app/(user)/membership/validations.ts
import { z } from "zod";
import { TierPackage } from "./types"; // Adjust path if needed

/**
 * Zod validation schema for tier application form
 */
export const tierApplicationSchema = z.object({
  package: z.nativeEnum(TierPackage, { // Use nativeEnum for TS enums
    required_error: "Please select a tier package to apply for",
    invalid_type_error: "Invalid tier package selected",
  }),
});

/**
 * Helper function to validate tier application form data
 * @param data The form data to validate
 * @returns The validated data or throws a ZodError
 */
export function validateTierApplication(data: unknown): z.infer<typeof tierApplicationSchema> {
  return tierApplicationSchema.parse(data);
}