// src/app/(user)/membership/_actions/actions.ts
"use server";

import { z } from "zod";
import { validateRequest } from "@/auth"; // Adjust path if needed
import prisma from "@/lib/prisma"; // Adjust path if needed
import { TierApplicationFormData, TierApplicationResponse } from "../types"; // Adjust path
import { tierApplicationSchema } from "../validations"; // Adjust path

export async function submitTierApplication(
  formData: TierApplicationFormData,
): Promise<TierApplicationResponse> {
  const { user, session } = await validateRequest();

  if (!session || !user || user.role !== "CUSTOMER") {
    return {
        success: false,
        message: "Unauthorized: You must be logged in as a customer.",
        error: "Authentication required.",
    };
  }

  try {
    // Validate the submitted form data using the imported schema
    const validatedData = tierApplicationSchema.parse(formData);

    // --- IMPORTANT ---
    // The following 'upsert' call relies on 'userId' being marked as '@unique'
    // in your 'TierAppForm' model within 'schema.prisma'.
    // Ensure you have:
    // 1. Added '@unique' to the userId field in schema.prisma.
    // 2. Run 'npx prisma generate'.
    // 3. Applied the schema change (e.g., 'npx prisma migrate dev').
    // --- --- --- ---

    // Upsert: Find existing application by the UNIQUE userId or create a new one.
    const tierApplication = await prisma.tierAppForm.upsert({
        where: { userId: user.id }, // This now works because userId is unique
        update: {
            package: validatedData.package, // Update the package if existing record found
            updatedAt: new Date(),        // Explicitly set updatedAt
        },
        create: {
            package: validatedData.package,
            userId: user.id,
        },
    });

    return {
      success: true,
      application: { // Map to expected return type structure
          id: tierApplication.id,
          package: tierApplication.package, // Ensure package type matches TierApplicationResponse
          userId: tierApplication.userId,
          createdAt: tierApplication.createdAt,
          updatedAt: tierApplication.updatedAt,
      },
      message: `Application for ${validatedData.package} tier submitted!`,
    };

  } catch (error) {
    console.error("Error submitting tier application:", error);

    if (error instanceof z.ZodError) {
      // Return Zod error messages
      return {
          success: false,
          message: "Validation failed.",
          error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
      };
    }

    // Handle other potential errors
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
        success: false,
        message: "Failed to submit tier application.",
        error: errorMessage,
    };
  }
}


export async function getUserTierStatus(): Promise<{
  success: boolean;
  currentTier?: string | null; // Use string or your TierLevel type/enum
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
  } | null;
  latestApplication?: {
    id: string;
    package: string; // Use string or your TierPackage type/enum
    createdAt: Date;
  } | null;
  error?: string | null;
}> {
  const { user, session } = await validateRequest();
  if (!session || !user || user.role !== "CUSTOMER") {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { tier: true, firstName: true, lastName: true, displayName: true },
    });
    const latestApplication = await prisma.tierAppForm.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, package: true, createdAt: true }, // Select only needed fields
    });

    const currentTier = userData?.tier || "BRONZE"; // Default to BRONZE

    // Determine if the latest application represents a *different* tier than the current one
    const showLatestApplication =
      latestApplication && latestApplication.package !== currentTier
        ? {
            id: latestApplication.id,
            package: latestApplication.package, // Map package directly
            createdAt: latestApplication.createdAt,
          }
        : null;

    return {
      success: true,
      currentTier,
      user: userData ? { // Only include user object if userData exists
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || null,
      } : null,
      latestApplication: showLatestApplication,
    };
  } catch (error) {
    console.error("Error fetching tier status:", error);
    return { success: false, error: "Failed to fetch tier status." };
  }
}


export async function getAppliedTier(): Promise<{
    success: boolean;
    appliedTier: string | null; // Use string or your TierPackage type/enum
    error?: string | null;
}> {
    const { user, session } = await validateRequest();
    if (!session || !user || user.role !== "CUSTOMER") {
        return { success: false, appliedTier: null, error: "Unauthorized" };
    }
    try {
        // Fetch both concurrently for efficiency
        const [userData, latestApplication] = await Promise.all([
            prisma.user.findUnique({
                where: { id: user.id },
                select: { tier: true },
            }),
            prisma.tierAppForm.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" },
                select: { package: true },
            })
        ]);

        const currentTier = userData?.tier || "BRONZE"; // Default to BRONZE

        // Determine the pending tier (only if application exists and is different from current)
        const pendingTier =
            latestApplication && latestApplication.package !== currentTier
                ? latestApplication.package
                : null;

        return { success: true, appliedTier: pendingTier };
    } catch (error) {
        console.error("Error fetching applied tier:", error);
        return { success: false, appliedTier: null, error: "Failed to fetch applied tier." };
    }
}