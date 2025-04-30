// actions.ts
import { Slide } from "./types";
import { validateSlide, uploadSlide, deleteSlide } from "./utils";

export const uploadSlideAction = async (slide: Slide): Promise<Slide> => {
  const errors = validateSlide(slide);
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return uploadSlide(slide);
};

export const deleteSlideAction = async (slideId: string): Promise<{ success: boolean; error?: string }> => {
  return deleteSlide(slideId);
};