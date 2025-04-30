// --- Result Types --- //
export interface DeleteBannerResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UpsertBannerResult {
  success: boolean;
  message?: string;
  error?: string;
  newImageUrl?: string; // Return the URL of the uploaded image
}