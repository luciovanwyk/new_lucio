// src/app/(user)/membership/validations.ts
import { z } from "zod";
import { TierPackage } from "../types";

// Validation schema for tier application form
export const tierApplicationSchema = z.object({
  package: z.nativeEnum(TierPackage, {
    required_error: "Please select a membership tier",
    invalid_type_error: "Invalid tier selection",
  }),
});