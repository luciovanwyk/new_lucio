// app/(customer)/settings/_actions/actions.ts

"use server";

import { z } from "zod";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { verify, hash } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

import {
  ProfileUpdateFormValues,
  profileUpdateSchema,
  CheckoutDetailsFormValues,
  checkoutDetailsSchema,
  PasswordChangeFormValues,
  passwordChangeSchema,
  PasswordChangeResult,
  UpdateActionResult,
} from "./types";

// --- Update Customer Profile Information ---
export async function updateCustomerProfileInfo(
  formData: ProfileUpdateFormValues,
): Promise<UpdateActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "User not authenticated." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        /* ... */
      },
    });

    return { success: true, message: "Profile information updated successfully." };
  } catch (error) {
    return { success: false, error: "Failed to update profile information." };
  }
}

// --- Update Checkout Details ---
export async function updateCheckoutDetails(
  formData: CheckoutDetailsFormValues,
): Promise<UpdateActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "User not authenticated." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        /* ... */
      },
    });

    return { success: true, message: "Checkout details updated successfully." };
  } catch (error) {
    return { success: false, error: "Failed to update checkout details." };
  }
}

// --- Update Customer Details ---
export async function updateCustomerDetails(
  formData: ProfileUpdateFormValues,
): Promise<UpdateActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "User not authenticated." };
    }

    const validatedData = profileUpdateSchema.parse(formData);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        displayName: validatedData.displayName,
        username: validatedData.username,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        streetAddress: validatedData.streetAddress,
        suburb: validatedData.suburb,
        townCity: validatedData.townCity,
        postcode: validatedData.postcode,
        country: validatedData.country,
      },
    });

    return { success: true, message: "Profile information updated successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors as Partial<Record<keyof ProfileUpdateFormValues, string>>;
      return {
        success: false,
        error: "Invalid input. Please check the fields.",
        fieldErrors: fieldErrors,
      };
    }
    console.error("Error updating customer details:", error);
    return { success: false, error: "Failed to update profile information." };
  }
}

// --- Change Password ---
export async function changePassword(
  formData: PasswordChangeFormValues,
): Promise<PasswordChangeResult> {
  console.log("changePassword action initiated.");

  try {
    const { user } = await validateRequest();
    if (!user) {
      console.warn("Password change attempt failed: User not authenticated.");
      return { success: false, error: "User not authenticated." };
    }
    console.log(`Authenticated user for password change: ${user.id}`);

    const validatedData = passwordChangeSchema.parse(formData);
    console.log("Password change form data validated.");

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!dbUser || !dbUser.passwordHash) {
      console.error(`Failed to retrieve password hash for user ${user.id}.`);
      return { success: false, error: "Could not retrieve current user data." };
    }

    console.log(`Verifying current password for user ${user.id} using @node-rs/argon2...`);
    let validPassword = false;
    try {
      validPassword = await verify(dbUser.passwordHash, validatedData.currentPassword);
    } catch (verifyError) {
      console.error(`Error verifying password for user ${user.id}:`, verifyError);
      return {
        success: false,
        error: "Failed to verify current password. Please try again.",
      };
    }

    if (!validPassword) {
      console.warn(`Incorrect current password entered for user ${user.id}.`);
      return {
        success: false,
        error: "Incorrect current password.",
        fieldErrors: { currentPassword: "Incorrect current password." },
      };
    }
    console.log("Current password verified successfully.");

    console.log("Hashing new password using @node-rs/argon2...");
    const newPasswordHash = await hash(validatedData.newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    console.log("New password hashed.");

    console.log(`Updating password hash in DB for user ${user.id}...`);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });
    console.log(`Password updated successfully in DB for user ${user.id}.`);

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn("Zod validation error during password change:", error.flatten());
      const refinementError = error.errors.find(
        (e) => e.code === "custom" && e.path.includes("confirmNewPassword"),
      );
      if (refinementError) {
        return {
          success: false,
          error: refinementError.message,
          fieldErrors: { confirmNewPassword: refinementError.message },
        };
      }
      const fieldErrors = error.flatten().fieldErrors as Partial<Record<keyof PasswordChangeFormValues, string>>;
      return {
        success: false,
        error: "Invalid input. Please check the fields.",
        fieldErrors: fieldErrors,
      };
    }
    console.error("Critical error changing password:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}