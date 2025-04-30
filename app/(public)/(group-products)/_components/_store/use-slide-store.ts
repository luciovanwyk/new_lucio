// use-slide-store.ts
import { Slide } from '@/app/(public)/_components/(section-1)/types';
import create from 'zustand';

interface SlideStore {
  banner: Slide | null;
  setBanner: (banner: Slide | null) => void;
}

export const useSlideStore = create<SlideStore>((set) => ({
  banner: null,
  setBanner: (banner) => set({ banner }),
}));