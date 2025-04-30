// utils.ts
import { Slide } from "./types";

export const validateSlide = (slide: Slide): string[] => {
  const errors: string[] = [];

  if (!slide.title) {
    errors.push("Title is required");
  }

  if (!slide.description) {
    errors.push("Description is required");
  }

  if (!slide.sliderImageurl) {
    errors.push("Image URL is required");
  }

  return errors;
};

export const uploadSlide = async (file: File): Promise<Slide> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload-slide", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload slide");
    }

    return response.json();
  } catch (error) {
    console.error("Error uploading slide:", error);
    throw error;
  }
};

export const deleteSlide = async (slideId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`/api/delete-slide/${slideId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete slide");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting slide:", error);
    return { success: false, error: error.message };
  }
};