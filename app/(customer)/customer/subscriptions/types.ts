import { z } from "zod";
import { tierApplicationSchema } from "./validations";

// Enum for available tier packages
export enum TierPackage {
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
}

// Form data type (derived from schema)
export type TierApplicationFormData = z.infer<typeof tierApplicationSchema>;

// Response type from server actions
export interface TierApplicationResponse {
  success: boolean;
  message?: string;
  application?: {
    id: string;
    package: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

// You may need additional types for your API responses