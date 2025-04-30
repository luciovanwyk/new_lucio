// use-slide-store.ts
import { create } from 'zustand';
import { Slide } from '../(banners)/_actions/types';

interface SlideStore {
  banner: Slide | null;
  setBanner: (banner: Slide | null) => void;
  deleteBanner: () => void;
}

export const useSlideStore = create<SlideStore>((set) => ({
  banner: null,
  setBanner: (banner: Slide | null) => set({ banner }),
  deleteBanner: () => set({ banner: null }),
}));