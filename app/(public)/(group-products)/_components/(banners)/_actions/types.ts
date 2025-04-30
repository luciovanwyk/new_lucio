// types.ts
export interface Slide {
  id: string;
  title: string;
  description: string;
  sliderImageurl: string;
  bgColor?: string; // Optional if not always required
  order?: number; // Optional if not always required
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}