// store/useCategoryStore.ts
import { GifticonItem } from "@/types";
import { create } from "zustand";

type ItemStore = {
  items: GifticonItem[];
  setItems: (newItems: GifticonItem[]) => void;
  clearItems: () => void;
};

export const useItemStore = create<ItemStore>((set) => ({
  items: [],
  setItems: (newItems) => set({ items: newItems }),
  clearItems: () => set({ items: [] }),
}));
