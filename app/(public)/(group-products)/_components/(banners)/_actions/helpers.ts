import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { UserRole } from "@prisma/client";
import { del } from "@vercel/blob";

// --- Helper Functions --- //
export async function validateEditorRole(): Promise<{ user: { id: string; role: UserRole } }> {
  const { user } = await validateRequest();
  if (!user || user.role !== UserRole.EDITOR) {
    throw new Error("Unauthorized: Only editors can update banners.");
  }
  return { user };
}

export async function deleteOldBannerImage(oldImageUrl: string | null): Promise<void> {
  if (oldImageUrl) {
    try {
      console.log(`Deleting old blob: ${oldImageUrl}`);
      await del(oldImageUrl); // Pass the full URL to del
      console.log(`Old blob deleted successfully.`);
    } catch (delError) {
      // Log error but don't fail the whole operation
      console.error(`Failed to delete old blob ${oldImageUrl}:`, delError);
    }
  }
}