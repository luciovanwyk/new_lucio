// app/(public)/(group-products)/_actions/bannerManagementActions.ts

"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserRole } from "@prisma/client";

// --- Type Definitions --- //
interface DeleteBannerResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface UpsertBannerResult {
  success: boolean;
  message?: string;
  error?: string;
  newImageUrl?: string; // Return the URL of the uploaded image
}

// --- Constants --- //
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE = 6 * 1024 * 1024; // 6MB

// --- Main Functions --- //

/**
 * Creates or updates a collection banner by uploading an image.
 * Requires EDITOR role.
 * @param category - The category identifier (e.g., 'headwear').
 * @param formData - FormData containing the 'image' file.
 */
export async function upsertCollectionBanner(
  category: string,
  formData: FormData,
): Promise<UpsertBannerResult> {
  const normalizedCategory = category.toLowerCase();
  const file = formData.get("image") as File | null;

  if (!normalizedCategory) {
    return { success: false, error: "Category is required." };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "An image file is required." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid image type. Allowed: JPG, PNG, WEBP, GIF",
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      success: false,
      error: `Image size exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
    };
  }

  try {
    const { user } = await validateRequest();
    if (!user || user.role !== UserRole.EDITOR) {
      return {
        success: false,
        error: "Unauthorized: Only editors can update banners.",
      };
    }

    const existingBanner = await prisma.collectionBanner.findUnique({
      where: { category: normalizedCategory },
      select: { imageUrl: true },
    });
    const oldImageUrl = existingBanner?.imageUrl;

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const blobPath = `banners/${normalizedCategory}/${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob?.url) {
      throw new Error("Image upload failed. Could not get URL from blob storage.");
    }
    const newImageUrl = blob.url;

    await prisma.collectionBanner.upsert({
      where: { category: normalizedCategory },
      update: { imageUrl: newImageUrl, editorId: user.id },
      create: {
        category: normalizedCategory,
        imageUrl: newImageUrl,
        editorId: user.id,
      },
    });

    if (oldImageUrl && oldImageUrl !== newImageUrl) {
      try {
        await del(oldImageUrl);
      } catch (delError) {
        console.error(`Failed to delete old blob ${oldImageUrl}:`, delError);
      }
    }

    const publicPath = `/${normalizedCategory === "all-collections" ? "all-collections" : normalizedCategory}`;
    revalidatePath(publicPath);

    return {
      success: true,
      message: `Banner for ${normalizedCategory} updated successfully.`,
      newImageUrl: newImageUrl,
    };
  } catch (error) {
    console.error(`Error upserting banner for ${normalizedCategory}:`, error);
    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to update banner: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "Failed to update banner due to an unexpected error.",
    };
  }
}

/**
 * Deletes a collection banner.
 * Requires EDITOR role.
 * @param category - The category identifier (e.g., 'headwear').
 */
export async function deleteCollectionBanner(
  category: string,
): Promise<DeleteBannerResult> {
  const normalizedCategory = category.toLowerCase();
  if (!normalizedCategory) {
    return { success: false, error: "Category is required." };
  }

  try {
    const { user } = await validateRequest();
    if (!user || user.role !== UserRole.EDITOR) {
      return { success: false, error: "Unauthorized" };
    }

    const bannerToDelete = await prisma.collectionBanner.findUnique({
      where: { category: normalizedCategory },
      select: { imageUrl: true },
    });

    await prisma.collectionBanner.delete({
      where: { category: normalizedCategory },
    });

    if (bannerToDelete?.imageUrl) {
      try {
        await del(bannerToDelete.imageUrl);
      } catch (delError) {
        console.error(`Failed to delete blob ${bannerToDelete.imageUrl}:`, delError);
      }
    }

    const publicPath = `/${normalizedCategory === "all-collections" ? "all-collections" : normalizedCategory}`;
    revalidatePath(publicPath);

    return {
      success: true,
      message: `Banner for ${normalizedCategory} deleted.`,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return {
        success: true,
        message: `Banner for ${normalizedCategory} already removed.`,
      };
    }
    console.error(`Error deleting banner for ${normalizedCategory}:`, error);
    if (error instanceof Error) {
      return { success: false, error: `Delete failed: ${error.message}` };
    }
    return { success: false, error: "Unexpected error deleting banner." };
  }
}