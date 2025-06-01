// store/useCategoryStore.ts
import { GifticonItem, GifticonNFT } from "@/types";
import { create } from "zustand";

type ItemStore = {
  items: GifticonItem[];
  myItems: GifticonNFT[];
  mySaleItems: GifticonNFT[];

  setItems: (newItems: GifticonItem[]) => void;
  setMyItems: (newItems: GifticonNFT[]) => void;
  setMySaleItems: (newItems: GifticonNFT[]) => void;

  clearItems: () => void;
  clearMyItems: () => void;
  clearMySaleItems: () => void;
};

export const useItemStore = create<ItemStore>((set) => ({
  items: [],
  myItems: [],
  mySaleItems: [],

  setItems: (newItems) => set({ items: newItems }),
  setMyItems: (newItems) => set({ myItems: newItems }),
  setMySaleItems: (newItems) => set({ mySaleItems: newItems }),

  clearItems: () => set({ items: [] }),
  clearMyItems: () => set({ myItems: [] }),
  clearMySaleItems: () => set({ mySaleItems: [] }),
}));
