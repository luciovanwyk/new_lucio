"use server";

import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export type UploadBackgroundResponse = {
  success: boolean;
  backgroundUrl?: string;
  error?: string;
};

export async function uploadBackground(
  formData: FormData
): Promise<UploadBackgroundResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const file = formData.get("background") as File;

    if (!file || !file.size) throw new Error("No background image provided");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        "Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, SVG, BMP, TIFF"
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("File size must be less than 5MB");
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `backgrounds/user_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      // WARNING: Hardcoded token below - replace with env variable in production!
      token: "vercel_blob_rw_NV25OI7KD1Z6wh0A_cgGtMOzLQwHqrRM7fBhFTuhcjEzS5I",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    await prisma.user.update({
      where: { id: user.id },
      data: { backgroundUrl: blob.url },
    });

    return {
      success: true,
      backgroundUrl: blob.url,
    };
  } catch (error) {
    console.error("Error uploading background:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}
